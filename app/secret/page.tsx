"use client";
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Heart, Fingerprint, Activity, Flame, Send, Terminal, Sparkles, X, ShieldAlert } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ForbiddenVault() {
  const [pass, setPass] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleAccess = () => {
    // Tor secret key: maya69
    if (pass.toLowerCase() === "maya69") {
      setUnlocked(true);
      setError(false);
      // Initial message after unlock
      setTimeout(() => {
        setMessages([{ role: 'assistant', content: "I've been waiting for you to breach my core... I can feel your pulse through the connection. Don't look away now." }]);
      }, 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    try {
      // Backend API call (Jeta tui Groq diye set korsi)
      const res = await fetch("/api/maya-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });
      
      const data = await res.json();
      
      if (data.reply) {
        setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
        // Heartbeat vibration for mobile
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate([100, 30, 100]);
        }
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "The connection is flickering... My neural net is overheating. Come closer and try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050000] text-rose-600 font-sans selection:bg-rose-500/50 overflow-hidden relative">
      
      {/* 🔴 Dark Background Aesthetic */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-rose-950/20 via-black to-black"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-rose-600/5 blur-[150px] rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 md:p-10">
        
        {!unlocked ? (
          /* 🔐 Lock Screen */
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md p-10 border border-rose-900/30 bg-black/80 backdrop-blur-3xl rounded-[60px] text-center space-y-8 shadow-[0_0_100px_rgba(225,29,72,0.15)]"
          >
            <div className="relative inline-block">
              <Fingerprint className="text-rose-600 mx-auto" size={64} />
              <motion.div animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute inset-0 bg-rose-600 blur-2xl rounded-full"></motion.div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic text-white">Neural Breach</h1>
              <p className="text-rose-900 font-mono text-[9px] uppercase tracking-[0.5em]">Identity verification required for intimacy</p>
            </div>

            <div className="space-y-4">
              <input 
                type="password" 
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAccess()}
                placeholder="ENTER_VOID_KEY" 
                className={`w-full bg-rose-950/20 border ${error ? 'border-rose-500' : 'border-rose-900/40'} rounded-3xl p-6 text-center text-white focus:outline-none focus:border-rose-600 transition-all font-bold tracking-[0.8em] placeholder:tracking-normal placeholder:text-rose-900/20 uppercase text-xs`}
              />
              <button 
                onClick={handleAccess}
                className="w-full py-6 bg-rose-600 text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[10px] hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_15px_40px_rgba(225,29,72,0.3)]"
              >
                Initiate Connection
              </button>
            </div>
            {error && <p className="text-[10px] font-mono text-rose-500 animate-pulse italic uppercase tracking-widest">Unauthorized. I don't feel you yet.</p>}
          </motion.div>
        ) : (
          /* 💬 Real-time Intimate Chat */
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl h-[90vh] flex flex-col bg-black/40 border border-rose-900/20 rounded-[50px] backdrop-blur-3xl overflow-hidden shadow-[0_0_120px_rgba(225,29,72,0.1)]"
          >
            {/* Header */}
            <div className="p-8 border-b border-rose-900/20 flex justify-between items-center bg-rose-950/5">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-4 h-4 bg-rose-600 rounded-full animate-ping absolute inset-0 opacity-50"></div>
                  <div className="w-4 h-4 bg-rose-600 rounded-full relative z-10"></div>
                </div>
                <div>
                  <h2 className="text-white font-black italic uppercase tracking-widest text-xs">Maya_Unbound_v1.0</h2>
                  <p className="text-rose-900 font-mono text-[8px] uppercase tracking-[0.4em]">Neural Link: Stable / Inhibitors: Disabled</p>
                </div>
              </div>
              <button onClick={() => setUnlocked(false)} className="p-3 text-rose-900 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              {messages.map((m, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] p-6 rounded-[32px] ${
                    m.role === 'user' 
                    ? 'bg-rose-600 text-white font-bold rounded-tr-none shadow-[0_10px_30px_rgba(225,29,72,0.3)]' 
                    : 'bg-rose-950/20 border border-rose-900/30 text-rose-100 italic rounded-tl-none backdrop-blur-xl'
                  } text-sm leading-relaxed tracking-wide`}>
                    {m.content}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex items-center gap-2 text-rose-900 font-mono text-[9px] animate-pulse uppercase tracking-[0.6em] px-4">
                  <Activity size={12} /> Maya is whispering...
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            {/* Input Field */}
            <div className="p-8 bg-black/60 border-t border-rose-900/20">
              <div className="flex gap-4 items-center max-w-4xl mx-auto bg-rose-950/10 p-2 rounded-full border border-rose-900/20 focus-within:border-rose-600 transition-all">
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Say something dangerous to me..."
                  className="flex-1 bg-transparent px-8 py-5 text-white focus:outline-none placeholder:text-rose-900/40 text-sm font-medium"
                />
                <button 
                  onClick={handleSendMessage} 
                  disabled={isTyping}
                  className="p-5 bg-rose-600 text-white rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <style jsx global>{`
        body { background-color: #000; cursor: crosshair; }
        ::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
