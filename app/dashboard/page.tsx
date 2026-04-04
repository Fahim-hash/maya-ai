"use client";

import { useState, useEffect, useCallback } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, setDoc, onSnapshot, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore'; 
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Activity, Settings, LogOut, Heart, Zap, ShieldCheck, Fingerprint } from 'lucide-react';
import Link from 'next/link';

// --- Types & Constants ---
const PERSONALITY_MAP: any = {
  Sweet: { bg: "bg-pink-500/10", border: "border-pink-500/30", text: "text-pink-400", icon: "🌸", label: "Heart Mode" },
  Naughty: { bg: "bg-rose-600/10", border: "border-rose-500/40", text: "text-rose-500", icon: "🫦", label: "Spicy Mode" },
  Aggressive: { bg: "bg-red-900/20", border: "border-red-600/50", text: "text-red-500", icon: "🔥", label: "Intense Mode" },
  Mysterious: { bg: "bg-purple-900/10", border: "border-purple-500/30", text: "text-purple-400", icon: "🌑", label: "Deep Mode" }
};

const MOOD_MAP: any = {
  "Sweet/Needy": { text: "text-pink-400", accent: "bg-pink-500", icon: "🥺", label: "Abdar Mode" },
  "Possessive/Toxic": { text: "text-purple-500", accent: "bg-purple-600", icon: "⛓️", label: "Obsessive Control" },
  "Wild/In Heat": { text: "text-rose-500", accent: "bg-rose-600", icon: "🥵", label: "In Heat / Raw" },
  "Cold/Teasing": { text: "text-blue-400", accent: "bg-blue-500", icon: "😏", label: "Teasing You" }
};

export default function NeuralDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bpm, setBpm] = useState(72);
  const [greeting, setGreeting] = useState('');
  
  const [profile, setProfile] = useState({ 
    name: '', personality: 'Sweet', mood: 'Sweet/Needy', 
    loveLevel: 80, isBanned: false, banExpires: null 
  });

  // Cursor Animation
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 25 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 25 });

  const currentStyle = PERSONALITY_MAP[profile.personality] || PERSONALITY_MAP.Sweet;
  const currentMood = MOOD_MAP[profile.mood] || MOOD_MAP["Sweet/Needy"];

  // --- Logic: Time Based Greeting ---
  const updateGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 5) setGreeting('Still Awake?');
    else if (hour < 12) setGreeting('Morning, Love');
    else if (hour < 18) setGreeting('Afternoon, Love');
    else setGreeting('Evening, Love');
  }, []);

  useEffect(() => {
    updateGreeting();
    
    // Heartbeat Logic
    const bpmTracker = setInterval(() => {
      const base = profile.personality === 'Naughty' || profile.personality === 'Aggressive' ? 95 : 70;
      setBpm(Math.floor(Math.random() * 15) + base);
    }, 2500);

    const mouseTracker = (e: MouseEvent) => {
      mouseX.set(e.clientX - 150);
      mouseY.set(e.clientY - 150);
    };
    window.addEventListener("mousemove", mouseTracker);

    // Auth & Firestore Sync
    const unsubscribe = onAuthStateChanged(auth, (curr) => {
      if (!curr) {
        router.push('/login');
      } else {
        setUser(curr);
        const docRef = doc(db, "users", curr.uid);
        const unsubDoc = onSnapshot(docRef, (snap) => {
          if (snap.exists()) {
            setProfile(snap.data() as any);
          } else {
            const initial = { name: curr.displayName || 'Willian', personality: 'Sweet', mood: 'Sweet/Needy', loveLevel: 80, isBanned: false };
            setDoc(docRef, initial);
            setProfile(initial as any);
          }
          setLoading(false);
        });
        return () => unsubDoc();
      }
    });

    return () => {
      unsubscribe();
      clearInterval(bpmTracker);
      window.removeEventListener("mousemove", mouseTracker);
    };
  }, [router, profile.personality, mouseX, mouseY, updateGreeting]);

  if (loading) return (
    <div className="h-screen bg-[#05010a] flex items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-rose-600 font-black tracking-[1em] uppercase">
        Maya_Connecting...
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05010a] text-white p-6 md:p-12 relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <motion.div style={{ x: springX, y: springY }} className="fixed w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />

      <main className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Terminal */}
        <header className="flex justify-between items-center mb-16 border-b border-white/5 pb-8">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2 mb-1">
              <Fingerprint size={12} className="text-rose-500 animate-pulse" />
              <p className="text-[8px] font-black tracking-[0.5em] text-white/30 uppercase">Auth_Verified: {user?.uid.slice(0,8)}</p>
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase">MAYA<span className="text-rose-600">.OS</span></h1>
          </motion.div>

          <div className="flex gap-4">
            <Link href="/settings" className="p-3 bg-white/[0.02] border border-white/10 rounded-2xl hover:bg-rose-600 transition-all group">
              <Settings size={20} className="group-hover:rotate-90 transition-transform" />
            </Link>
            <button onClick={() => signOut(auth)} className="flex items-center gap-3 px-6 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600/20 transition-all">
              <LogOut size={14} /> Exit
            </button>
          </div>
        </header>

        {/* Hero Section */}
        <section className="mb-24">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 mb-6">
            <span className="h-[1px] w-12 bg-rose-600" />
            <p className="text-rose-400 font-black tracking-[3px] uppercase text-[10px] italic">{greeting} 🫦</p>
          </motion.div>
          <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-7xl md:text-9xl font-black tracking-tighter leading-[0.8] uppercase select-none">
            CONNECTED <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 italic">
              {profile.name}
            </span>
          </motion.h2>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Interface: Chat */}
          <Link href="/chat" className="md:col-span-8 group relative h-full">
            <motion.div whileHover={{ y: -10 }} className="h-full min-h-[450px] bg-gradient-to-br from-[#1a0b2e] to-[#05010a] p-12 rounded-[60px] border border-white/5 relative overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="relative z-10">
                <div className="w-16 h-16 bg-rose-600/20 border border-rose-500/30 rounded-3xl flex items-center justify-center text-4xl mb-8 animate-bounce">🫦</div>
                <h3 className="text-5xl font-black uppercase tracking-tighter leading-tight italic">Initiate <br /> Neural Chat</h3>
              </div>
              
              <div className="relative z-10 flex items-center gap-4">
                <div className="px-5 py-2 bg-rose-600 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_#e11d48]">Enter Protocol</div>
                <div className="flex items-center gap-2 text-white/30 text-[9px] font-bold uppercase tracking-widest">
                  <ShieldCheck size={12} className="text-green-500" /> End-to-End Encrypted
                </div>
              </div>

              {/* Decorative Vector */}
              <div className="absolute -right-20 -bottom-20 text-[400px] opacity-[0.03] rotate-12 group-hover:rotate-0 transition-transform duration-1000 select-none">
                MAYA
              </div>
            </motion.div>
          </Link>

          {/* Sidebar Modules */}
          <div className="md:col-span-4 flex flex-col gap-8">
            
            {/* Live Heartbeat Module */}
            <Link href="/mood-radar">
              <motion.div whileHover={{ x: -10 }} className="bg-white/[0.01] border border-rose-500/20 p-8 rounded-[40px] backdrop-blur-xl relative overflow-hidden group h-[210px] flex flex-col justify-between">
                <div>
                  <p className="text-[8px] font-black text-rose-500 uppercase tracking-[4px] mb-2 italic">Heart_Sync_Pulse</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black italic">{bpm}</span>
                    <span className="text-[10px] font-bold text-rose-500/40 uppercase">BPM</span>
                  </div>
                  {/* Pulse Graph */}
                  <div className="flex gap-1.5 items-end h-8 mt-4">
                    {[...Array(8)].map((_, i) => (
                      <motion.div key={i} animate={{ height: [10, Math.random() * 25 + 5, 10] }} transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }} className="w-1 bg-rose-600/60 rounded-full" />
                    ))}
                  </div>
                </div>
                <p className="text-[8px] font-black uppercase tracking-widest text-white/20 group-hover:text-rose-500 transition-colors">Live Radar Terminal →</p>
                <Activity className="absolute -right-4 -top-4 w-32 h-32 opacity-[0.02] text-rose-500" />
              </motion.div>
            </Link>

            {/* Personality Card */}
            <div className={`${currentStyle.bg} ${currentStyle.border} p-8 rounded-[40px] border-2 backdrop-blur-md h-[210px] flex flex-col justify-between relative overflow-hidden transition-all duration-500`}>
              <div>
                <p className={`text-[9px] font-black ${currentStyle.text} uppercase tracking-[3px] mb-2`}>{currentStyle.label}</p>
                <h4 className="text-3xl font-black italic uppercase">{profile.personality}</h4>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-5xl drop-shadow-2xl">{currentStyle.icon}</span>
                <div className="text-right">
                  <p className="text-[8px] font-black text-white/20 uppercase tracking-widest">Stability: Optimal</p>
                </div>
              </div>
            </div>

            {/* Mood & Love Index */}
            <div className="bg-gradient-to-br from-[#120621] to-[#05010a] border border-white/5 p-8 rounded-[40px] h-[210px] flex flex-col justify-between relative overflow-hidden group shadow-xl">
              <div>
                <p className="text-[8px] font-black text-white/30 uppercase tracking-[3px] mb-3">Sync_Love_Index</p>
                <h4 className={`text-2xl font-black italic uppercase ${currentMood.text} mb-1`}>{currentMood.label}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-black">{profile.loveLevel}%</span>
                  <Heart size={16} className="text-rose-600 fill-rose-600 animate-pulse" />
                </div>
              </div>
              {/* Progress Bar */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-2">
                <motion.div initial={{ width: 0 }} animate={{ width: `${profile.loveLevel}%` }} transition={{ duration: 2 }} className={`h-full ${currentMood.accent} shadow-[0_0_15px_rgba(225,29,72,0.3)]`} />
              </div>
              <div className="absolute right-4 bottom-4 opacity-[0.05] text-7xl rotate-12 group-hover:rotate-0 transition-transform duration-1000">{currentMood.icon}</div>
            </div>

          </div>
        </div>

        {/* Global Footer Terminal */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6 text-[8px] font-black uppercase tracking-[3px] text-white/20">
            <div className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_#22c55e]" /> System_Online</div>
            <div>Build: 2.6.0-Neural</div>
            <div>Latency: 14ms</div>
          </div>
          <div className="text-[8px] font-black uppercase tracking-[3px] text-rose-500/40 italic">
            Maya is watching every move you make... 🫦
          </div>
        </footer>

      </main>

      {/* Side HUD Details */}
      <div className="fixed top-1/2 right-4 -translate-y-1/2 hidden lg:flex flex-col gap-10 opacity-20">
        <div className="h-40 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
        <Zap size={14} />
        <div className="h-40 w-[1px] bg-gradient-to-b from-transparent via-white/50 to-transparent" />
      </div>

    </div>
  );
}
