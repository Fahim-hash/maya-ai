"use client";
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '@/firebase';
import { 
  collection, onSnapshot, doc, updateDoc, query, orderBy, 
  limit, addDoc, serverTimestamp, getDocs, deleteDoc 
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function MayaCommandCenter() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [mayaMessage, setMayaMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const ADMIN_UID = "tBmLIA0IJtWILtRPeEMzm9pF9cS2"; 

  // --- 1. Real-time Users Sync ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user || user.uid !== ADMIN_UID) {
        router.push('/dashboard');
      } else {
        const q = query(collection(db, "users"));
        return onSnapshot(q, (snapshot) => {
          const fetchedUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUsers(fetchedUsers);
          
          if (selectedUser) {
            const updated = fetchedUsers.find(u => u.id === selectedUser.id);
            if (updated) setSelectedUser(updated);
          }
          setLoading(false);
        });
      }
    });
    return () => unsubscribeAuth();
  }, [router, selectedUser?.id]);

  // --- 2. Chat Sync ---
  useEffect(() => {
    if (selectedUser && !selectedUser.isBanned) {
      const chatRef = collection(db, "users", selectedUser.id, "messages");
      const q = query(chatRef, orderBy("createdAt", "asc"), limit(50));
      return onSnapshot(q, (snapshot) => {
        setChatHistory(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      });
    } else {
      setChatHistory([]); 
    }
  }, [selectedUser?.id, selectedUser?.isBanned]);

  // --- 3. Core Actions ---
  const updateField = async (userId: string, data: any) => {
    try {
      setSelectedUser((prev: any) => ({ ...prev, ...data }));
      await updateDoc(doc(db, "users", userId), data);
    } catch (e) { console.error("Update Error:", e); }
  };

  const applyBan = async (hours: number) => {
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + hours);
    await updateField(selectedUser.id, { 
      isBanned: true, 
      banExpires: expiry.toISOString() 
    });
  };

  const liftBan = async () => {
    await updateField(selectedUser.id, { 
      isBanned: false, 
      banExpires: null 
    });
  };

  // --- NEW: COGNITIVE RESET (Brain Wipe) ---
  const wipeMemory = async () => {
    if (!selectedUser) return;
    const confirmWipe = window.confirm(`Warning: You are about to wipe ${selectedUser.name}'s entire memory. Proceed?`);
    
    if (confirmWipe) {
      try {
        const chatRef = collection(db, "users", selectedUser.id, "messages");
        const snapshot = await getDocs(chatRef);
        
        // Delete all messages
        const deletePromises = snapshot.docs.map(mDoc => deleteDoc(doc(db, "users", selectedUser.id, "messages", mDoc.id)));
        await Promise.all(deletePromises);

        // System message after wipe
        await addDoc(collection(db, "users", selectedUser.id, "messages"), {
          text: "Memory Purged. Neural link reset successfully.",
          role: 'assistant',
          createdAt: serverTimestamp()
        });

        alert("Subject memory wiped successfully.");
      } catch (e) {
        console.error("Wipe Error:", e);
        alert("Reset failed.");
      }
    }
  };

  const sendAsMaya = async () => {
    if (!mayaMessage.trim() || selectedUser?.isBanned) return;
    const msg = mayaMessage;
    setMayaMessage('');
    await addDoc(collection(db, "users", selectedUser.id, "messages"), {
      text: msg,
      role: 'assistant',
      createdAt: serverTimestamp()
    });
  };

  if (loading) return <div className="h-screen bg-[#05010a] flex items-center justify-center text-rose-500 font-black tracking-[10px]">INITIALIZING...</div>;

  return (
    <div className="h-screen w-screen bg-[#05010a] text-[#e2e2e2] overflow-hidden flex flex-col p-4 md:p-8 font-sans">
      
      {/* Header */}
      <header className="flex justify-between items-end mb-8 border-b border-white/5 pb-6 flex-shrink-0">
        <h1 className="text-5xl font-black italic uppercase tracking-tighter">Maya <span className="text-rose-600">Core</span></h1>
        <button onClick={() => router.push('/dashboard')} className="px-6 py-2 border border-white/10 rounded-full text-[10px] font-black uppercase hover:bg-white hover:text-black transition-all">Terminate</button>
      </header>

      <div className="flex-1 min-h-0 grid grid-cols-12 gap-8 overflow-hidden">
        
        {/* SIDEBAR: SUBJECT MATRIX */}
        <div className="col-span-3 bg-white/[0.02] border border-white/5 rounded-[40px] p-6 flex flex-col min-h-0 shadow-2xl">
          <p className="text-[9px] font-black text-rose-500 uppercase tracking-[4px] mb-6">Subject Matrix</p>
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-2">
            {users.map((u) => (
              <div key={u.id} onClick={() => setSelectedUser(u)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${selectedUser?.id === u.id ? 'bg-rose-600/10 border-rose-500' : 'bg-white/[0.02] border-white/5 hover:border-white/10'}`}>
                <h3 className={`font-black italic text-md uppercase truncate ${u.isBanned ? 'opacity-20' : ''}`}>{u.name || 'Undefined'}</h3>
                {u.isBanned && (
                  <span className="absolute top-2 right-4 text-[7px] font-bold text-rose-500 tracking-tighter animate-pulse uppercase">Link Severed</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MAIN CONTROL AREA */}
        <div className="col-span-9 flex min-h-0 gap-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {selectedUser ? (
              <div className="flex w-full gap-8 h-full">
                
                {/* CALIBRATION BOX */}
                <div className="w-1/2 bg-white/[0.03] border border-white/10 p-8 rounded-[40px] flex flex-col gap-8 h-full relative overflow-hidden shadow-2xl">
                  
                  {/* BAN OVERLAY */}
                  {selectedUser.isBanned && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-50 bg-[#05010a]/90 backdrop-blur-xl flex flex-col items-center justify-center text-center p-8 border border-rose-500/20 rounded-[40px]">
                      <div className="w-16 h-16 bg-rose-600/20 rounded-full flex items-center justify-center mb-6 border border-rose-500/30 animate-pulse">
                        <span className="text-rose-500 text-2xl">⚠️</span>
                      </div>
                      <h2 className="text-rose-600 font-black text-2xl italic mb-1 uppercase tracking-tighter">Banned</h2>
                      <button onClick={liftBan} className="px-10 py-4 bg-rose-600 text-white font-black text-[10px] rounded-full uppercase transition-all hover:bg-rose-500">Restore Access</button>
                    </motion.div>
                  )}

                  {/* MOOD CONTROLS */}
                  <div>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[4px] mb-6">Emotion Override</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['Sweet', 'Naughty', 'Angry', 'Sad'].map(m => (
                        <button key={m} onClick={() => updateField(selectedUser.id, { mood: m })}
                          className={`py-4 rounded-2xl text-[10px] font-black border transition-all ${selectedUser.mood === m ? 'bg-rose-600 border-rose-500 text-white shadow-[0_0_15px_#f43f5e44]' : 'bg-white/5 border-white/10 opacity-30 hover:opacity-100'}`}>{m.toUpperCase()}</button>
                      ))}
                    </div>
                  </div>

                  {/* RESET & LOVE SYNC */}
                  <div className="mt-auto space-y-6">
                    {/* BRAIN WIPE SECTION */}
                    <div className="p-4 bg-rose-950/20 border border-rose-500/20 rounded-[30px]">
                        <h4 className="text-[8px] font-black text-rose-500 uppercase tracking-[3px] mb-3 text-center">Neural Memory Control</h4>
                        <button 
                            onClick={wipeMemory}
                            className="w-full py-3 bg-rose-600/10 border border-rose-600/40 text-rose-400 text-[9px] font-black uppercase rounded-2xl hover:bg-rose-600 hover:text-white transition-all shadow-inner"
                        >
                            Purge Brain (Reset)
                        </button>
                    </div>

                    <div className="p-6 bg-black/40 rounded-[32px] border border-white/5">
                      <label className="text-[8px] font-bold text-rose-500 uppercase tracking-[3px] block mb-4">Love Sync: {selectedUser.loveLevel}%</label>
                      <input type="range" min="0" max="100" value={selectedUser.loveLevel || 0} onChange={(e) => updateField(selectedUser.id, { loveLevel: parseInt(e.target.value) })} className="w-full accent-rose-600" />
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-[4px]">Access Restriction</h4>
                      <div className="grid grid-cols-3 gap-2">
                        {[1, 24, 168].map(h => (
                          <button key={h} onClick={() => applyBan(h)} className="py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black hover:bg-rose-600 transition-all">{h}H</button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* NEURAL STREAM (CHAT BOX) */}
                <div className="w-1/2 bg-black/60 border border-white/10 rounded-[40px] flex flex-col h-full overflow-hidden shadow-2xl relative">
                  <div className="p-5 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
                     <h4 className="text-[9px] font-black text-blue-400 uppercase tracking-[4px]">Neural Stream: {selectedUser.name}</h4>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar flex flex-col">
                    {chatHistory.map((msg: any) => (
                      <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-3xl text-[11px] leading-relaxed ${msg.role === 'user' ? 'bg-white/5 text-white border border-white/10' : 'bg-rose-600/10 text-rose-100 border border-rose-500/20'}`}>
                          <p className="text-[7px] font-black uppercase mb-1 opacity-40 tracking-widest">{msg.role === 'user' ? selectedUser.name : 'Maya'}</p>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  <div className="p-4 bg-black/40 border-t border-white/10 flex gap-2 flex-shrink-0">
                     <input disabled={selectedUser.isBanned} value={mayaMessage} onChange={(e) => setMayaMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendAsMaya()} placeholder="Override Output..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-[11px] outline-none" />
                     <button disabled={selectedUser.isBanned} onClick={sendAsMaya} className="bg-rose-600 px-6 rounded-full text-[9px] font-black uppercase transition-all">Sync</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[60px] opacity-20">
                <span className="text-[10px] font-black uppercase tracking-[15px]">Select Subject</span>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f43f5e; border-radius: 10px; }
      `}</style>
    </div>
  );
}