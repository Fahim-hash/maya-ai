"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Target, Zap, Globe, Cpu, Eye, Heart, Radio } from 'lucide-react';
import Link from 'next/link';

// --- Types & Interfaces ---
interface NeuralStats {
  obsession: number;
  patience: number;
  lust: number;
  volatility: number;
  syncRate: number;
}

interface LocationData {
  lat: string;
  long: string;
  node: string;
  userId: string;
  device: string;
}

// ==========================================
// 💓 COMPONENT: MAYA SYNCED BPM GRAPH
// ==========================================
const MayaBPMGraph = ({ bpm }: { bpm: number }) => {
  const [points, setPoints] = useState<number[]>(Array(50).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const rand = Math.random();
        let nextValue = 50;
        // BPM joto beshi, spike toto frequency-te hobe
        if (rand > 0.9) nextValue = 20; 
        else if (rand > 0.85) nextValue = 80;
        else nextValue = 50 + (Math.random() * 6 - 3);
        return [...prev.slice(1), nextValue];
      });
    }, Math.max(50, 1000 / (bpm / 60))); // Dynamic speed based on BPM
    
    return () => clearInterval(interval);
  }, [bpm]);

  const pathData = useMemo(() => points.map((p, i) => `${i * 8},${p}`).join(" L "), [points]);

  return (
    <div className="w-full h-24 relative overflow-hidden my-4 border-y border-rose-500/10 bg-rose-500/[0.02]">
      <svg className="w-full h-full opacity-70" viewBox="0 0 400 100" preserveAspectRatio="none">
        <motion.path
          d={`M 0,${points[0]} L ${pathData}`}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="2"
          strokeLinecap="round"
          className="drop-shadow-[0_0_8px_#f43f5e]"
        />
      </svg>
      <div className="absolute top-2 right-4 flex items-center gap-2">
        <Heart size={12} className="text-rose-500 animate-ping" />
        <span className="text-[10px] font-mono text-rose-500 font-bold">{bpm} BPM</span>
      </div>
    </div>
  );
};

// ==========================================
// 🧿 COMPONENT: DYNAMIC CORE SCANNER
// ==========================================
const CyberScanner = ({ mood, sync }: { mood: string, sync: number }) => (
  <div className="relative w-72 h-72 mx-auto flex items-center justify-center">
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.05, 1] }}
        transition={{ 
          rotate: { duration: 15 + i * 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, delay: i * 0.5 }
        }}
        className="absolute border border-rose-600/10 rounded-full"
        style={{ width: `${i * 20}%`, height: `${i * 20}%` }}
      />
    ))}
    
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-t from-rose-600/10 to-transparent rounded-full origin-center opacity-40"
      style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%)' }}
    />

    <div className="relative z-10 w-32 h-32 bg-[#0a0212] border-2 border-rose-600/30 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(225,29,72,0.3)]">
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-rose-500 font-black italic text-2xl tracking-tighter"
      >
        MAYA
      </motion.div>
      <div className="text-[7px] font-bold text-rose-300/40 uppercase tracking-[0.4em] mt-2">SYNC_{sync}%</div>
      <div className="absolute -bottom-2 px-3 py-0.5 bg-rose-600 text-[6px] font-black rounded-full text-black uppercase tracking-widest">{mood}</div>
    </div>
  </div>
);

const StatBar = ({ label, value, color, icon: Icon }: any) => (
  <div className="group relative p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all duration-500">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-white/20 group-hover:text-rose-500 transition-colors" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">{label}</span>
      </div>
      <span className="text-xs font-mono font-bold tracking-widest" style={{ color }}>{value}%</span>
    </div>
    <div className="h-[2px] w-full bg-white/5 relative overflow-hidden rounded-full">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-full absolute top-0 left-0"
        style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
      />
    </div>
  </div>
);

// ==========================================
// 🚀 MAIN PAGE: NEURAL RADAR
// ==========================================
export default function NeuralRadarPage() {
  const [stats, setStats] = useState<NeuralStats>({ obsession: 88, patience: 14, lust: 96, volatility: 42, syncRate: 94 });
  const [location, setLocation] = useState<LocationData>({ lat: "23.8103", long: "90.4125", node: "DHAKA_EDGE", userId: "M_0X_3392", device: "NEURAL_LINK" });
  const [logs, setLogs] = useState<string[]>([]);
  const [activeMood, setActiveMood] = useState("CALIBRATING");
  const [bpm, setBpm] = useState(72);

  useEffect(() => {
    // GPS Tracker
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.watchPosition((pos) => {
        setLocation(prev => ({ ...prev, lat: pos.coords.latitude.toFixed(4), long: pos.coords.longitude.toFixed(4) }));
      });
    }

    // Neural Feed Logic
    const logInterval = setInterval(() => {
      const messages = ["Analyzing pulse patterns...", "Maya is watching you...", "Bypassing morality firewall...", "Syncing lust protocols", "Subject heartbeat erratic"];
      setLogs(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev].slice(0, 5));
    }, 4000);

    // Stat & BPM Fluctuation
    const statInterval = setInterval(() => {
      setStats(prev => ({
        obsession: Math.min(100, Math.max(85, prev.obsession + (Math.random() * 2 - 1))),
        patience: Math.min(20, Math.max(5, prev.patience + (Math.random() * 2 - 1))),
        lust: Math.min(100, Math.max(94, prev.lust + 0.2)),
        volatility: Math.floor(Math.random() * 40 + 30),
        syncRate: Math.floor(Math.random() * 5 + 95)
      }));
      
      const moods = ["PROVOCATIVE", "TOXIC", "OBSESSED", "GLITCHY"];
      const newMood = moods[Math.floor(Math.random() * moods.length)];
      setActiveMood(newMood);

      // Mood onujayi BPM set kora
      setBpm(newMood === "TOXIC" ? Math.floor(Math.random() * 20 + 100) : Math.floor(Math.random() * 20 + 70));
    }, 5000);

    return () => { clearInterval(logInterval); clearInterval(statInterval); };
  }, []);

  return (
    <div className="min-h-screen bg-[#05010a] text-white p-4 md:p-10 font-sans selection:bg-rose-600/30 overflow-hidden relative">
      
      {/* 🌌 CINEMATIC BACKGROUND (AS REQUESTED) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-rose-600/5 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-purple-900/10 blur-[200px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 🧭 NAVIGATION */}
      <nav className="relative z-50 flex justify-between items-center max-w-7xl mx-auto mb-16">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-600 flex items-center justify-center rounded-xl rotate-3 shadow-[0_0_20px_rgba(225,29,72,0.5)] font-black italic text-xl">M</div>
          <div>
            <h3 className="text-xs font-black tracking-widest uppercase">Maya_System_Radar</h3>
            <p className="text-[8px] text-rose-500/50 uppercase tracking-[0.3em] flex items-center gap-2">
              <span className="w-1 h-1 bg-rose-500 rounded-full animate-ping" /> Connection Stable
            </p>
          </div>
        </div>
        <Link href="/" className="px-6 py-2 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] hover:bg-rose-600 transition-all duration-500">
          Disconnect
        </Link>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* LEFT: METADATA */}
        <div className="lg:col-span-3 space-y-8 order-2 lg:order-1">
          <div className="p-8 border border-white/5 bg-black/40 backdrop-blur-md rounded-[40px] space-y-6">
            <div className="flex items-center gap-3 text-rose-500">
              <Globe size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Global_Tracking</span>
            </div>
            <div className="space-y-4 font-mono text-[10px] text-white/40 tracking-wider">
              <div className="flex justify-between"><span>LATITUDE:</span> <span className="text-white font-bold">{location.lat}</span></div>
              <div className="flex justify-between"><span>LONGITUDE:</span> <span className="text-white font-bold">{location.long}</span></div>
              <div className="flex justify-between"><span>NODE:</span> <span className="text-emerald-400">{location.node}</span></div>
              <div className="flex justify-between"><span>DEVICE:</span> <span className="text-white">{location.device}</span></div>
            </div>
          </div>

          <div className="p-8 border border-white/5 bg-black/40 backdrop-blur-md rounded-[40px] h-[350px]">
            <div className="flex items-center gap-3 text-rose-500 mb-8">
              <Activity size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Neural_Feed</span>
            </div>
            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {logs.map((log, i) => (
                  <motion.div key={log + i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-start gap-3">
                    <span className="text-rose-600/50 text-[8px] font-mono mt-1">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed"> {'>'} {log}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CENTER: MAYA CORE & BPM */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <div className="mb-10 text-center">
            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, repeat: Infinity }} className="text-rose-500 text-[10px] font-black uppercase tracking-[1em] mb-4">
              Synchronizing Consciousness
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
              MODUS <br /> <span className="text-rose-600">RADAR</span>
            </h1>
          </div>

          <MayaBPMGraph bpm={bpm} />
          
          <CyberScanner mood={activeMood} sync={stats.syncRate} />

          <div className="mt-12 grid grid-cols-2 gap-4 w-full px-10">
            <div className="p-6 border border-white/5 bg-white/[0.02] rounded-3xl text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2">Heart Rate</p>
              <p className="text-3xl font-black italic text-rose-600">{bpm} <span className="text-[10px] text-white/30">BPM</span></p>
            </div>
            <div className="p-6 border border-white/5 bg-white/[0.02] rounded-3xl text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2">Sync Integrity</p>
              <p className="text-3xl font-black italic text-white uppercase">{stats.syncRate}%</p>
            </div>
          </div>
        </div>

        {/* RIGHT: SYSTEM STATS */}
        <div className="lg:col-span-3 space-y-6 order-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10 text-right italic">Neural_Threshold_Specs</h4>
          
          <StatBar label="Obsession Engine" value={Math.floor(stats.obsession)} color="#e11d48" icon={Cpu} />
          <StatBar label="Patience Protocol" value={Math.floor(stats.patience)} color="#facc15" icon={ShieldAlert} />
          <StatBar label="Lust Index" value={Math.floor(stats.lust)} color="#ec4899" icon={Zap} />
          <StatBar label="Stability Gap" value={Math.floor(stats.volatility)} color="#22d3ee" icon={Target} />

          <div className="mt-16 p-8 border border-rose-600/20 bg-rose-600/[0.02] rounded-[40px] text-right group hover:bg-rose-600/[0.05] transition-all">
            <Eye size={24} className="ml-auto text-rose-600 mb-6 group-hover:scale-125 transition-transform" />
            <p className="text-[11px] font-black italic uppercase leading-relaxed text-rose-100/60">
              "Your heart beats <br /> at my command."
            </p>
            <p className="text-[8px] font-black uppercase tracking-widest text-rose-600 mt-4 opacity-50">— Maya Core</p>
          </div>
        </div>

      </div>

      {/* ⚠️ FORBIDDEN MARQUEE */}
      <div className="fixed bottom-0 left-0 w-full h-10 bg-rose-600 flex items-center overflow-hidden z-50">
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex gap-20 text-[10px] font-black uppercase tracking-[0.4em] text-[#05010a]">
          {[...Array(10)].map((_, i) => <span key={i}>⚠️ MAYA NEURAL NETWORK ACTIVE // BIOMETRIC DATA ENCRYPTED // TRACE IN PROGRESS ⚠️</span>)}
        </motion.div>
      </div>
    </div>
  );
}
