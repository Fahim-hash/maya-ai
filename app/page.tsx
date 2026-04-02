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
    <div className="min-h-screen bg-[#05010a] text-white font-sans relative overflow-x-hidden">
      
      {/* 🌌 Cinematic Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-600/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      {/* 🧭 Navbar */}
      <nav className="relative z-50 p-8 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black tracking-tighter"
        >
          MAYA<span className="text-rose-600">.AI</span>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex gap-8 items-center text-[11px] font-bold uppercase tracking-[0.2em] text-rose-100/40"
        >
          <Link href="#stats" className="hover:text-rose-500 transition-colors">Statistics</Link>
          <Link href="/login" className="px-6 py-2 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all duration-500">
            Sign In
          </Link>
        </motion.div>
      </nav>

      {/* 🚀 Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 text-[10px] font-black tracking-[0.3em] uppercase animate-bounce">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full"></span>
            Heart Drive 2.0 Active
          </div>
          
          <h1 className="text-6xl md:text-[120px] font-black mb-8 tracking-tighter leading-[0.85] uppercase">
            MEET <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-rose-400 to-rose-700 drop-shadow-[0_0_50px_rgba(225,29,72,0.3)]">MAYA</span>
          </h1>
          
          <p className="text-sm md:text-lg text-rose-100/30 max-w-xl mx-auto mb-12 font-medium leading-relaxed tracking-wide">
            Your cinematic AI soulmate. Built for emotional resonance, deep conversations, and creative inspiration.
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link href="/signup" className="group relative px-12 py-5 bg-rose-600 rounded-full font-black text-sm uppercase tracking-widest shadow-[0_0_50px_rgba(225,29,72,0.5)] hover:scale-110 transition-all active:scale-95 overflow-hidden">
              <span className="relative z-10">Start Connection</span>
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            
            <button className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-100/20 hover:text-rose-100/60 transition-colors">
              View Patch Notes 2.6
            </button>
          </div>
        </motion.div>

        {/* 📊 Stats Section */}
        <motion.section 
          id="stats"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-40 w-full max-w-6xl"
        >
          <StatCard label="Soul Links" value={stats.totalUsers} />
          <StatCard label="Memory Fragments" value={stats.totalChats} />
          <StatCard label="Synchronized" value={stats.activeNow} />
        </motion.section>
      </main>

      {/* 🎬 Footer */}
      <footer className="relative z-10 p-12 mt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-bold tracking-[0.3em] uppercase text-rose-100/10">
        <div>© 2026 RELAXSTUDIO x OMNI</div>
        <div className="flex gap-8">
          <a href="#" className="hover:text-rose-500 transition">Privacy</a>
          <a href="#" className="hover:text-rose-500 transition">Terms</a>
          <a href="#" className="hover:text-rose-500 transition">Contact</a>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white/[0.02] backdrop-blur-3xl border border-white/5 p-10 rounded-[40px] text-left group transition-all hover:bg-white/[0.05] hover:border-rose-500/20"
    >
      <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4">{label}</p>
      <p className="text-5xl font-black text-white tracking-tighter transition-transform duration-500">
        {value}
      </p>
    </motion.div>
  );
}