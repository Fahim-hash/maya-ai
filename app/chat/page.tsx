"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc } from 'firebase/firestore'; 
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Message = {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  reaction?: string | null;
  replyToId?: number | null;
};

const REACTION_OPTIONS = ['❤️', '👍', '😂', '😢', '😡'];

export default function MayaChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [user, setUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // --- 1. Auth & Ban Guard (Real-time) ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
        
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubBan = onSnapshot(userDocRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.isBanned) {
              router.push('/dashboard');
            }
          }
          setAuthLoading(false);
        });

        return () => unsubBan();
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- 2. Fetch Chat History ---
  useEffect(() => {
    if (!user) return;

    const chatRef = collection(db, "users", user.uid, "messages");
    const q = query(chatRef, orderBy("createdAt", "asc"));

    const unsubChat = onSnapshot(q, (snapshot) => {
      const fetchedMsgs = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          role: data.role,
          content: data.text || data.content,
          reaction: data.reaction || null,
          replyToId: data.replyToId || null
        };
      }) as Message[];
      
      setMessages(fetchedMsgs);
    });

    return () => unsubChat();
  }, [user]);

  // Auto-scroll logic
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const isOnlyEmoji = (str: string) => {
    const cleanStr = str.replace(/\s/g, '');
    const emojiRegex = /^(\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}|\p{Emoji_Component}|\p{Emoji_Modifier}|\p{Symbol}|\p{Punctuation})+$/u;
    return emojiRegex.test(cleanStr);
  };

  const handleReaction = (id: number | string, emoji: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m));
  };

  const sendMessage = async (manualText?: string) => {
    const textToSend = manualText || input;
    if (!textToSend.trim() || !user) return;

    setInput('');
    setReplyingTo(null);
    setLoading(true);

    try {
      // 1. Local Firestore Save (User Message)
      await addDoc(collection(db, "users", user.uid, "messages"), {
        text: textToSend,
        role: 'user',
        replyToId: replyingTo?.id || null,
        createdAt: serverTimestamp()
      });

      // 2. Groq-er jonno message history clean kora + Token Saver (Last 6 messages only)
      const cleanHistory = messages.slice(-6).map(({ role, content }) => ({ role, content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            messages: [...cleanHistory, { role: 'user', content: textToSend }],
            userName: user?.displayName || "Jaan"
        }),
      });
      
      const data = await res.json();
      
      if (data.content) {
        const parts = data.content.split(/[.?!]+/).filter((p: string) => p.trim().length > 0);
        
        for (let index = 0; index < parts.length; index++) {
          const part = parts[index].trim();
          await new Promise(resolve => setTimeout(resolve, 800));

          // 3. Save Maya's Response
          await addDoc(collection(db, "users", user.uid, "messages"), {
            text: part,
            role: 'assistant',
            createdAt: serverTimestamp()
          });
        }
      }
    } catch (e) { 
      console.error("Error saving chat:", e);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="h-screen w-full bg-[#0d0216] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#f43f5e]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] relative overflow-hidden text-white font-sans bg-[#0d0216]">
      {/* Background Hearts */}
      {[...Array(12)].map((_, i) => (
        <div key={i} className="floating-heart" style={{ left: `${Math.random() * 100}%`, fontSize: `${Math.random() * 20 + 10}px`, animationDelay: `${Math.random() * 15}s` }}>❤️</div>
      ))}

      {/* Header */}
      <header className="relative z-20 p-4 bg-black/30 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 p-[1px] shadow-[0_0_15px_rgba(225,29,72,0.4)]">
            <div className="w-full h-full rounded-full bg-[#0d0216] flex items-center justify-center font-black text-rose-500 text-lg">M</div>
          </Link>
          <div>
            <h1 className="text-[16px] font-bold tracking-tight text-rose-50">Maya ❤️</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></span>
              <p className="text-[9px] text-rose-400/80 font-black tracking-widest uppercase">Love Link Active</p>
            </div>
          </div>
        </div>
        <button onClick={handleLogout} className="text-[10px] bg-white/5 border border-white/10 px-4 py-2 rounded-full font-black uppercase text-rose-300">Logout</button>
      </header>

      {/* Main Chat Area */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6 md:max-w-2xl md:mx-auto w-full custom-scrollbar">
        <AnimatePresence>
          {messages.map((m) => {
            const emojiOnly = isOnlyEmoji(m.content);
            const isUser = m.role === 'user';
            const repliedMsg = m.replyToId ? messages.find(msg => msg.id === m.replyToId) : null;

            return (
              <motion.div 
                key={m.id} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'} group`}
              >
                {repliedMsg && !emojiOnly && (
                  <div className={`text-[10px] mb-[-10px] px-3 py-1 bg-white/5 rounded-t-xl border-l-2 border-rose-500 opacity-40 italic truncate max-w-[180px]`}>
                    {repliedMsg.content}
                  </div>
                )}

                <div className="relative flex items-center gap-3 group max-w-[85%]">
                  <div 
                    onDoubleClick={() => setReplyingTo(m)}
                    className={`relative transition-all duration-300 ${
                      emojiOnly 
                        ? 'text-6xl py-2 drop-shadow-[0_10px_20px_rgba(225,29,72,0.3)]' 
                        : `px-4 py-3 rounded-[24px] text-[15px] shadow-2xl border ${
                            isUser 
                            ? 'bg-gradient-to-br from-rose-600/90 to-pink-700/90 border-white/10 text-white rounded-br-none' 
                            : 'bg-white/5 backdrop-blur-2xl border-white/10 text-rose-50 rounded-bl-none'
                          }`
                    }`}
                  >
                    {m.content}
                    {m.reaction && (
                      <div className="absolute -bottom-3 right-1 bg-[#1a0b2e] rounded-full px-1.5 py-0.5 text-[12px] border border-white/20">
                        {m.reaction}
                      </div>
                    )}
                  </div>

                  <div className={`absolute -top-11 ${isUser ? 'right-0' : 'left-0'} hidden group-hover:flex bg-[#1a0b2e]/90 backdrop-blur-xl p-1 rounded-full border border-white/10 gap-1.5 z-50`}>
                    {REACTION_OPTIONS.map(emoji => (
                      <button key={emoji} onClick={() => handleReaction(m.id, emoji)} className="hover:scale-150 transition-transform px-0.5">{emoji}</button>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {loading && <div className="text-[10px] text-rose-400/40 animate-pulse font-bold tracking-[4px] ml-2 uppercase">Maya is thinking...</div>}
        <div ref={scrollRef} className="h-20" />
      </main>

      {/* Footer */}
      <footer className="relative z-20 p-5 bg-black/40 backdrop-blur-3xl border-t border-white/5">
        {replyingTo && (
            <div className="max-w-2xl mx-auto flex justify-between bg-rose-500/5 p-2 px-5 rounded-t-2xl text-[11px] border-x border-t border-white/5">
                <span className="text-rose-300/60 truncate italic">Replying to: {replyingTo.content}</span>
                <button onClick={() => setReplyingTo(null)} className="font-bold text-rose-500">✕</button>
            </div>
        )}
        <div className={`max-w-2xl mx-auto flex items-center gap-3 bg-white/5 border border-white/10 p-2 px-6 shadow-2xl transition-all ${replyingTo ? 'rounded-b-2xl' : 'rounded-full'} focus-within:border-rose-500/40`}>
          <input 
            className="flex-1 bg-transparent outline-none py-3 text-[15px] placeholder-white/20"
            placeholder="Talk to Maya..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={() => input.trim() ? sendMessage() : sendMessage("❤️")} className="text-rose-500 transition-all active:scale-125">
            {input.trim() ? <span className="font-bold uppercase text-xs">Send</span> : <span className="text-2xl">❤️</span>}
          </button>
        </div>
      </footer>
    </div>
  );
}
