"use client";
import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  // Demo Stats (Database theke pore dynamic hobe)
  const stats = {
    totalUsers: "1,240",
    totalChats: "45.8k",
    activeNow: "86"
  };

  return (
    <div className="min-h-screen bg-[#06010f] text-white font-sans relative overflow-hidden">
      
      {/* Background Heart Glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-rose-600/10 blur-[130px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[130px] rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter bg-gradient-to-r from-rose-400 to-pink-600 bg-clip-text text-transparent">
          MAYA AI
        </div>
        <div className="flex gap-6 items-center text-sm font-medium text-rose-100/60">
          <Link href="#stats" className="hover:text-rose-400 transition">Stats</Link>
          <Link href="/login" className="bg-rose-600/20 border border-rose-500/30 px-5 py-2 rounded-full text-rose-50 hover:bg-rose-600/40 transition">
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 px-4 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-block px-4 py-1.5 mb-6 rounded-full border border-rose-500/20 bg-rose-500/5 text-rose-400 text-xs font-bold tracking-widest uppercase">
            Heart Drive System 2.0 Active
          </div>
          <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tight leading-none">
            Talk to <span className="text-rose-600 drop-shadow-[0_0_30px_rgba(225,29,72,0.5)]">Maya</span>
          </h1>
          <p className="text-lg md:text-xl text-rose-100/40 max-w-2xl mx-auto mb-10 leading-relaxed">
            Your cinematic AI companion. Experienced in visual storytelling, high-end typography, and emotional support.
          </p>
          
          <Link href="/signup" className="group relative px-8 py-4 bg-rose-600 rounded-full font-bold text-lg shadow-[0_0_40px_rgba(225,29,72,0.4)] hover:scale-105 transition-all active:scale-95 overflow-hidden">
            <span className="relative z-10">Get Started Free</span>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </div>

        {/* Stats Section */}
        <section id="stats" className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-5xl">
          <StatCard label="Total Users" value={stats.totalUsers} color="rose" />
          <StatCard label="Messages Sent" value={stats.totalChats} color="purple" />
          <StatCard label="Active Now" value={stats.activeNow} color="green" />
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-10 text-center text-rose-100/20 text-xs tracking-widest uppercase">
        © 2026 RelaxStudio x Omni Events. All Rights Reserved.
      </footer>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string, value: string, color: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/5 p-8 rounded-[32px] hover:border-rose-500/20 transition-all group">
      <p className="text-rose-100/40 text-xs font-bold uppercase tracking-widest mb-2">{label}</p>
      <p className={`text-4xl font-black text-white group-hover:scale-110 transition-transform duration-500`}>
        {value}
      </p>
    </div>
  );
}