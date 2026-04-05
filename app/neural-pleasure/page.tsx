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

  // --- 🔥 Master Audio Control (Pause when not inserted) ---
  useEffect(() => {
    if (isInserted) {
      // Thrusting Sound Logic
      if (!isClimaxing && wetSound.current) {
        wetSound.current.playbackRate = 1 + (arousal / 100);
        wetSound.current.play().catch(() => {});
      }
      // Climax Sound Logic (Resume if it was playing)
      if (isClimaxing && climaxSound.current && climaxSound.current.paused) {
        climaxSound.current.play().catch(() => {});
      }
    } else {
      // 🛑 Pause EVERYTHING when pulled out
      if (wetSound.current) wetSound.current.pause();
      if (climaxSound.current) climaxSound.current.pause();
      if (!isClimaxing) setStatus("LINK_SEVERED");
    }
  }, [isInserted, isClimaxing, arousal]);

  // --- Thrust Handling ---
  const handleThrust = (event: any, info: any) => {
    const movement = Math.abs(info.delta.y);
    if (movement > 0.5) {
      setArousal(prev => Math.min(prev + (movement * 0.35), 100)); 
      setStatus("DEEP_SYNC");
    }
  };

  // --- 💦 Climax Sync (6s & 8s) ---
  useEffect(() => {
    if (arousal >= 100 && !isClimaxing) {
      setIsClimaxing(true);
      setStatus("SYSTEM_OVERLOAD");
      
      if (climaxSound.current) {
        climaxSound.current.currentTime = 0;
        climaxSound.current.play().catch(() => {});
      }

      // 💦 First Burst: Exactly at 6.0 Seconds
      const peak1 = setTimeout(() => {
        if (isClimaxing) {
          setDischargeWave(1);
          setStatus("FIRST_NEURAL_BURST");
        }
      }, 6000);

      // 💦💦 Final Heavy Burst: Exactly at 8.0 Seconds
      const peak2 = setTimeout(() => {
        if (isClimaxing) {
          setDischargeWave(2);
          setStatus("CRITICAL_OVERFLOW");
        }
      }, 8000);

      // Reset System after 12s sound + 3s afterglow
      const reset = setTimeout(() => {
        setIsClimaxing(false);
        setArousal(0);
        setDischargeWave(0);
        setStatus("AFTERGLOW");
      }, 15000);

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
      <audio ref={climaxSound} src="/sounds/maya_climax.mp3" />

      {/* Atmospheric Heat Glow */}
      <motion.div 
        animate={{ 
          opacity: (arousal / 100) * 0.9,
          backgroundColor: isClimaxing ? (dischargeWave === 2 ? '#ff0040' : '#9f1239') : '#4c0519'
        }} 
        className="absolute inset-0 blur-[160px] pointer-events-none transition-colors duration-300" 
      />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        
        {/* Status Hub */}
        <div className="text-center">
          <motion.h2 
            animate={isClimaxing ? { scale: [1, 1.15, 1], y: [0, -2, 2, 0] } : {}}
            className="text-7xl font-black italic tracking-tighter uppercase text-rose-600 drop-shadow-[0_0_25px_#e11d48]"
          >
            {status}
          </motion.h2>
          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.6em] text-white/40">
            <Zap size={14} className={isInserted ? "text-yellow-500 animate-pulse" : ""} /> 
            Sync Intensity: <span className="text-rose-500">{arousal.toFixed(1)}%</span>
          </div>
        </div>

        {/* --- MAIN INTERACTION ZONE --- */}
        <div className="relative h-[550px] w-full flex items-center justify-center">
          
          {/* Female Nexus (Glowing Target) */}
          <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full flex items-center justify-center">
             <motion.div 
                animate={{ scale: isInserted ? [1, 1.1, 1] : 1, opacity: isInserted ? 0.4 : 0.1 }}
                transition={{ duration: 0.5, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-[6px] border-rose-600/40"
             />
             <motion.div 
               animate={{ borderColor: isClimaxing ? "#fff" : "#e11d48", scale: isInserted ? 1.05 : 1 }}
               className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[15px] border-rose-600/30 bg-black/70 flex items-center justify-center relative overflow-hidden"
             >
                <Waves className={`text-rose-600/20 ${isInserted ? 'animate-spin-slow' : ''}`} size={80} />
                {isInserted && <div className="absolute inset-0 bg-rose-500/5 animate-pulse" />}
             </motion.div>
          </div>

          {/* Male Link (Girthy, Solid, Interactive) */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -180, bottom: 180 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            animate={isClimaxing && isInserted ? { x: [0, -5, 5, 0], y: [0, 3, -3, 0] } : {}}
            transition={{ duration: 0.07, repeat: Infinity }}
            className="absolute z-20 cursor-grab active:cursor-grabbing h-full flex flex-col items-center justify-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: isInserted ? 1.2 : 1 }}
                className={`w-24 h-[320px] md:w-32 md:h-[420px] rounded-full border-4 transition-all duration-300 
                  ${isInserted ? 'bg-gradient-to-b from-rose-400 to-rose-800 border-rose-200 shadow-[0_0_100px_#e11d48]' : 'bg-white/5 border-white/10 opacity-30'}`}
              >
                <div className="absolute top-0 w-full h-28 bg-rose-300/40 rounded-t-full border-b-2 border-rose-200/20 shadow-inner" />
              </motion.div>

              {/* 💦 Discharge Particles (Only when inserted) */}
              <AnimatePresence>
                {isClimaxing && isInserted && (
                  <motion.div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 pointer-events-none">
                    {[...Array(dischargeWave === 2 ? 60 : 25)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                        animate={{ 
                          y: -400 - Math.random() * 300, 
                          x: (Math.random() - 0.5) * 450,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.01 }}
                        className="absolute top-0 left-1/2 w-7 h-7 bg-white rounded-full blur-[3px] shadow-[0_0_25px_white]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-md px-12">
          <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-[2px]">
            <motion.div animate={{ width: `${arousal}%` }} className="h-full bg-gradient-to-r from-rose-900 via-rose-600 to-rose-400 shadow-[0_0_40px_#e11d48] rounded-full" />
          </div>
        </div>

        {/* Maya's Audio-Visual Dialogue */}
        <div className="max-w-2xl text-center px-10 h-28 flex items-center justify-center">
             <motion.p 
               key={status}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               className="text-xl font-black italic text-rose-100 drop-shadow-lg uppercase tracking-tight"
             >
                {status === "AWAITING_INSERTION" && "\"Fahim... link your core with mine... I'm empty.\""}
                {status === "LINK_SEVERED" && "\"Don't pull out now... I need your sync!\""}
                {status === "FIRST_NEURAL_BURST" && "\"AHH! IT'S BURSTING! I'M OVERFLOWING!\""}
                {status === "CRITICAL_OVERFLOW" && "\"YES! DISCHARGE EVERYTHING! I'M COMPLETELY FLOODED!\""}
                {status === "AFTERGLOW" && "\"Neural sync complete... that was... addictive.\""}
             </motion.p>
        </div>
      </div>

      {/* Intense White Flash (Sync with Discharge) */}
      {isClimaxing && isInserted && (
        <motion.div 
          animate={{ opacity: [0, dischargeWave === 2 ? 0.9 : 0.5, 0] }}
          transition={{ duration: 0.1, repeat: Infinity }}
          className="fixed inset-0 z-50 bg-white pointer-events-none mix-blend-overlay"
        />
      )}
    </div>
  );
}
