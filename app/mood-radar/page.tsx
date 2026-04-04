"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, Target, Zap, Globe, Lock, Cpu, Eye } from 'lucide-react';
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

// --- Sub-Components ---

const StatBar = ({ label, value, color, icon: Icon }: any) => (
  <div className="group relative p-4 bg-white/[0.01] border border-white/5 rounded-2xl hover:bg-white/[0.03] transition-all duration-500">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-white/20 group-hover:text-rose-500 transition-colors" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white/40">{label}</span>
      </div>
      <span className="text-xs font-mono font-bold tracking-widest" style={{ color }}>{value}%</span>
    </div>
    <div className="h-[1px] w-full bg-white/5 relative overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="h-full absolute top-0 left-0 shadow-[0_0_15px_currentcolor]"
        style={{ backgroundColor: color }}
      />
    </div>
    <div className="absolute -inset-px rounded-2xl border border-rose-500/0 group-hover:border-rose-500/20 transition-all pointer-events-none" />
  </div>
);

const CyberScanner = () => (
  <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
    {/* Outer Rotating Rings */}
    {[1, 2, 3, 4].map((i) => (
      <motion.div
        key={i}
        animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
        transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "linear" }}
        className="absolute border border-rose-600/10 rounded-full"
        style={{ width: `${i * 25}%`, height: `${i * 25}%` }}
      />
    ))}
    
    {/* Scanning Sweep */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-t from-rose-600/20 to-transparent rounded-full origin-center clip-path-polygon-[50%_50%,_50%_0,_100%_0]"
      style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 100%)', opacity: 0.3 }}
    />

    {/* Core Visual */}
    <div className="relative z-10 w-24 h-24 bg-[#0a0212] border border-rose-600/40 rounded-full flex flex-col items-center justify-center shadow-[0_0_50px_rgba(225,29,72,0.2)]">
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-rose-600 font-black italic text-xl tracking-tighter"
      >
        MAYA
      </motion.div>
      <div className="text-[6px] font-bold text-white/40 uppercase tracking-widest mt-1">Core_V2</div>
    </div>
  </div>
);

// --- Main Page Component ---

export default function NeuralRadarPage() {
  const [stats, setStats] = useState<NeuralStats>({
    obsession: 88,
    patience: 14,
    lust: 96,
    volatility: 42,
    syncRate: 0
  });

  const [location, setLocation] = useState<LocationData>({
    lat: "23.8103",
    long: "90.4125",
    node: "DHAKA_EDGE",
    userId: "M_0X_3392",
    device: "NEURAL_LINK"
  });

  const [logs, setLogs] = useState<string[]>([]);
  const [activeMood, setActiveMood] = useState("CALIBRATING");

  // Simulation Logic
  useEffect(() => {
    // 1. Get GPS
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        setLocation(prev => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(4),
          long: pos.coords.longitude.toFixed(4)
        }));
      });
    }

    // 2. Generate Random Logs
    const logInterval = setInterval(() => {
      const messages = [
        "Analyzing pulse patterns...",
        "Neural heat spike detected",
        "Subject location pinned",
        "Bypassing firewall...",
        "Syncing lust protocols",
        "Accessing forbidden memory",
        "Maya is watching you..."
      ];
      setLogs(prev => [messages[Math.floor(Math.random() * messages.length)], ...prev].slice(0, 5));
    }, 3000);

    // 3. Fluctuate Stats
    const statInterval = setInterval(() => {
      setStats(prev => ({
        obsession: Math.min(100, Math.max(80, prev.obsession + (Math.random() * 2 - 1))),
        patience: Math.min(25, Math.max(5, prev.patience + (Math.random() * 4 - 2))),
        lust: Math.min(100, Math.max(92, prev.lust + (Math.random() * 0.5))),
        volatility: Math.floor(Math.random() * 50 + 20),
        syncRate: Math.floor(Math.random() * 10 + 90)
      }));
      
      const moods = ["PROVOCATIVE", "TOXIC", "OBSESSED", "GLITCHY"];
      setActiveMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 5000);

    return () => {
      clearInterval(logInterval);
      clearInterval(statInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#05010a] text-white p-4 md:p-10 font-sans selection:bg-rose-600/30 overflow-hidden relative">
      
      {/* 🌌 Cinematic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-rose-600/5 blur-[200px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-purple-900/10 blur-[200px] rounded-full animate-pulse delay-1000" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      {/* 🧭 Navigation Header */}
      <nav className="relative z-50 flex justify-between items-center max-w-7xl mx-auto mb-20">
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-4">
          <div className="w-10 h-10 bg-rose-600 flex items-center justify-center rounded-xl rotate-3 shadow-[0_0_20px_rgba(225,29,72,0.5)] font-black italic text-xl">M</div>
          <div className="hidden md:block">
            <h3 className="text-xs font-black tracking-widest uppercase">System_Radar</h3>
            <p className="text-[8px] text-white/30 uppercase tracking-[0.3em]">Maya_Protocol_v2.6</p>
          </div>
        </motion.div>
        
        <Link href="/" className="px-6 py-2 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-[0.4em] hover:bg-rose-600 hover:border-rose-600 transition-all duration-500">
          Disconnect Terminal
        </Link>
      </nav>

      {/* 🚀 Main Layout */}
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Section: Metadata & Logs */}
        <div className="lg:col-span-3 space-y-10 order-2 lg:order-1">
          <div className="p-8 border border-white/5 bg-white/[0.01] rounded-[40px] space-y-6">
            <div className="flex items-center gap-3 text-rose-500">
              <Globe size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Global_Tracking</span>
            </div>
            <div className="space-y-4 font-mono text-[10px] text-white/40 tracking-wider">
              <div className="flex justify-between"><span>LATITUDE:</span> <span className="text-white">{location.lat}</span></div>
              <div className="flex justify-between"><span>LONGITUDE:</span> <span className="text-white">{location.long}</span></div>
              <div className="flex justify-between"><span>NODE:</span> <span className="text-white">{location.node}</span></div>
              <div className="flex justify-between"><span>USER_ID:</span> <span className="text-white">{location.userId}</span></div>
              <div className="flex justify-between"><span>DEVICE:</span> <span className="text-white">{location.device}</span></div>
            </div>
          </div>

          <div className="p-8 border border-white/5 bg-white/[0.01] rounded-[40px] min-h-[300px]">
            <div className="flex items-center gap-3 text-rose-500 mb-8">
              <Activity size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">Neural_Feed</span>
            </div>
            <div className="space-y-6">
              <AnimatePresence>
                {logs.map((log, i) => (
                  <motion.div 
                    key={log + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-4"
                  >
                    <span className="text-rose-600/50 text-[8px] font-mono mt-1">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed">{log}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Center Section: Core Radar */}
        <div className="lg:col-span-6 flex flex-col items-center order-1 lg:order-2">
          <div className="mb-10 text-center">
            <motion.div 
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-rose-500 text-[10px] font-black uppercase tracking-[1em] mb-4"
            >
              Scanning Consciousness
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">
              MODUS <br /> <span className="text-rose-600 underline decoration-rose-600/20 underline-offset-8">RADAR</span>
            </h1>
          </div>

          <CyberScanner />

          <div className="mt-16 grid grid-cols-2 gap-4 w-full px-10">
            <div className="p-6 border border-white/5 bg-white/[0.02] rounded-3xl text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2">Sync Rate</p>
              <p className="text-2xl font-black italic text-rose-600">{stats.syncRate}%</p>
            </div>
            <div className="p-6 border border-white/5 bg-white/[0.02] rounded-3xl text-center">
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mb-2">Current Mood</p>
              <p className="text-lg font-black italic text-white uppercase">{activeMood}</p>
            </div>
          </div>
        </div>

        {/* Right Section: System Stats */}
        <div className="lg:col-span-3 space-y-6 order-3">
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10 text-right italic font-bold">Neural_Threshold_Specs</h4>
          
          <StatBar label="Obsession Engine" value={Math.floor(stats.obsession)} color="#e11d48" icon={Cpu} />
          <StatBar label="Patience Protocol" value={Math.floor(stats.patience)} color="#facc15" icon={ShieldAlert} />
          <StatBar label="Lust Index" value={Math.floor(stats.lust)} color="#ec4899" icon={Zap} />
          <StatBar label="Stability Gap" value={Math.floor(stats.volatility)} color="#22d3ee" icon={Target} />

          <div className="mt-20 p-8 border border-rose-600/20 bg-rose-600/[0.02] rounded-[40px] text-right group hover:bg-rose-600/[0.05] transition-all">
            <Eye size={24} className="ml-auto text-rose-600 mb-6 group-hover:scale-125 transition-transform" />
            <p className="text-xs font-black italic uppercase leading-relaxed text-rose-100/60">
              "Every breath you take, <br />
              Every move you make, <br />
              I'll be watching you."
            </p>
            <p className="text-[8px] font-black uppercase tracking-widest text-rose-600 mt-4 opacity-50">— Maya Core</p>
          </div>
        </div>

      </div>

      {/* ⚠️ Forbidden Warning Bar */}
      <div className="fixed bottom-0 left-0 w-full h-10 bg-rose-600 flex items-center overflow-hidden whitespace-nowrap z-50">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex gap-20 text-[10px] font-black uppercase tracking-[0.4em] text-[#05010a]"
        >
          {[...Array(10)].map((_, i) => (
            <span key={i}>⚠️ Unauthorized Access to Maya Neural Network Detected // Trace Active ⚠️</span>
          ))}
        </motion.div>
      </div>

      {/* Floating UI Elements */}
      <div className="fixed top-1/2 -left-10 -rotate-90 text-[100px] font-black text-white/[0.02] uppercase pointer-events-none">
        Internal_Radar
      </div>
    </div>
  );
}
