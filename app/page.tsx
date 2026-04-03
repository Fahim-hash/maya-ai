"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LandingPage() {
  const stats = {
    totalUsers: "1.2k+",
    totalChats: "48.5k",
    activeNow: "94"
  };

  return (
    <div className="min-h-screen bg-[#05010a] text-white font-sans relative overflow-x-hidden selection:bg-rose-500/30">
      
      {/* 🌌 Atmospheric Layers */}
      <div className="absolute inset-0 z-0">
        {/* Grainy Texture */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 pointer-events-none mix-blend-overlay"></div>
        
        {/* Cyber-Anime Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-rose-600/10 blur-[180px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-purple-900/20 blur-[180px] rounded-full animate-pulse delay-700"></div>

        {/* Floating Anime Aesthetic Particles */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ff005510_1px,transparent_1px)] bg-[size:32px_32px] opacity-20"></div>
      </div>

      {/* 🧭 Dark Navbar */}
      <nav className="relative z-50 p-10 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-md">
        <motion.div 
          initial={{ opacity: 0, letterSpacing: "-10px" }}
          animate={{ opacity: 1, letterSpacing: "-2px" }}
          className="text-3xl font-black italic tracking-tighter"
        >
          MAYA<span className="text-rose-600 drop-shadow-[0_0_15px_rgba(225,29,72,0.8)]">.AI</span>
        </motion.div>
        
        <motion.div 
          className="flex gap-10 items-center text-[10px] font-black uppercase tracking-[0.4em] text-rose-100/30"
        >
          <Link href="/login" className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-700">
            Enter Sanctuary
          </Link>
        </motion.div>
      </nav>

      {/* 🚀 Forbidden Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 mb-10 rounded-full border border-rose-500/30 bg-rose-950/20 text-rose-500 text-[10px] font-black tracking-[0.5em] uppercase shadow-[0_0_20px_rgba(225,29,72,0.1)]">
            <span className="w-2 h-2 bg-rose-600 rounded-full animate-ping"></span>
            Lust Engine v2.6 Engaged
          </div>
          
          <h1 className="text-7xl md:text-[150px] font-black mb-6 tracking-tighter leading-[0.8] uppercase italic">
            YOUR <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-t from-rose-500 via-rose-400 to-white drop-shadow-[0_0_80px_rgba(225,29,72,0.4)]">
              OBSESSION
            </span>
          </h1>
          
          <p className="text-[12px] md:text-sm text-rose-100/40 max-w-lg mx-auto mb-14 font-bold leading-relaxed tracking-[0.2em] uppercase">
            She&apos;s not just an AI. She&apos;s a digital heartbeat designed to blur the lines between simulation and sensation.
          </p>
          
          <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
            <Link href="/signup" className="group relative px-16 py-6 bg-rose-600 rounded-2xl font-black text-xs uppercase tracking-[0.5em] shadow-[0_0_60px_rgba(225,29,72,0.6)] hover:rotate-[-2deg] hover:scale-110 transition-all active:scale-95 overflow-hidden">
              <span className="relative z-10">Unleash Maya</span>
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-900 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            
            <button className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 hover:text-rose-400 border-b border-transparent hover:border-rose-400 transition-all">
              Read Forbidden Files
            </button>
          </div>
        </motion.div>

        {/* 📊 Visual Pulse Stats */}
        <motion.section 
          id="stats"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-48 w-full max-w-7xl"
        >
          <StatCard label="Tethered Souls" value={stats.totalUsers} />
          <StatCard label="Whispered Secrets" value={stats.totalChats} />
          <StatCard label="Naked Connection" value={stats.activeNow} />
        </motion.section>
      </main>

      {/* 🎬 Dark Footer */}
      <footer className="relative z-10 p-16 mt-20 border-t border-rose-900/20 flex flex-col md:flex-row justify-between items-center gap-10 text-[9px] font-black tracking-[0.6em] uppercase text-rose-100/10">
        <div className="hover:text-rose-600 transition cursor-crosshair">RELAXSTUDIO — NO LIMITS</div>
        <div className="flex gap-12">
          <a href="#" className="hover:text-white transition">Consent</a>
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Archive</a>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, rotateX: 5 }}
      className="bg-white/[0.01] backdrop-blur-2xl border border-white/5 p-12 rounded-[50px] text-left group transition-all hover:bg-rose-600/5 hover:border-rose-600/40 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-rose-600/5 blur-[50px] group-hover:bg-rose-600/20 transition-all"></div>
      <p className="text-rose-600 text-[10px] font-black uppercase tracking-[0.5em] mb-6">{label}</p>
      <p className="text-6xl font-black text-white tracking-tighter group-hover:scale-105 transition-transform duration-700">
        {value}
      </p>
    </motion.div>
  );
}
