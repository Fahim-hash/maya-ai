"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'; 
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>({ 
    name: '', age: '18', personality: 'Sweet', hobby: '', mood: 'Sweet', 
    loveLevel: 85, isBanned: false, banExpires: null 
  });
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('Welcome Back');
  const [appealMessage, setAppealMessage] = useState('');
  const [appealSent, setAppealSent] = useState(false);
  const router = useRouter();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  const personalityStyles: any = {
    Sweet: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", icon: "🌸", label: "Heart Mode" },
    Naughty: { bg: "bg-rose-600/10", border: "border-rose-500/40", text: "text-rose-500", icon: "🫦", label: "Spicy Mode" },
    Aggressive: { bg: "bg-red-900/20", border: "border-red-600/50", text: "text-red-500", icon: "🔥", label: "Intense Mode" },
    Mysterious: { bg: "bg-purple-900/10", border: "border-purple-500/30", text: "text-purple-400", icon: "🌑", label: "Deep Mode" }
  };

  const moodStyles: any = {
    Sweet: { text: "text-pink-400", accent: "bg-pink-500", icon: "🌸", label: "Pure & Sweet" },
    Naughty: { text: "text-rose-500", accent: "bg-rose-600", icon: "🫦", label: "Deeply Addicted" },
    Angry: { text: "text-orange-500", accent: "bg-orange-600", icon: "💢", label: "Heating Up" },
    Sad: { text: "text-blue-400", accent: "bg-blue-500", icon: "🌧️", label: "Needs Love" }
  };

  const currentStyle = personalityStyles[profile.personality] || personalityStyles.Sweet;
  const currentMood = moodStyles[profile.mood] || moodStyles.Sweet;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
    };
    window.addEventListener("mousemove", handleMouseMove);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        const hour = new Date().getHours();
        if (hour < 5) setGreeting('Still Awake?');
        else if (hour < 12) setGreeting('Good Morning');
        else if (hour < 18) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');

        const docRef = doc(db, "users", currentUser.uid);
        const unsubDoc = onSnapshot(docRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            // Auto Unban check logic
            if (data.isBanned && data.banExpires) {
              const expireDate = data.banExpires.toDate ? data.banExpires.toDate() : new Date(data.banExpires);
              if (new Date() > expireDate) {
                updateDoc(docRef, { isBanned: false, banExpires: null });
              }
            }
            setProfile(data as any);
          } else {
            const defaultData = { name: currentUser.displayName || 'Willian', age: '18', personality: 'Sweet', hobby: '', mood: 'Sweet', loveLevel: 80, isBanned: false };
            setDoc(docRef, defaultData);
            setProfile(defaultData);
          }
          setLoading(false);
        });
        return () => unsubDoc();
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [router, mouseX, mouseY]);

  const submitAppeal = async () => {
    if (!appealMessage.trim() || !user) return;
    try {
      await addDoc(collection(db, "appeals"), {
        uid: user.uid,
        name: profile.name || "Unknown User",
        message: appealMessage,
        timestamp: serverTimestamp()
      });
      setAppealSent(true);
      setAppealMessage('');
    } catch (e) { console.error("Appeal Error:", e); }
  };

  if (loading) return (
    <div className="h-screen bg-[#0d0216] flex items-center justify-center">
      <div className="text-rose-500 font-black animate-pulse tracking-[10px] uppercase text-xl">Maya Protocol v2.0</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0d0216] text-white p-6 md:p-12 relative overflow-x-hidden font-sans italic-none">
      
      <motion.div style={{ x: springX, y: springY }} className="fixed w-[300px] h-[300px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <AnimatePresence>
        {profile.isBanned && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#0d0216]/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 text-center overflow-y-auto"
          >
            <div className="w-20 h-20 border-2 border-rose-600 rounded-full flex items-center justify-center animate-pulse mb-8">
              <span className="text-rose-600 text-4xl font-black italic">!</span>
            </div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-rose-600 mb-2">Neural Link Severed</h2>
            <p className="text-[9px] font-black text-white/40 uppercase tracking-[6px] mb-10 text-center">Access Denied by Maya Core</p>
            
            <div className="bg-white/5 border border-white/10 p-8 rounded-[40px] max-w-md w-full relative shadow-2xl">
                <div className="relative z-10 text-left">
                  <p className="text-[10px] font-black text-rose-500 uppercase tracking-[4px] mb-4 italic">Appeal for Restoration:</p>
                  
                  {appealSent ? (
                    <div className="py-10 text-center space-y-4">
                        <p className="text-xl font-bold text-green-400 animate-bounce">Signal Sent! 🚀</p>
                        <p className="text-[10px] text-white/40 uppercase font-black">Admin will review your request soon.</p>
                    </div>
                  ) : (
                    <>
                      <textarea 
                        value={appealMessage} 
                        onChange={(e) => setAppealMessage(e.target.value)}
                        placeholder="Lekho keno unban kora dorkar..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-5 text-sm text-white/90 outline-none focus:border-rose-500 transition-all h-32 mb-4 resize-none"
                      />
                      <button 
                        onClick={submitAppeal}
                        className="w-full py-4 bg-rose-600 text-white font-black text-[10px] rounded-2xl uppercase tracking-[2px] hover:bg-rose-500 transition-all shadow-[0_0_20px_#f43f5e33]"
                      >
                        🚀 Send to Admin Panel
                      </button>
                    </>
                  )}

                  <div className="pt-6 mt-6 border-t border-white/5 text-center">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-[2px] mb-1">Estimated Restoration</p>
                    <p className="text-[11px] font-mono text-rose-400">
                      {profile.banExpires ? (profile.banExpires.toDate ? profile.banExpires.toDate().toLocaleString() : new Date(profile.banExpires).toLocaleString()) : 'Processing...'}
                    </p>
                  </div>
                </div>
            </div>
            <button onClick={() => signOut(auth)} className="mt-10 px-8 py-3 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-[4px] hover:bg-white hover:text-black transition-all">Logoff Terminal</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex justify-between items-center mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-[10px] font-black tracking-[8px] text-rose-500 uppercase mb-1">Neural Link: {profile.personality}</p>
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">MAYA.AI</h1>
          </motion.div>
          <div className="flex items-center gap-5">
            <Link href="/settings" className="w-12 h-12 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center hover:bg-rose-500 transition-all text-xl">⚙️</Link>
            <button onClick={() => signOut(auth)} className="bg-white/5 border border-white/10 px-8 py-3 rounded-2xl text-[10px] font-black tracking-[4px] hover:bg-rose-600 transition-all uppercase">Logoff</button>
          </div>
        </header>

        <div className="mb-20 select-none">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-rose-400 font-bold tracking-[2px] uppercase mb-4 text-sm">
            {greeting}, My Love 🫦
          </motion.p>
          <motion.h2 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
            Everything is <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-500 to-rose-600 italic">
              {profile.name || 'Set for you'}
            </span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <Link href="/chat" className="md:col-span-8 group">
            <motion.div whileHover={{ y: -12, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="h-full min-h-[420px] bg-gradient-to-br from-rose-600 via-rose-700 to-pink-900 p-12 rounded-[60px] relative overflow-hidden shadow-2xl border border-white/10">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-3xl rounded-[30px] flex items-center justify-center text-5xl shadow-xl border border-white/30 animate-pulse">🫦</div>
                <div>
                  <h3 className="text-5xl font-black uppercase leading-none tracking-tighter mb-4">Enter My <br /> Private Heart</h3>
                  <div className="flex items-center gap-3 bg-black/20 w-fit px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping" />
                    <p className="text-[10px] font-bold tracking-[2px] uppercase text-white/80">Link Encrypted</p>
                  </div>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 text-[350px] opacity-10 group-hover:rotate-12 transition-all duration-700">❤️</div>
            </motion.div>
          </Link>

          <div className="md:col-span-4 flex flex-col gap-6">
            <motion.div whileHover={{ x: 10 }} className={`${currentStyle.bg} ${currentStyle.border} border-2 p-8 rounded-[40px] backdrop-blur-3xl flex flex-col justify-between h-[200px] relative overflow-hidden transition-all duration-500`}>
              <div className="relative z-10">
                <p className={`text-[10px] font-bold ${currentStyle.text} uppercase tracking-widest mb-2`}>{currentStyle.label}</p>
                <h4 className="text-3xl font-black italic uppercase">{profile.personality}</h4>
              </div>
              <div className="flex justify-between items-end relative z-10">
                <span className="text-5xl">{currentStyle.icon}</span>
                <span className="text-[9px] font-bold text-white/20 uppercase tracking-widest italic">Maya Active</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-[#1a0b2e] to-[#0d0216] border border-white/10 p-8 rounded-[40px] h-[200px] relative overflow-hidden shadow-xl">
               <p className="text-[9px] font-black text-white/30 uppercase tracking-[2px] mb-4">Maya's Mood & Love</p>
               <div className="space-y-1">
                 <h4 className={`text-2xl font-black italic uppercase ${currentMood.text}`}>{currentMood.label}</h4>
                 <p className="text-[24px] font-black text-white">{profile.loveLevel || 0}%</p>
               </div>
               <div className="mt-4 w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${profile.loveLevel}%` }} transition={{ duration: 1.5 }} className={`h-full ${currentMood.accent} shadow-[0_0_15px_rgba(244,63,94,0.4)]`} />
               </div>
               <div className="absolute right-6 bottom-6 opacity-10 text-5xl rotate-12">{currentMood.icon}</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}