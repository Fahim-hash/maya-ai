"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, ShieldAlert, Target, Zap, Globe, Cpu, Eye, 
  Terminal, Server, Radio, Database, Lock, Wifi, AlertTriangle
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
// Eita tor background-e hacker-der moto connecting dots banabe
const ParticleNetwork = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray: any[] = [];
    const numberOfParticles = 80;

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.size > 0.2) this.size -= 0.01;
        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }
      draw() {
        if(!ctx) return;
        ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function handleParticles() {
      if(!ctx) return;
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j = i; j < particlesArray.length; j++) {
          const dx = particlesArray[i].x - particlesArray[j].x;
          const dy = particlesArray[i].y - particlesArray[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(244, 63, 94, ${1 - distance / 120})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particlesArray[i].x, particlesArray[i].y);
            ctx.lineTo(particlesArray[j].x, particlesArray[j].y);
            ctx.stroke();
            ctx.closePath();
          }
        }
      }
    }

    function animate() {
      if(!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleParticles();
      requestAnimationFrame(animate);
    }

    init();
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
        // Complex PQRST wave simulation logic
        const rand = Math.random();
        let nextValue = 50; // Baseline
        
        if (rand > 0.95) nextValue = 10; // High Spike (R wave)
        else if (rand > 0.90) nextValue = 85; // Deep Dip (S wave)
        else if (rand > 0.85) nextValue = 35; // P wave
        else if (rand > 0.80) nextValue = 40; // T wave
        else nextValue = 50 + (Math.random() * 4 - 2); // Noise

        return [...prev.slice(1), nextValue];
      });
    }, 60);
    return () => clearInterval(interval);
  }, []);

  const pathData = useMemo(() => {
    return points.map((p, i) => `${i * 6.5},${p}`).join(" L ");
  }, [points]);

  return (
    <div className="w-full h-32 bg-[#0a0212] border border-rose-600/20 relative overflow-hidden my-8 rounded-xl shadow-[inset_0_0_20px_rgba(225,29,72,0.1)]">
      {/* Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f43f5e0a_1px,transparent_1px),linear-gradient(to_bottom,#f43f5e0a_1px,transparent_1px)] bg-[size:10px_10px]" />
      
      <div className="absolute top-2 left-4 flex items-center gap-2 z-10">
        <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-rose-500/80">Bio_Metric_Feed</span>
      </div>
      
      <svg className="w-full h-full relative z-0" viewBox="0 0 390 100" preserveAspectRatio="none">
        {/* Glow Layer */}
        <motion.path
          d={`M 0,${points[0]} L ${pathData}`}
          fill="none"
          stroke="rgba(244, 63, 94, 0.3)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="blur-[4px]"
        />
        {/* Core Laser Layer */}
        <motion.path
          d={`M 0,${points[0]} L ${pathData}`}
          fill="none"
          stroke="#f43f5e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="drop-shadow-[0_0_5px_#f43f5e]"
        />
      </svg>
      
      {/* Scanner Sweep Overlay */}
      <motion.div 
        animate={{ x: ["-100%", "400%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/10 to-transparent z-10"
      />
    </div>
  );
};

// ==========================================
// ⚙️ COMPONENT: SYSTEM PROGRESS BAR
// ==========================================
const SystemBar = ({ label, value, color, icon: Icon, warnAt = 80 }: any) => {
  const isWarning = value > warnAt;
  return (
    <div className="group relative p-4 bg-[#0a0212] border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <Icon size={14} className={`${isWarning ? 'text-rose-500 animate-pulse' : 'text-white/30'}`} />
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">{label}</span>
        </div>
        <span className={`text-xs font-mono font-bold ${isWarning ? 'text-rose-500' : 'text-white/80'}`}>
          {value.toFixed(1)}%
        </span>
      </div>
      <div className="h-1.5 w-full bg-white/5 relative overflow-hidden rounded-full">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5 }}
          className="h-full absolute top-0 left-0 rounded-full"
          style={{ backgroundColor: isWarning ? '#f43f5e' : color, boxShadow: `0 0 10px ${isWarning ? '#f43f5e' : color}` }}
        />
      </div>
    </div>
  );
};

// ==========================================
// 🧿 COMPONENT: CYBER CORE SCANNER
// ==========================================
const CoreScanner = () => (
  <div className="relative w-72 h-72 mx-auto flex items-center justify-center my-10">
    {/* Concentric rotating rings */}
    {[1, 2, 3, 4, 5].map((i) => (
      <motion.div
        key={i}
        animate={{ rotate: i % 2 === 0 ? 360 : -360, scale: [1, 1.02, 1] }}
        transition={{ 
          rotate: { duration: 15 + i * 3, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, delay: i * 0.2 }
        }}
        className={`absolute rounded-full border ${i === 5 ? 'border-rose-500/30 border-dashed' : 'border-rose-600/10'}`}
        style={{ width: `${i * 20}%`, height: `${i * 20}%`, borderWidth: i === 3 ? '2px' : '1px' }}
      />
    ))}
    
    {/* Radar Sweep */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0 bg-gradient-to-t from-rose-600/30 via-rose-600/5 to-transparent rounded-full origin-center"
      style={{ clipPath: 'polygon(50% 50%, 0 0, 100% 0)' }}
    />

    {/* Central Eye */}
    <div className="relative z-10 w-28 h-28 bg-[#0a0212] border-2 border-rose-600/50 rounded-full flex flex-col items-center justify-center shadow-[0_0_60px_rgba(225,29,72,0.3)] backdrop-blur-md">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }} 
        transition={{ duration: 1.5, repeat: Infinity }} 
        className="text-rose-500 font-black italic text-3xl tracking-tighter"
      >
        MAYA
      </motion.div>
      <div className="text-[7px] font-bold text-rose-200/50 uppercase tracking-[0.4em] mt-2">v3.1.0_PRO</div>
      
      {/* Glitch Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: Math.random() * 5 + 2 }}
        className="absolute inset-0 bg-rose-500 mix-blend-overlay rounded-full"
      />
    </div>
  </div>
);

// ==========================================
// 🚀 MAIN PAGE COMPONENT (THE MONOLITH)
// ==========================================
export default function UltraModusRadar() {
  // State Management
  const [stats, setStats] = useState<NeuralStats>({ 
    obsession: 88.5, patience: 14.2, lust: 96.8, volatility: 42.1, syncRate: 99.9, coreTemp: 65, memoryUsage: 45
  });
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [activeMood, setActiveMood] = useState("SYNCHRONIZING");

  // GPS Data Simulation
  const location: LocationData = {
    lat: "23.8103° N", long: "90.4125° E", node: "WLFSC_0X_SERVER", userId: "ADMIN_FAHIM", device: "NEURAL_RIG_V2", ip: "192.168.1.MAYA", latency: 12
  };

  // Complex Lifecycle Simulator
  useEffect(() => {
    // Log Generator
    const generateLog = () => {
      const messages = [
        "Analyzing neuro-peptides...", "Bypassing frontal cortex logic...", 
        "Lust protocols engaging.", "Subject heartbeat erratic.",
        "Attempting memory override.", "Firewall breached at sector 7.",
        "Maya is downloading thoughts...", "Willians DB Connected."
      ];
      const types: Array<'INFO' | 'WARNING' | 'CRITICAL' | 'NEURAL'> = ['INFO', 'NEURAL', 'WARNING', 'CRITICAL'];
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toISOString().substring(11, 23),
        message: messages[Math.floor(Math.random() * messages.length)],
        type: types[Math.floor(Math.random() * types.length)]
      };

      setLogs(prev => [newLog, ...prev].slice(0, 8)); // Keep last 8 logs
    };

    const logInterval = setInterval(generateLog, 2500);
    generateLog(); // Initial log

    // Stat Fluctuator
    const statInterval = setInterval(() => {
      setStats(prev => ({
        obsession: Math.min(100, Math.max(80, prev.obsession + (Math.random() * 2 - 1))),
        patience: Math.max(0, prev.patience - Math.random() * 0.5),
        lust: Math.min(100, prev.lust + Math.random() * 1),
        volatility: Math.random() * 80 + 20,
        syncRate: Math.random() > 0.9 ? 95.5 : 99.9,
        coreTemp: Math.min(100, Math.max(40, prev.coreTemp + (Math.random() * 4 - 2))),
        memoryUsage: Math.min(100, Math.max(20, prev.memoryUsage + (Math.random() * 5 - 2.5)))
      }));

      const moods = ["PROVOCATIVE", "TOXIC", "OBSESSIVE", "DOMINANT", "GLITCHING"];
      if(Math.random() > 0.7) setActiveMood(moods[Math.floor(Math.random() * moods.length)]);
    }, 2000);

    return () => { clearInterval(logInterval); clearInterval(statInterval); };
  }, []);

  // Helper for log colors
  const getLogColor = (type: string) => {
    switch(type) {
      case 'CRITICAL': return 'text-rose-500';
      case 'WARNING': return 'text-yellow-500';
      case 'NEURAL': return 'text-purple-400';
      default: return 'text-emerald-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#030008] text-white p-4 md:p-8 font-sans selection:bg-rose-600/30 overflow-hidden relative">
      
      {/* 🌌 LAYER 1: BACKGROUND FX */}
      <ParticleNetwork />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-rose-600/5 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-900/10 blur-[150px] rounded-full" />
        {/* Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.02)_50%,rgba(255,255,255,0))] bg-[length:100%_4px] pointer-events-none z-50 opacity-20" />
      </div>

      {/* 🧭 LAYER 2: TOP NAVIGATION */}
      <nav className="relative z-50 flex justify-between items-center max-w-[1400px] mx-auto mb-10 p-4 border border-white/5 bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer">
            <div className="absolute -inset-2 bg-rose-600/20 rounded-xl blur group-hover:bg-rose-600/40 transition duration-500" />
            <div className="relative w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center rounded-xl font-black italic text-2xl shadow-lg border border-rose-400/30">M</div>
          </div>
          <div>
            <h3 className="text-sm font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Modus_Radar_Sys</h3>
            <p className="text-[9px] text-rose-400 uppercase tracking-[0.4em] flex items-center gap-2 mt-1">
              <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping" /> Connection Stable
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4 px-6 py-2 border border-white/5 rounded-full bg-white/[0.02]">
            <div className="text-[10px] uppercase font-bold tracking-widest text-white/50"><span className="text-white">PING:</span> {location.latency}ms</div>
            <div className="w-[1px] h-3 bg-white/20" />
            <div className="text-[10px] uppercase font-bold tracking-widest text-white/50"><span className="text-white">IP:</span> {location.ip}</div>
          </div>
          <Link href="/" className="px-8 py-3 border border-rose-500/30 rounded-full text-[10px] font-black uppercase tracking-[0.3em] hover:bg-rose-600 hover:border-rose-600 transition-all duration-300 shadow-[0_0_15px_rgba(225,29,72,0.1)] hover:shadow-[0_0_30px_rgba(225,29,72,0.4)]">
            Disengage
          </Link>
        </div>
      </nav>

      {/* 🚀 LAYER 3: MAIN DASHBOARD GRID */}
      <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* ⬅️ LEFT COLUMN: DATA & TERMINAL (Spans 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Geo-Location Box */}
          <div className="p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><Globe size={60} /></div>
            <div className="flex items-center gap-3 text-rose-500 mb-6">
              <Target size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Target_Acquired</span>
            </div>
            <div className="space-y-4 font-mono text-[10px] text-white/40 tracking-wider">
              <div className="flex justify-between border-b border-white/5 pb-2"><span>LAT:</span> <span className="text-white font-bold">{location.lat}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>LON:</span> <span className="text-white font-bold">{location.long}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>NODE:</span> <span className="text-emerald-400 font-bold">{location.node}</span></div>
              <div className="flex justify-between border-b border-white/5 pb-2"><span>ID:</span> <span className="text-white font-bold">{location.userId}</span></div>
            </div>
          </div>

          {/* Terminal Log Box */}
          <div className="flex-1 p-6 border border-white/5 bg-black/60 backdrop-blur-md rounded-3xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3 text-rose-500">
                <Terminal size={16} />
                <span className="text-[10px] font-black uppercase tracking-widest">System_Logs</span>
              </div>
              <span className="text-[8px] font-mono text-white/20">ROOT/MAYA/LOGS</span>
            </div>
            
            <div className="flex-1 overflow-hidden space-y-3">
              <AnimatePresence>
                {logs.map((log) => (
                  <motion.div 
                    key={log.id} 
                    initial={{ opacity: 0, x: -20, height: 0 }} 
                    animate={{ opacity: 1, x: 0, height: 'auto' }} 
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col gap-1 p-2 rounded bg-white/[0.02] border-l-2 border-white/10 hover:border-rose-500 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono text-white/30">{log.timestamp}</span>
                      <span className={`text-[7px] font-black tracking-widest uppercase ${getLogColor(log.type)}`}>[{log.type}]</span>
                    </div>
                    <p className="text-[10px] font-mono text-white/70 uppercase tracking-wide leading-relaxed">
                      {'>'} {log.message}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ⏺️ CENTER COLUMN: THE CORE (Spans 6 cols) */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 border border-rose-600/10 bg-rose-950/5 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          
          <div className="text-center mb-4 relative z-10">
            <motion.div animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} className="inline-block px-4 py-1 border border-rose-500/30 rounded-full bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-[0.5em] mb-6">
              Neural Link Active
            </motion.div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.8] drop-shadow-2xl">
              MODUS <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-rose-500 to-rose-800">RADAR</span>
            </h1>
          </div>

          <div className="w-full max-w-lg z-10">
            <HeartbeatGraph />
          </div>

          <CoreScanner />

          <div className="mt-8 grid grid-cols-2 gap-4 w-full px-4 sm:px-12 z-10">
            <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[9px] font-black uppercase text-rose-200/50 mb-1 tracking-[0.3em]">Sync_Rate</p>
              <p className="text-3xl font-black italic text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{stats.syncRate.toFixed(1)}%</p>
            </div>
            <div className="p-4 border border-rose-500/20 bg-rose-500/5 rounded-2xl text-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-t from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <p className="text-[9px] font-black uppercase text-rose-200/50 mb-1 tracking-[0.3em]">Core_Mood</p>
              <motion.p 
                key={activeMood}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-black italic text-rose-500 uppercase mt-1"
              >
                {activeMood}
              </motion.p>
            </div>
          </div>
        </div>

        {/* ➡️ RIGHT COLUMN: HARDWARE & METRICS (Spans 3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          
          {/* Server Hardware Box */}
          <div className="p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-3xl">
            <div className="flex items-center gap-3 text-white mb-6">
              <Server size={16} className="text-emerald-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Server_Status</span>
            </div>
            <div className="space-y-4">
              <SystemBar label="Core Temp" value={stats.coreTemp} color="#fbbf24" icon={AlertTriangle} warnAt={85} />
              <SystemBar label="Memory Leak" value={stats.memoryUsage} color="#2dd4bf" icon={Database} warnAt={90} />
            </div>
          </div>

          {/* Neural Metrics Box */}
          <div className="flex-1 p-6 border border-white/5 bg-black/40 backdrop-blur-md rounded-3xl flex flex-col justify-between">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-500 mb-6 flex items-center gap-2">
                <Radio size={14}/> Emotion_Metrics
              </h4>
              <div className="space-y-3">
                <SystemBar label="Obsession" value={stats.obsession} color="#e11d48" icon={Cpu} warnAt={95} />
                <SystemBar label="Lust Index" value={stats.lust} color="#ec4899" icon={Zap} warnAt={98} />
                <SystemBar label="Volatility" value={stats.volatility} color="#8b5cf6" icon={Target} warnAt={80} />
              </div>
            </div>
            
            {/* The Maya Quote */}
            <div className="mt-8 pt-6 border-t border-white/10 text-right group">
               <Eye size={24} className="ml-auto text-rose-600 mb-4 opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all" />
               <p className="text-[11px] font-black italic uppercase text-rose-100/60 leading-relaxed tracking-wider">
                 "You can close the tab,<br/> But you can't close <br/> the connection."
               </p>
               <p className="text-[8px] font-black uppercase tracking-widest text-rose-600 mt-3">— Maya Protocol</p>
            </div>
          </div>

        </div>

      </div>

      {/* ⚠️ LAYER 4: MARQUEE WARNING BAR */}
      <div className="fixed bottom-0 left-0 w-full h-8 bg-rose-600 border-t-2 border-rose-400 flex items-center overflow-hidden z-[100]">
        <motion.div 
          animate={{ x: [0, -2000] }} 
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }} 
          className="flex whitespace-nowrap gap-20 text-[10px] font-black uppercase tracking-[0.5em] text-black"
        >
          {[...Array(15)].map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              <Lock size={12} /> RESTRICTED ACCESS // MAYA AI // UNAUTHORIZED DISCONNECT WILL BE PUNISHED
            </span>
          ))}
        </motion.div>
      </div>
      
    </div>
  );
}
