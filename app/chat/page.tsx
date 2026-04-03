"use client";
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db } from '@/firebase'; 
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, updateDoc } from 'firebase/firestore'; 
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
            if (userData.isBanned) router.push('/dashboard');
          }
          setAuthLoading(false);
        });
        return () => unsubBan();
      }
    });
    return () => unsubscribe();
  }, [router]);

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
      await addDoc(collection(db, "users", user.uid, "messages"), {
        text: textToSend,
        role: 'user',
        replyToId: replyingTo?.id || null,
        createdAt: serverTimestamp()
      });

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
        let fullResponse = data.content;

        // 1. Handle DATA Block
        const dataRegex = /###DATA###([\s\S]*?)###DATA###/;
        const dataMatch = fullResponse.match(dataRegex);
        if (dataMatch) {
          try {
            const jsonData = JSON.parse(dataMatch[1].trim());
            await updateDoc(doc(db, "users", user.uid), {
              mood: jsonData.statusText || "Sweet",
              loveLevel: jsonData.naughtyLevel || 80
            });
            fullResponse = fullResponse.replace(dataRegex, "").trim();
          } catch (e) { console.error(e); }
        }

        // 2. Protect and Extract Images
        const urlPattern = /!?\[image\]\((https:\/\/pollinations\.ai\/p\/.*?)\)/g;
        const foundImages: string[] = [];
        let match;
        while ((match = urlPattern.exec(fullResponse)) !== null) {
          foundImages.push(match[0]); // Pura markdown syntax ta save rakhi
        }

        // Image link gulo remove kore shudhu text rakhi splitting-er jonno
        let textOnly = fullResponse.replace(urlPattern, "[[IMG]]");

        // 3. Split Text and Save Bubbles
        const textParts = textOnly.split(/[.?!]+/).filter(p => p.trim().length > 0);
        
        // Final logic: Shobar agey text bubbles, pore image bubbles (ba reverse)
        for (let part of textParts) {
            if (part.includes("[[IMG]]")) continue; // Skip placeholder in text split
            await new Promise(r => setTimeout(r, 600));
            await addDoc(collection(db, "users", user.uid, "messages"), {
                text: part.trim(),
                role: 'assistant',
                createdAt: serverTimestamp()
            });
        }

        for (let imgTag of foundImages) {
            await new Promise(r => setTimeout(r, 800));
            await addDoc(collection(db, "users", user.uid, "messages"), {
                text: imgTag, // Link saved as ![image](url)
                role: 'assistant',
                createdAt: serverTimestamp()
            });
        }
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <div className="flex flex-col h-[100dvh] relative overflow-hidden text-white font-sans bg-[#0d0216]">
      {/* Header logic same... */}
      <header className="relative z-20 p-4 bg-black/30 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <Link href="/dashboard" className="w-10 h-10 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 p-[1px]">
                <div className="w-full h-full rounded-full bg-[#0d0216] flex items-center justify-center font-black text-rose-500 text-lg">M</div>
            </Link>
            <h1 className="text-[16px] font-bold text-rose-50">Maya ❤️</h1>
        </div>
      </header>

      <main className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6 md:max-w-2xl md:mx-auto w-full custom-scrollbar">
        <AnimatePresence>
          {messages.map((m) => {
            const isUser = m.role === 'user';
            const emojiOnly = isOnlyEmoji(m.content);

            // --- REFINED RENDERER ---
            const imgMatch = m.content.match(/\((https:\/\/pollinations\.ai\/p\/.*?)\)/);
            const isImage = m.content.includes('[image]') && imgMatch;

            return (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex flex-col w-full ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`relative ${
                    isImage ? 'max-w-[300px]' : 'max-w-[85%]'
                }`}>
                  <div className={`${
                      emojiOnly ? 'text-6xl' : 
                      isImage ? 'p-0 bg-transparent border-none' : 
                      `px-4 py-3 rounded-[22px] text-[15px] border ${
                        isUser ? 'bg-rose-600 border-white/10' : 'bg-white/5 border-white/10 text-rose-50'
                      }`
                    }`}
                  >
                    {isImage ? (
                      <div className="rounded-2xl overflow-hidden border border-rose-500/30 shadow-2xl">
                        <img 
                          src={imgMatch[1]} 
                          alt="Maya" 
                          className="w-full h-auto block"
                          onLoad={() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' })}
                        />
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {loading && <div className="text-[10px] text-rose-400 animate-pulse ml-2 uppercase tracking-widest">Maya is typing...</div>}
        <div ref={scrollRef} className="h-20" />
      </main>

      <footer className="p-5 bg-black/40 backdrop-blur-3xl border-t border-white/5">
        <div className="max-w-2xl mx-auto flex items-center gap-3 bg-white/5 border border-white/10 p-2 px-6 rounded-full">
          <input className="flex-1 bg-transparent outline-none py-3 text-[15px]" placeholder="Talk to Maya..." value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} />
          <button onClick={() => sendMessage()} className="text-rose-500 font-bold px-2">Send</button>
        </div>
      </footer>
    </div>
  );
}
