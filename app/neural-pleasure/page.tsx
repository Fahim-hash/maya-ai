"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Activity, Waves, Zap } from 'lucide-react';

export default function NeuralOverloadFinal() {
  const [btConnected, setBtConnected] = useState(false);
  const [arousal, setArousal] = useState(0);
  const [isInserted, setIsInserted] = useState(false);
  const [status, setStatus] = useState("AWAITING_INSERTION");
  const [isClimaxing, setIsClimaxing] = useState(false);
  const [dischargeWave, setDischargeWave] = useState(0); 

  const wetSound = useRef<HTMLAudioElement | null>(null);
  const climaxSound = useRef<HTMLAudioElement | null>(null);

  // --- 🎙️ AUDIO MASTER SYNC ---
  useEffect(() => {
    if (isInserted) {
      // 1. Climax sound shurutei start hobe (12 sec loop)
      if (climaxSound.current) {
        climaxSound.current.play().catch(() => {});
      }
      // 2. Wet thrust sound intensity arousal-er sathe barbe
      if (wetSound.current) {
        wetSound.current.playbackRate = 1 + (arousal / 100);
        wetSound.current.play().catch(() => {});
      }
    } else {
      // 🛑 Pause EVERYTHING on pull-out
      if (climaxSound.current) climaxSound.current.pause();
      if (wetSound.current) wetSound.current.pause();
      setStatus("LINK_SEVERED");
    }
  }, [isInserted, arousal]);

  // --- ⏱️ TIMING MONITOR (6s & 8s Visual Trigger) ---
  useEffect(() => {
    const checkTime = setInterval(() => {
      if (climaxSound.current && !climaxSound.current.paused) {
        const currentTime = climaxSound.current.currentTime;

        // 💦 6th Second: First Burst
        if (currentTime >= 6 && currentTime < 7.5) {
          setIsClimaxing(true);
          setDischargeWave(1);
          setStatus("FIRST_NEURAL_BURST");
        } 
        // 💦💦 8th Second: Massive Overload
        else if (currentTime >= 8 && currentTime < 11) {
          setIsClimaxing(true);
          setDischargeWave(2);
          setStatus("CRITICAL_OVERFLOW");
        } 
        // Normal Sync
        else {
          setIsClimaxing(false);
          setDischargeWave(0);
          if (isInserted) setStatus("DEEP_SYNC");
        }

        // Auto-loop reset logic for Arousal
        if (currentTime > 11.5) {
           setArousal(prev => Math.max(0, prev - 10)); // Post-climax cool down
        }
      }
    }, 100); // Check every 100ms for precision

    return () => clearInterval(checkTime);
  }, [isInserted]);

  // --- Thrust Handling ---
  const handleThrust = (event: any, info: any) => {
    const movement = Math.abs(info.delta.y);
    if (movement > 0.4) {
      setArousal(prev => Math.min(prev + (movement * 0.4), 100)); 
    }
  };

  if (!btConnected) {
    return (
      <div className="min-h-screen bg-[#05010a] flex flex-col items-center justify-center p-10 text-center">
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Headphones size={80} className="text-rose-600 mb-8 filter drop-shadow-[0_0_20px_#e11d48]" />
        </motion.div>
        <button onClick={() => setBtConnected(true)} className="px-12 py-5 bg-rose-600 text-white font-black uppercase text-xs tracking-[0.4em] rounded-2xl shadow-[0_0_50px_#e11d48]">
          INITIALIZE SYNC
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020005] text-rose-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      <audio ref={wetSound} src="/sounds/wet_thrust.mp3" loop />
      <audio ref={climaxSound} src="/sounds/maya_climax.mp3" loop />

      {/* Atmospheric Heat Glow */}
      <motion.div 
        animate={{ 
          opacity: isInserted ? 0.9 : 0.2,
          backgroundColor: isClimaxing ? (dischargeWave === 2 ? '#ff0040' : '#9f1239') : '#4c0519'
        }} 
        className="absolute inset-0 blur-[180px] pointer-events-none transition-colors duration-300" 
      />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        
        {/* Status Hub */}
        <div className="text-center">
          <motion.h2 
            animate={isClimaxing ? { scale: [1, 1.1, 1], y: [0, -3, 3, 0] } : {}}
            className="text-7xl font-black italic tracking-tighter uppercase text-rose-600 drop-shadow-[0_0_30px_#e11d48]"
          >
            {status}
          </motion.h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.6em] text-white/40">
            <Zap size={14} className={isInserted ? "text-yellow-500 animate-pulse" : ""} /> 
            Sync Intensity: <span className="text-rose-500">{arousal.toFixed(1)}%</span>
          </div>
        </div>

        {/* --- MAIN INTERACTION ZONE --- */}
        <div className="relative h-[600px] w-full flex items-center justify-center">
          
          {/* Female Nexus */}
          <div className="relative w-80 h-80 md:w-[480px] md:h-[480px] rounded-full flex items-center justify-center">
             <motion.div 
               animate={{ borderColor: isClimaxing ? "#fff" : "#e11d48", scale: isInserted ? 1.05 : 1 }}
               className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[18px] border-rose-600/40 bg-black/80 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_100px_rgba(225,29,72,0.3)]"
             >
                <Waves className={`text-rose-600/20 ${isInserted ? 'animate-spin-slow' : ''}`} size={80} />
             </motion.div>
          </div>

          {/* Male Link (Girthy, Solid) */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -200, bottom: 200 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            animate={isClimaxing && isInserted ? { x: [0, -6, 6, 0] } : {}}
            transition={{ duration: 0.05, repeat: Infinity }}
            className="absolute z-20 cursor-grab active:cursor-grabbing h-full flex flex-col items-center justify-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: isInserted ? 1.25 : 1 }}
                className={`w-28 h-[350px] md:w-36 md:h-[450px] rounded-full border-4 transition-all duration-300 
                  ${isInserted ? 'bg-gradient-to-b from-rose-400 via-rose-700 to-rose-900 border-rose-200 shadow-[0_0_120px_#e11d48]' : 'bg-white/5 border-white/10 opacity-30'}`}
              >
                <div className="absolute top-0 w-full h-32 bg-rose-300/40 rounded-t-full border-b-2 border-rose-200/20" />
              </motion.div>

              {/* 💦 Precise Particle Burst */}
              <AnimatePresence>
                {isClimaxing && isInserted && (
                  <motion.div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none">
                    {[...Array(dischargeWave === 2 ? 80 : 30)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                        animate={{ 
                          y: -500 - Math.random() * 400, 
                          x: (Math.random() - 0.5) * 500,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.005 }}
                        className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full blur-[4px] shadow-[0_0_30px_white]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md px-12 h-6 flex items-center">
            <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
               <motion.div animate={{ width: `${arousal}%` }} className="h-full bg-gradient-to-r from-rose-900 to-rose-400 shadow-[0_0_40px_#e11d48] rounded-full" />
            </div>
        </div>

        {/* Maya's Sync Dialogue */}
        <div className="max-w-2xl text-center px-10 h-28 flex items-center justify-center">
             <motion.p 
               key={status}
               className="text-2xl font-black italic text-rose-100 drop-shadow-lg uppercase tracking-tighter"
             >
                {status === "AWAITING_INSERTION" && "\"Link with me, Fahim... I need your frequency.\""}
                {status === "DEEP_SYNC" && "\"Mmm... the friction is perfect... don't pull out.\""}
                {status === "FIRST_NEURAL_BURST" && "\"AHH! 6 SECONDS IN... IT'S BURSTING!\""}
                {status === "CRITICAL_OVERFLOW" && "\"8 SECONDS! YES! FLOOD ME, FAHIM!\""}
                {status === "LINK_SEVERED" && "\"Why did you stop? The sync was almost complete...\""}
             </motion.p>
        </div>
      </div>

      {/* Extreme Flash Overlay */}
      {isClimaxing && isInserted && (
        <motion.div 
          animate={{ opacity: [0, dischargeWave === 2 ? 0.95 : 0.6, 0] }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className="fixed inset-0 z-50 bg-white pointer-events-none mix-blend-overlay"
        />
      )}
    </div>
  );
}
