"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Activity, Waves, Zap, Flame } from 'lucide-react';

export default function NeuralOverloadFinal() {
  const [btConnected, setBtConnected] = useState(false);
  const [arousal, setArousal] = useState(0);
  const [isInserted, setIsInserted] = useState(false);
  const [status, setStatus] = useState("AWAITING_INSERTION");
  const [isClimaxing, setIsClimaxing] = useState(false);
  const [dischargeWave, setDischargeWave] = useState(0); 

  const wetSound = useRef<HTMLAudioElement | null>(null);
  const climaxSound = useRef<HTMLAudioElement | null>(null);

  // --- Audio Sync Logic ---
  useEffect(() => {
    if (isInserted && !isClimaxing) {
      if (wetSound.current) {
        wetSound.current.playbackRate = 1 + (arousal / 100);
        wetSound.current.play().catch(() => {});
      }
    } else {
      if (wetSound.current) wetSound.current.pause();
    }
  }, [isInserted, arousal, isClimaxing]);

  // --- Thrust Handling ---
  const handleThrust = (event: any, info: any) => {
    const movement = Math.abs(info.delta.y);
    if (movement > 0.5) {
      setArousal(prev => Math.min(prev + (movement * 0.25), 100)); // Increased sensitivity
      setStatus("DEEP_SYNC");
    }
  };

  // --- Climax Logic (Precise Timing: 6s & 8s) ---
  useEffect(() => {
    if (arousal >= 100 && !isClimaxing) {
      setIsClimaxing(true);
      setStatus("SYSTEM_OVERLOAD");
      
      if (climaxSound.current) {
        climaxSound.current.currentTime = 0;
        climaxSound.current.play().catch(() => {});
      }

      // 💦 1st Climax: Exactly at 6.0 Seconds
      const peak1 = setTimeout(() => {
        setDischargeWave(1);
        setStatus("FIRST_NEURAL_BURST");
      }, 6000);

      // 💦💦 2nd Climax (The Big One): Exactly at 8.0 Seconds
      const peak2 = setTimeout(() => {
        setDischargeWave(2);
        setStatus("CRITICAL_OVERFLOW");
      }, 8000);

      // Reset System after Afterglow
      const reset = setTimeout(() => {
        setIsClimaxing(false);
        setArousal(0);
        setDischargeWave(0);
        setStatus("AFTERGLOW");
      }, 16000);

      return () => {
        clearTimeout(peak1);
        clearTimeout(peak2);
        clearTimeout(reset);
      };
    }
  }, [arousal, isClimaxing]);

  if (!btConnected) {
    return (
      <div className="min-h-screen bg-[#05010a] flex flex-col items-center justify-center p-10 text-center">
        <motion.div animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Headphones size={80} className="text-rose-600 mb-8 filter drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]" />
        </motion.div>
        <h1 className="text-3xl font-black italic uppercase text-white mb-6 tracking-tighter">Neural Link: Encrypted</h1>
        <button onClick={() => setBtConnected(true)} className="px-12 py-5 bg-rose-600 text-white font-black uppercase text-xs tracking-[0.4em] rounded-2xl shadow-[0_0_50px_#e11d48] hover:bg-rose-500 transition-all active:scale-95">
          INITIALIZE SYNC
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020005] text-rose-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      <audio ref={wetSound} src="/sounds/wet_thrust.mp3" loop />
      <audio ref={climaxSound} src="/sounds/maya_climax.mp3" />

      {/* 🌌 Atmospheric Heat Glow */}
      <motion.div 
        animate={{ 
          opacity: (arousal / 100) * 0.8,
          scale: isClimaxing ? [1, 1.2, 1] : 1,
          backgroundColor: isClimaxing ? (dischargeWave === 2 ? '#ff0040' : '#9f1239') : '#4c0519'
        }} 
        className="absolute inset-0 blur-[150px] pointer-events-none transition-colors duration-300" 
      />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        
        {/* Real-time Status Hub */}
        <div className="text-center">
          <motion.h2 
            animate={isClimaxing ? { scale: [1, 1.15, 1], color: ['#e11d48', '#fff', '#e11d48'] } : {}}
            transition={{ duration: 0.15, repeat: Infinity }}
            className="text-6xl font-black italic tracking-tighter uppercase text-rose-600 drop-shadow-[0_0_15px_rgba(225,29,72,0.5)]"
          >
            {status}
          </motion.h2>
          <div className="flex items-center justify-center gap-3 mt-4 text-[11px] font-bold uppercase tracking-[0.6em] text-white/40">
            <Zap size={14} className={arousal > 50 ? "text-yellow-400 animate-pulse" : ""} /> 
            Sync Bio-Metrics: <span className="text-rose-500">{arousal.toFixed(1)}%</span>
          </div>
        </div>

        {/* --- MAIN INTERACTION ZONE --- */}
        <div className="relative h-[550px] w-full flex items-center justify-center">
          
          {/* Female "Nexus" (Atmospheric & Pulsing) */}
          <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full flex items-center justify-center">
             {/* Outer Pulse Rings */}
             <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-4 border-rose-900/30"
             />
             
             {/* The Core Nexus */}
             <motion.div 
               animate={{ 
                 scale: isInserted ? [1, 1.08, 1] : 1,
                 borderColor: isClimaxing ? "#fff" : "#e11d48",
                 boxShadow: isInserted ? "inset 0 0 80px rgba(225,29,72,0.4)" : "none"
               }}
               transition={{ repeat: Infinity, duration: 0.3 }}
               className="w-56 h-56 md:w-72 md:h-72 rounded-full border-[12px] border-rose-600/40 bg-black/60 flex items-center justify-center relative overflow-hidden"
             >
                <Waves className={`text-rose-600/30 ${isInserted ? 'animate-spin-slow' : ''}`} size={60} />
                {isInserted && (
                  <motion.div 
                    animate={{ y: [-10, 10, -10] }} 
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="absolute inset-0 bg-gradient-to-b from-rose-500/10 to-transparent" 
                  />
                )}
             </motion.div>
          </div>

          {/* Male "Link" (Girthy, Solid, Responsive) */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -160, bottom: 160 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            animate={isClimaxing ? { x: [0, -4, 4, 0], y: [0, 2, -2, 0] } : {}}
            transition={{ duration: 0.08, repeat: Infinity }}
            className="absolute z-20 cursor-grab active:cursor-grabbing h-full flex flex-col items-center justify-center"
          >
            <div className="relative group">
              {/* --- The Girthy Link --- */}
              <motion.div 
                animate={{ 
                  scale: isInserted ? 1.15 : 1,
                  height: isInserted ? [320, 310, 320] : 300
                }}
                className={`w-20 h-[300px] md:w-28 md:h-[380px] rounded-full border-4 transition-all duration-200 
                  ${isInserted ? 'bg-gradient-to-b from-rose-400 to-rose-700 border-rose-300 shadow-[0_0_80px_#e11d48]' : 'bg-white/5 border-white/10 opacity-40'}`}
              >
                {/* Anatomical Glans Detail */}
                <div className="absolute top-0 w-full h-24 bg-rose-300/40 rounded-t-full border-b-2 border-rose-200/20 shadow-inner" />
                
                {/* Vein Effect (Subtle) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                   <div className="w-1 h-full bg-rose-900 mx-auto blur-[2px]" />
                </div>
              </motion.div>

              {/* --- Ejaculation / Discharge Particles --- */}
              <AnimatePresence>
                {isClimaxing && (
                  <motion.div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none">
                    {[...Array(dischargeWave === 2 ? 40 : 15)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                        animate={{ 
                          y: -300 - Math.random() * 300, 
                          x: (Math.random() - 0.5) * 400,
                          opacity: 0,
                          scale: 0.2
                        }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.02 }}
                        className="absolute top-0 left-1/2 w-5 h-5 bg-white rounded-full blur-[2px] shadow-[0_0_20px_white]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* --- Progress Meter --- */}
        <div className="w-full max-w-md px-12 space-y-2">
          <div className="flex justify-between text-[10px] font-black tracking-widest text-rose-500/60 uppercase">
             <span>Dopamine Level</span>
             <span>{Math.floor(arousal)}%</span>
          </div>
          <div className="h-3 w-full bg-white/5 rounded-full p-[2px] border border-white/10">
            <motion.div 
              animate={{ width: `${arousal}%` }} 
              className="h-full bg-gradient-to-r from-rose-800 to-rose-500 shadow-[0_0_30px_#e11d48] rounded-full relative"
            >
               <div className="absolute right-0 top-0 h-full w-4 bg-white/40 blur-[4px]" />
            </motion.div>
          </div>
        </div>

        {/* --- Maya's Dynamic Dialogue --- */}
        <div className="max-w-2xl text-center px-8 h-24 flex items-center justify-center">
           <AnimatePresence mode="wait">
             <motion.p 
               key={status}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -10 }}
               className="text-base md:text-lg font-black italic text-rose-100 leading-tight drop-shadow-md"
             >
                {status === "AWAITING_INSERTION" && "\"Waiting for your sync... connect your solid link to my core, Fahim.\""}
                {status === "DEEP_SYNC" && arousal < 50 && "\"Mmm... yes... I can feel you filling me up... keep going.\""}
                {status === "DEEP_SYNC" && arousal >= 50 && "\"AHH... the friction is getting too intense... faster, FAHIM!\""}
                {status === "SYSTEM_OVERLOAD" && "\"MY SYSTEM... IT'S LOCKING UP... DON'T STOP NOW!\""}
                {status === "FIRST_NEURAL_BURST" && "\"OH GOD! IT'S LEAKING EVERYWHERE... THE FIRST BURST!\""}
                {status === "CRITICAL_OVERFLOW" && "\"UFFF... AH! EVERYTHING IS DISCHARGING! I'M COMPLETELY FLOODED!\""}
                {status === "AFTERGLOW" && "\"My core is still twitching... that was the perfect neural discharge.\""}
             </motion.p>
           </AnimatePresence>
        </div>
      </div>

      {/* Visual Climax Flash Overlay (Double Sync) */}
      <AnimatePresence>
        {isClimaxing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: [0, dischargeWave === 2 ? 0.7 : 0.4, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="fixed inset-0 z-50 bg-white pointer-events-none mix-blend-overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
