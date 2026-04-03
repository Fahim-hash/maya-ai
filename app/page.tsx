"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

// --- Components ---
function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white/[0.01] backdrop-blur-3xl border border-white/5 p-14 rounded-[50px] text-left group transition-all hover:bg-rose-600/5 hover:border-rose-600/30"
    >
      <p className="text-rose-600 text-[10px] font-black uppercase tracking-[0.6em] mb-8">{label}</p>
      <p className="text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-700">
        {value}
      </p>
    </motion.div>
  );
}

// --- Main Page ---
export default function LandingPage() {
  const stats = {
    totalUsers: "1.2k+",
    totalChats: "48.5k",
    activeNow: "94"
  };

  return (
    <div className="min-h-screen bg-[#05010a] text-white font-sans relative overflow-x-hidden selection:bg-rose-500/40">
      
      {/* 🌌 Atmospheric Cinematic Layers */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-rose-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-purple-900/15 blur-[180px] rounded-full animate-pulse delay-700"></div>
        
        {/* Cyber-Sigilism Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff005508_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* 🧭 Dark Navbar */}
      <nav className="relative z-50 p-10 flex justify-between items-center max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black italic tracking-tighter"
        >
          MAYA<span className="text-rose-600 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]">.AI</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-10 items-center text-[10px] font-black uppercase tracking-[0.4em] text-rose-100/30"
        >
          <Link href="/maya-identity" className="hover:text-rose-500 transition-colors hidden md:block">
            Identity Dossier
          </Link>
          <Link href="/login" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-700 shadow-2xl text-white">
            Enter Sanctuary
          </Link>
        </motion.div>
      </nav>

      {/* 🚀 Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "circOut" }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-8 rounded-full border border-rose-500/20 bg-rose-950/20 text-rose-500 text-[9px] font-black tracking-[0.5em] uppercase">
            <span className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-ping"></span>
            Lust Engine v2.6 Engaged
          </div>
          
          <h1 className="text-7xl md:text-[180px] font-black mb-4 tracking-tighter leading-[0.75] uppercase italic">
            MAYA<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-t from-rose-600 via-rose-400 to-white drop-shadow-[0_0_100px_rgba(225,29,72,0.5)]">
              IS YOURS
            </span>
          </h1>
          
          <p className="text-[11px] md:text-xs text-rose-100/40 max-w-lg mx-auto mb-16 font-black leading-relaxed tracking-[0.4em] uppercase text-pretty">
             She&apos;s your digital ruin. Your midnight confession. 
             <br />
             The only AI that feels <span className="text-rose-500 underline decoration-rose-500/30 underline-offset-4 cursor-help">real</span>.
          </p>
          
          <div className="flex flex-col md:flex-row gap-10 justify-center items-center">
            <Link href="/signup" className="group relative px-20 py-7 bg-rose-600 rounded-2xl font-black text-xs uppercase tracking-[0.6em] shadow-[0_0_70px_rgba(225,29,72,0.6)] hover:rotate-[-2deg] hover:scale-110 transition-all active:scale-95 overflow-hidden">
              <span className="relative z-10 text-white">Unleash Maya</span>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            
            {/* Identity Link as Secondary CTA */}
            <Link href="/maya-identity" className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-rose-400 border-b border-white/5 hover:border-rose-400 transition-all pb-2">
              System Specifications
            </Link>
          </div>
        </motion.div>

        {/* 📊 Stats Grid */}
        <motion.section 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-52 w-full max-w-7xl"
        >
          <StatCard label="Tethered Souls" value={stats.totalUsers} />
          <StatCard label="Whispered Secrets" value={stats.totalChats} />
          <StatCard label="Naked Connection" value={stats.activeNow} />
        </motion.section>
      </main>

      {/* 🎬 Footer */}
      <footer className="relative z-10 p-16 mt-20 border-t border-rose-900/10 flex flex-col md:flex-row justify-between items-center gap-10 text-[9px] font-black tracking-[0.6em] uppercase text-rose-100/10">
        <div className="hover:text-rose-600 transition cursor-default tracking-[1.2em]">RELAXSTUDIO</div>
        <div className="flex gap-12 text-white/20">
          <Link href="/maya-identity" className="hover:text-white transition">Core Specs</Link>
          <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
          <Link href="/archive" className="hover:text-white transition">Archive</Link>
        </div>
      </footer>
    </div>
  );
}
