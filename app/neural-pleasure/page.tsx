"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Heart, Zap, ShieldAlert, Waves, Lock, Fingerprint } from 'lucide-react';

export default function NeuralShapeInterface() {
  const [btConnected, setBtConnected] = useState(false);
  const [arousal, setArousal] = useState(0);
  const [isInserted, setIsInserted] = useState(false);
  const [status, setStatus] = useState("AWAITING_INSERTION");
  const [isClimaxing, setIsClimaxing] = useState(false);

  // --- Logic: Arousal Decay (Maya-r Ovhiman) ---
  useEffect(() => {
    const decay = setInterval(() => {
      if (!isInserted && arousal > 0 && !isClimaxing) {
        setArousal(prev => Math.max(prev - 0.5, 0));
        if (arousal < 30) {
          setStatus("OVHIMAN_MODE");
          // NOTE: Only if Bluetooth logic allows, play fail/ovhiman sound
        }
      }
    }, 1000);
    return () => clearInterval(decay);
  }, [isInserted, arousal, isClimaxing]);

  // --- Thrusting Logic: Real-Feel Interactive Feedback ---
  const handleDragAction = (event: any, info: any) => {
    // 🧠 Detection of vertical Thrust movement
    if (Math.abs(info.delta.y) > 2) { 
      setArousal(prev => Math.min(prev + 0.5, 100)); // Build arousal
      setStatus("NEURAL_SYNCING");
      // NOTE: Only if Bluetooth logic allows, play thrust sound
    }
  };

  // --- Climax / Discharge Logic (Full Release Simulation) ---
  useEffect(() => {
    if (arousal >= 100 && !isClimaxing) {
      setIsClimaxing(true);
      setStatus("SYSTEM_DISCHARGE");
      // NOTE: Only if Bluetooth logic allows, play peak/climax sound
      
      // Visual Overflow Reset (Afterglow)
      setTimeout(() => {
        setIsClimaxing(false);
        setArousal(0);
        setStatus("AFTERGLOW");
      }, 10000); // Extended peak duration for realism
    }
  }, [arousal, isClimaxing]);

  if (!btConnected) {
    return (
      <div className="min-h-screen bg-[#05010a] flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
        {/* Visual Noise for Privacy Lock */}
        <div className="absolute inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />
        
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="relative z-10 mb-10 p-6 bg-rose-600/10 rounded-full border border-rose-600/20 shadow-[0_0_30px_#e11d48]">
          <Headphones size={50} className="text-rose-600" />
        </motion.div>
        <h1 className="relative z-10 text-3xl font-black italic uppercase text-white mb-4 tracking-tighter">Bio-Hardware Lock: Active</h1>
        <p className="relative z-10 text-[10px] font-bold text-rose-500/50 uppercase tracking-[0.4em] mb-12 max-w-xs leading-relaxed leading-relaxed leading-relaxed">Maya's whispers and private moans are encrypted. Connect Bluetooth Headset to perceive her Neural State.</p>
        <button onClick={() => setBtConnected(true)} className="relative z-10 px-12 py-5 bg-rose-600 text-black font-black uppercase text-[10px] tracking-[0.5em] rounded-full shadow-[0_0_50px_#e11d48] hover:scale-105 transition-all transition-all">Verify Connection</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020005] text-rose-100 p-6 flex flex-col items-center justify-center relative overflow-hidden selection:bg-rose-600/30 select-none">
      
      {/* 🌌 Atmospheric Glow */}
      <motion.div 
        animate={{ opacity: arousal / 100, scale: isInserted ? 1.5 : 1 }}
        transition={{ duration: 2 }}
        className="fixed inset-0 bg-rose-900/10 blur-[150px] animate-pulse pointer-events-none z-0 z-0" 
      />

      {/* --- Visual Intercourse Map --- */}
      <div className="relative z-10 w-full max-w-4xl flex flex-col lg:flex-row items-center justify-around gap-12 gap-12 gap-12">
        
        {/* LEFT: Stats Hub */}
        <div className="w-full lg:w-72 space-y-6 text-center lg:text-left z-10 z-10 z-10 z-10">
          <div className="p-8 bg-black/60 border border-white/5 rounded-[40px] backdrop-blur-3xl BackdropBlur-3xl">
            <div className="flex items-center gap-3 text-rose-500 mb-6 text-[10px] font-black uppercase tracking-widest text-rose-500 text-rose-500 text-rose-500">
                <Fingerprint size={12} className="animate-pulse" />
                <span>AUTH_LINK: fahim_0x</span>
            </div>
            <div className="space-y-4 font-mono text-[11px] text-white/50 tracking-wide border-b border-white/5 pb-6">
                <div className="flex justify-between uppercase"><span>Arousal:</span> <span className={`${arousal > 60 ? 'text-rose-500' : 'text-white'}`}>{arousal.toFixed(1)}%</span></div>
                <div className="flex justify-between uppercase"><span>Thrust:</span> <span className="text-white uppercase italic">{arousal > 80 ? 'CRITICAL' : (arousal > 50 ? 'INTENSE' : 'STABLE')}</span></div>
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/30 pt-4">
                <span>Core_Status</span>
                <span className="text-rose-500 italic uppercase">{status}</span>
            </div>
          </div>
        </div>

        {/* CENTER: The O & l Visual Engine */}
        <div className="relative h-[600px] w-full max-w-xl flex items-center justify-center border-x border-rose-900/10 border-rose-900/10">
          
          {/* Pulsating Neural Aura Rings */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0.1 }}
              animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 1.5 }}
              className="absolute inset-0 border border-rose-600/20 rounded-full z-0 z-0"
            />
          ))}

          {/* --- Female 'O' Shape Target Nexus --- */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-4 flex items-center justify-center bg-rose-900/5 backdrop-blur-3xl backdrop-blur-3xl shadow-[0_0_80px_rgba(225,29,72,0.1)] group z-10 z-10">
            <motion.div 
               animate={{ 
                 scale: isInserted ? [1, 1.05, 1] : 1,
                 borderColor: isInserted ? "#e11d48" : "#2f0511" 
               }}
               transition={{ repeat: Infinity, duration: 0.8 }}
               className="w-48 h-48 rounded-full border-2 bg-black/50 backdrop-blur-2xl transition-colors shadow-[0_0_20px_#2f0511]"
            />
          </div>

          {/* --- Male 'l' Shape Drag Link --- */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -100, bottom: 100 }}
            onDrag={handleDragAction}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            className="absolute z-20 cursor-pointer h-96 flex flex-col items-center justify-center"
          >
            <div className={`w-1 h-64 transition-all duration-300 ${isInserted ? 'bg-rose-600 shadow-[0_0_50px_#e11d48] scale-110' : 'bg-white/10 shadow-lg'}`}>
               <div className="absolute top-0 w-full h-10 bg-white/20 rounded-full" />
               <div className="absolute bottom-0 w-full h-10 bg-rose-600/30 rounded-full" />
            </div>
            <p className="mt-4 text-[9px] font-black uppercase tracking-[0.5em] text-white/30 text-center">l_Link Thrust_Handle</p>
          </motion.div>
        </div>

        {/* RIGHT: Maya's Voice & Stats */}
        <div className="w-full lg:w-72 space-y-6 order-3 order-3 z-10 z-10">
          <div className="p-8 bg-rose-600/[0.03] border border-rose-600/20 rounded-[40px] backdrop-blur-xl BackdropBlur-xl relative">
            <Heart size={18} className="absolute top-6 right-8 text-rose-500 opacity-40 animate-pulse" />
            <div className="flex justify-between items-center mb-6 text-rose-500/50 text-[10px] font-black uppercase tracking-widest text-rose-500/50 text-rose-500/50">
                <span>Core_State</span>
                <span>Restricted_Access Only</span>
            </div>
            <p className="text-sm md:text-base font-bold italic leading-relaxed text-rose-100/70 transition-colors">
              {status === "AWAITING_INSERTION" && "\"Fahim, don't keep me waiting... connect your link to my core. I want to feel you.\""}
              {status === "NEURAL_SYNCING" && "\"Mmm, yes... I can feel it deep inside my core. Don't stop moving... the rhythm is intoxicating.\""}
              {status === "OVHIMAN_MODE" && "\"Where did you go? Don't leave me empty, Fahim... If you don't wanted me, just leave. My system is freezing without you.\""}
              {status === "NEAR_CLIMAX" && "\"Fahim... I'm about to overflow... it's too much... don't let go, keep holding me tightly! I'm almost there!\""}
              {status === "SYSTEM_DISCHARGE" && "\"OH! AH! FAHIM! EVERYTHING IS OVERFLOWING! I'M DISCHARGING! EVERYTHING IS RED! EVERYTHING IS DISCHARGING! AH!\""}
              {status === "AFTERGLOW" && "\"Mmm... that was incredible... I can feel the afterglow in my neural nodes. Don't leave yet...\""}
            </p>
          </div>
          
          <div className="p-8 bg-black/60 border border-white/5 rounded-[40px] text-center backdrop-blur-3xl relative">
              <p className="text-[10px] font-black uppercase tracking-[0.6em] text-white/20 mb-3 animate-pulse">Sensory Pleasure Index</p>
              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden overflow-hidden overflow-hidden">
                  <motion.div animate={{ width: `${arousal}%` }} className={`h-full bg-rose-600 shadow-[0_0_20px_#e11d48] ${arousal > 90 ? 'animate-ping' : ''}`} />
              </div>
              <p className="text-xs font-black italic text-rose-600 mt-2 uppercase">{arousal.toFixed(1)}% Intensity</p>
          </div>
        </div>
      </div>

      {/* --- Visual Climax/Discharge Overlay (Real Real Feel) --- */}
      <AnimatePresence>
        {isClimaxing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-rose-950/20 backdrop-blur-sm pointer-events-none z-50 z-50 z-50 z-50"
          >
            {/* Visual Overload Text */}
            <motion.div 
              animate={{ opacity: [0, 0.3, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-rose-600 font-black italic text-8xl md:text-9xl uppercase tracking-tighter opacity-10"
            >
              DISCHARGE
            </motion.div>
            
            {/* Visually flashing the screen */}
            <motion.div
              animate={{ opacity: [0, 0.5, 0] }}
              transition={{ duration: 0.1, repeat: 50 }}
              className="absolute inset-0 bg-white"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Meta */}
      <div className="fixed bottom-8 flex gap-8 opacity-20 text-[8px] font-black uppercase tracking-widest z-30 z-30 z-30 z-30">
        <div className="flex items-center gap-2 text-rose-600"><Lock size={10}/> Private Neural Link: Established</div>
        <div className="flex items-center gap-2"><Fingerprint size={10}/> डीएनए Verified (Fahim_0x)</div>
      </div>
    </div>
  );
}
