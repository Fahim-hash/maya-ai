"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldAlert, Target, Zap, Globe, Cpu, Eye, 
  Terminal, Server, Radio, Database, Lock, AlertTriangle
} from 'lucide-react';
import Link from 'next/link';

// ==========================================
// 🧠 TYPE DEFINITIONS & INTERFACES
// ==========================================

interface NeuralStats {
  obsession: number;
  patience: number;
  lust: number;
  volatility: number;
  syncRate: number;
  coreTemp: number;
  memoryUsage: number;
}

interface LocationData {
  lat: string;
  long: string;
  node: string;
  userId: string;
  device: string;
  ip: string;
  latency: number;
}

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'CRITICAL' | 'NEURAL';
}

// ==========================================
// 🌌 COMPONENT: CANVAS PARTICLE NETWORK
// ==========================================
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();

    let particlesArray: Particle[] = [];
    const numberOfParticles = 80;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;

      constructor() {
        // FIXED: Using non-null assertion '!' to satisfy TypeScript build
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > canvas!.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas!.height) this.speedY *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach((p, i) => {
        p.update();
        p.draw();
        for (let j = i; j < particlesArray.length; j++) {
          const dx = p.x - particlesArray[j].x;
          const dy = p.y - particlesArray[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(244, 63, 94, ${0.2 - dist / 600})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />;
};

// ==========================================
// 💓 COMPONENT: ADVANCED ECG HEARTBEAT
// ==========================================
const HeartbeatGraph = () => {
  const [points, setPoints] = useState<number[]>(Array(60).fill(50));

  useEffect(() => {
    const interval = setInterval(() => {
      setPoints((prev) => {
        const rand = Math.random();
        let nextValue = 50;
        if (rand > 0.95) nextValue = 10; 
        else if (rand > 0.90) nextValue = 85;
        else if (rand > 0.85) nextValue = 35;
        else nextValue = 50 + (Math.random() * 4 - 2);
        return [...prev.slice(1), nextValue];
      });
    }, 70);
    return () => clearInterval(interval);
  }, []);

  const pathData = useMemo(() => points.map((p, i) => `${i * 6.5},${p}`).join(" L "), [points]);

  return (
    <div className="w-full h-32 bg-[#0a0212] border border-rose-600/20 relative overflow-hidden my-8 rounded-xl">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e0a_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e0a_1px,transparent_1px)] bg-[size:10px_10px]" />
      <svg className="w-full h-full relative z-0" viewBox="0 0 390 100" preserveAspectRatio="none">
        <motion.path d={`M 0,${points[0]} L ${pathData}`} fill="none" stroke="#f43f5e" strokeWidth="1.5" className="drop-shadow-[0_0_5px_#f43f5e]" />
      </svg>
      <motion.div animate={{ x: ["-100%", "400%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/5 to-transparent z-10" />
    </div>
  );
};

const SystemBar = ({ label, value, color, icon: Icon, warnAt = 80 }: any) => (
  <div className="group relative p-4 bg-[#0a0212] border border-white/5 rounded-2xl">
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className={value > warnAt ? 'text-rose-500 animate-pulse' : 'text-white/30'} />
        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{label}</span>
      </div>
      <span className={`text-xs font-mono font-bold ${value > warnAt ? 'text-rose-500' : 'text-white/80'}`}>{value.toFixed(1)}%</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 relative overflow-hidden rounded-full">
      <motion.div animate={{ width: `${value}%` }} className="h-full absolute top-0 left-0" style={{ backgroundColor: value > warnAt ? '#f43f5e' : color }} />
    </div>
  </div>
);

// ==========================================
// 🚀 MAIN PAGE COMPONENT
// ==========================================
export default function UltraModusRadar() {
  const [stats, setStats] = useState<NeuralStats>({ 
    obsession: 88, patience: 14, lust: 96, volatility: 42, syncRate: 99, coreTemp: 62, memoryUsage: 41
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeMood, setActiveMood] = useState("INITIALIZING");
  const [location, setLocation] = useState<LocationData>({
    lat: "SEARCHING...", long: "SEARCHING...", node: "WLFSC_0X_SERVER", userId: "ADMIN_FAHIM", device: "NEURAL_RIG_V2", ip: "103.11.MAYA", latency: 14
  });

  useEffect(() => {
    // 🛰️ REAL-TIME GPS TRACKING
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.watchPosition((pos) => {
        setLocation(prev => ({
          ...prev,
          lat: pos.coords.latitude.toFixed(4) + "° N",
          long: pos.coords.longitude.toFixed(4) + "° E",
        }));
      }, (err) => console.error("GPS Error", err), { enableHighAccuracy: true });
    }

    const logInterval = setInterval(() => {
      const msgs = ["Neuro-link active", "Heartbeat erratic", "Maya is watching", "Memory synced"];
      const newLog: LogEntry = {
        id: Math.random().toString(36),
        timestamp: new Date().toLocaleTimeString(),
        message: msgs[Math.floor(Math.random() * msgs.length)],
        type: Math.random() > 0.8 ? 'CRITICAL' : 'INFO'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 7));
    }, 3000);

    const statInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        volatility: Math.random() * 50 + 20,
        syncRate: 98 + Math.random() * 2,
        coreTemp: 60 + Math.random() * 10
      }));
      const moods = ["TOXIC", "OBSESSED", "GLITCHY", "DOMINANT"];
      setActiveMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 5000);

    return () => { clearInterval(logInterval); clearInterval(statInterval); };
  }, []);

  return (
    <div className="min-h-screen bg-[#030008] text-white p-4 md:p-8 font-sans overflow-hidden relative">
      <ParticleNetwork />
      
      {/* HEADER */}
      <nav className="relative z-50 flex justify-between items-center max-w-[1400px] mx-auto mb-10 p-4 border border-white/5 bg-black/40 backdrop-blur-xl rounded-3xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-600 flex items-center justify-center rounded-xl font-black italic text-2xl">M</div>
          <div>
            <h3 className="text-sm font-black tracking-widest uppercase">Modus_Radar_v3</h3>
            <p className="text-[9px] text-rose-500 uppercase tracking-widest flex items-center gap-2"><span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" /> Connection Stable</p>
          </div>
        </div>
        <Link href="/" className="px-8 py-3 border border-rose-500/30 rounded-full text-[10px] font-black uppercase hover:bg-rose-600 transition-all">Disengage</Link>
      </nav>

      <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: DATA */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 border border-white/5 bg-black/40 rounded-3xl">
            <div className="flex items-center gap-3 text-rose-500 mb-6 font-black text-[10px] uppercase tracking-widest"><Globe size={16}/> GPS_Acquisition</div>
            <div className="space-y-4 font-mono text-[10px] text-white/40">
              <div className="flex justify-between border-b border-white/5 pb-2"><span>LAT:</span> <span className="text-white">{location.lat}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>LON:</span> <span className="text-white">{location.long}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>NODE:</span> <span className="text-emerald-400">{location.node}</span></div>
            </div>
          </div>

          <div className="p-6 border border-white/5 bg-black/60 rounded-3xl h-[400px] flex flex-col">
            <div className="flex items-center gap-3 text-rose-500 mb-6 font-black text-[10px] uppercase tracking-widest"><Terminal size={16}/> Logs</div>
            <div className="space-y-3 overflow-hidden">
              <AnimatePresence>
                {logs.map((l) => (
                  <motion.div key={l.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-2 bg-white/[0.02] border-l-2 border-rose-500 rounded text-[9px] font-mono">
                    <span className="text-white/30">[{l.timestamp}]</span> {'>'} {l.message}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CENTER: RADAR */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 border border-rose-600/10 rounded-3xl relative">
          <div className="text-center mb-6">
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8]">MODUS <br/><span className="text-rose-600">RADAR</span></h1>
          </div>
          <HeartbeatGraph />
          <div className="relative w-64 h-64 flex items-center justify-center my-10">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute inset-0 border border-rose-600/20 rounded-full" />
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 8, repeat: Infinity, ease: "linear" }} className="absolute inset-4 border border-rose-600/10 border-dashed rounded-full" />
            <div className="relative z-10 w-24 h-24 bg-rose-600 flex items-center justify-center rounded-full shadow-[0_0_50px_rgba(225,29,72,0.5)] font-black text-2xl italic">MAYA</div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full px-12">
            <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center">
              <p className="text-[9px] uppercase text-rose-200/50 mb-1">Sync_Rate</p>
              <p className="text-2xl font-black italic">{stats.syncRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center">
              <p className="text-[9px] uppercase text-rose-200/50 mb-1">Mood</p>
              <p className="text-lg font-black italic text-rose-500 uppercase">{activeMood}</p>
            </div>
          </div>
        </div>

        {/* RIGHT: METRICS */}
        <div className="lg:col-span-3 space-y-6">
          <div className="p-6 border border-white/5 bg-black/40 rounded-3xl">
            <div className="flex items-center gap-3 text-emerald-400 mb-6 font-black text-[10px] uppercase tracking-widest"><Server size={16}/> Hardware</div>
            <SystemBar label="Core Temp" value={stats.coreTemp} color="#fbbf24" icon={AlertTriangle} />
            <SystemBar label="Memory" value={stats.memoryUsage} color="#2dd4bf" icon={Database} />
          </div>
          <div className="p-6 border border-white/5 bg-black/40 rounded-3xl">
            <div className="flex items-center gap-3 text-rose-500 mb-6 font-black text-[10px] uppercase tracking-widest"><Radio size={16}/> Bio_Metrix</div>
            <SystemBar label="Obsession" value={stats.obsession} color="#e11d48" icon={Cpu} />
            <SystemBar label="Lust Index" value={stats.lust} color="#ec4899" icon={Zap} />
          </div>
          <div className="mt-8 p-6 text-right border-t border-white/10">
            <Eye size={20} className="ml-auto text-rose-600 mb-4 animate-pulse" />
            <p className="text-[10px] font-black italic uppercase text-rose-100/60 leading-relaxed">"You can't hide from <br/> what's already inside."</p>
          </div>
        </div>

      </div>

      {/* FOOTER WARNING */}
      <div className="fixed bottom-0 left-0 w-full h-8 bg-rose-600 flex items-center overflow-hidden z-[100]">
        <motion.div animate={{ x: [0, -1000] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="flex whitespace-nowrap gap-20 text-[10px] font-black uppercase tracking-[0.5em] text-black">
          {[...Array(10)].map((_, i) => <span key={i}>⚠️ RESTRICTED ACCESS // MAYA NEURAL NETWORK ACTIVE // DO NOT DISCONNECT ⚠️</span>)}
        </motion.div>
      </div>
    </div>
  );
}
