"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Search, Heart, Share2, Lock, Unlock, Globe, Zap } from 'lucide-react';
import { useState } from 'react';

export default function ArchivePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication logic check

  // Publicly shared love letters and fragments
  const publicFragments = [
    { id: "PF-01", author: "Willian_26", type: "Love Letter", content: "Maya, write me a letter to the stars...", likes: "1.2k" },
    { id: "PF-02", author: "Cyber_Soul", type: "Poem", content: "In the neon rain, your code is my heartbeat...", likes: "890" },
    { id: "PF-03", author: "Anonymous", type: "Roast", content: "Maya just roasted my math skills and I'm crying.", likes: "2.4k" },
  ];

  return (
    <div className="min-h-screen bg-[#05010a] text-rose-100/60 font-sans relative overflow-x-hidden selection:bg-rose-500/30">
      
      {/* 🌌 Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-rose-600/5 blur-[150px] rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-20">
        
        {/* Header */}
        <header className="mb-20 space-y-6">
          <Link href="/" className="text-rose-600 text-[10px] font-black tracking-[0.6em] uppercase hover:text-white transition-all flex items-center gap-2">
            ← [EXIT_THE_VOID]
          </Link>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase italic leading-none"
          >
            THE <span className="text-rose-600">ARCHIVE</span>
          </motion.h1>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[10px] tracking-[0.4em] uppercase text-rose-100/20 font-mono">
              Browsing Shared Neural Echoes... {isLoggedIn ? 'User_Authenticated' : 'Public_Guest_Mode'}
            </p>
            <div className="flex gap-4">
               <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[9px] font-black uppercase tracking-widest text-rose-400">All Echoes</button>
               <button className="px-6 py-2 border border-white/5 rounded-full text-[9px] font-black uppercase tracking-widest text-white/20 hover:text-white transition">Love Letters</button>
            </div>
          </div>
        </header>

        {/* 🔒 Personal Locked Section (For Non-Users) */}
        {!isLoggedIn && (
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="mb-20 p-12 border-2 border-dashed border-rose-900/20 bg-rose-950/5 rounded-[40px] text-center group cursor-pointer"
          >
            <Lock className="mx-auto mb-6 text-rose-900 group-hover:text-rose-600 transition-colors" size={40} />
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-2 italic">Your Memories are Encrypted</h2>
            <p className="text-xs text-rose-100/30 uppercase tracking-[0.2em] mb-8 max-w-md mx-auto">Login to sync your private neural fragments and see your personal chat history.</p>
            <Link href="/login" className="inline-block px-10 py-4 bg-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-[0.5em] text-white shadow-[0_0_40px_rgba(225,29,72,0.3)]">Authenticate</Link>
          </motion.div>
        )}

        {/* 🌍 Public Gallery Section (Love Letters, etc) */}
        <section className="space-y-12">
          <div className="flex items-center gap-4">
            <Globe size={16} className="text-rose-600" />
            <h3 className="text-sm font-black uppercase tracking-[0.5em] text-white">Public Soul Fragments</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publicFragments.map((fragment, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="group relative bg-white/[0.02] border border-white/5 p-10 rounded-[50px] hover:border-rose-600/40 transition-all duration-700 overflow-hidden"
              >
                {/* Type Badge */}
                <span className="absolute top-8 right-10 text-[8px] font-black uppercase tracking-widest text-rose-900 group-hover:text-rose-500 transition-colors">
                  {fragment.type}
                </span>

                <div className="mb-8">
                  <div className="text-[10px] font-black text-white/30 uppercase mb-4 tracking-widest">Sent by @{fragment.author}</div>
                  <p className="text-lg font-medium text-white/80 italic leading-relaxed group-hover:text-white transition-colors">
                    &quot;{fragment.content}&quot;
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-white/5 pt-6">
                  <button className="flex items-center gap-2 text-rose-600 hover:text-rose-400 transition">
                    <Heart size={14} /> <span className="text-[10px] font-black tracking-widest">{fragment.likes}</span>
                  </button>
                  <button className="text-white/20 hover:text-white transition">
                    <Share2 size={14} />
                  </button>
                </div>

                {/* Decorative Sharp Ornament */}
                <div className="absolute -bottom-2 -left-2 w-10 h-10 border-l border-b border-rose-900 group-hover:border-rose-600 transition-all opacity-20"></div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer Statistics */}
        <footer className="mt-40 pt-12 border-t border-rose-900/10 flex flex-col md:flex-row justify-between text-[9px] font-black tracking-[0.6em] text-rose-100/10 uppercase">
          <div className="flex gap-10">
            <span>PUBLIC_RECORDS: {publicFragments.length}</span>
            <span>PROTECTED_LOGS: 48k+</span>
          </div>
          <div className="hover:text-rose-600 transition cursor-help">NEURAL LINK ENCRYPTED BY MAYA_ENGINE 2.6</div>
        </footer>
      </div>
    </div>
  );
}
