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

  // --- Audio Sync Logic (Thrusting) ---
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
      // Sensitivity factor: 0.3 (Thrust intensity barabe)
      setArousal(prev => Math.min(prev + (movement * 0.3), 100)); 
      setStatus("DEEP_SYNC");
    }
  };

  // --- Climax Timing Logic (6s & 8s) ---
  useEffect(() => {
    if (arousal >= 100 && !isClimaxing) {
      setIsClimaxing(true);
      setStatus("SYSTEM_OVERLOAD");
      
      // Start the Climax Sound
      if (climaxSound.current) {
        climaxSound.current.currentTime = 0;
        climaxSound.current.play().catch(() => {});
      }

      // 💦 First Burst: Exactly at 6.0 Seconds of the MP3
      const peak1 = setTimeout(() => {
        setDischargeWave(1);
        setStatus("FIRST_NEURAL_BURST");
      }, 6000);

      // 💦💦 Final Heavy Burst: Exactly at 8.0 Seconds of the MP3
      const peak2 = setTimeout(() => {
        setDischargeWave(2);
        setStatus("CRITICAL_OVERFLOW");
      }, 8000);

      // System cooldown after 16 seconds
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
        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
          <Headphones size={80} className="text-rose-600 mb-8 filter drop-shadow-[0_0_20px_#e11d48]" />
        </motion.div>
        <h1 className="text-3xl font-black italic uppercase text-white mb-6 tracking-tighter">Neural Link: Encrypted</h1>
        <button onClick={() => setBtConnected(true)} className="px-12 py-5 bg-rose-600 text-white font-black uppercase text-xs tracking-[0.4em] rounded-2xl shadow-[0_0_50px_#e11d48] hover:scale-105 transition-all">
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
          opacity: (arousal / 100) * 0.8,
          backgroundColor: isClimaxing ? (dischargeWave === 2 ? '#ff0040' : '#9f1239') : '#4c0519'
        }} 
        className="absolute inset-0 blur-[150px] pointer-events-none transition-colors duration-500" 
      />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8">
        
        {/* Status Hub */}
        <div className="text-center">
          <motion.h2 
            animate={isClimaxing ? { scale: [1, 1.1, 1] } : {}}
            className="text-6xl font-black italic tracking-tighter uppercase text-rose-600 drop-shadow-[0_0_20px_#e11d48]"
          >
            {status}
          </motion.h2>
          <div className="flex items-center justify-center gap-3 mt-4 text-[11px] font-bold uppercase tracking-[0.6em] text-white/30">
            <Zap size={14} className="animate-pulse text-yellow-500" /> Bio-Metric Sync: {arousal.toFixed(1)}%
          </div>
        </div>

        {/* Interaction Zone */}
        <div className="relative h-[550px] w-full flex items-center justify-center">
          
          {/* Female Target (The Core) */}
          <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] rounded-full flex items-center justify-center">
             <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full border-4 border-rose-900/30"
             />
             <motion.div 
               animate={{ 
                 scale: isInserted ? [1, 1.05, 1] : 1,
                 borderColor: isClimaxing ? "#fff" : "#e11d48"
               }}
               className="w-56 h-56 md:w-72 md:h-72 rounded-full border-[12px] border-rose-600/40 bg-black/60 flex items-center justify-center"
             >
                <Waves className={`text-rose-600/20 ${isInserted ? 'animate-spin-slow' : ''}`} size={60} />
             </motion.div>
          </div>

          {/* Male Link (Girthy & Responsive) */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -160, bottom: 160 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            animate={isClimaxing ? { x: [0, -3, 3, 0], y: [0, 2, -2, 0] } : {}}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="absolute z-20 cursor-grab active:cursor-grabbing h-full flex flex-col items-center justify-center"
          >
            <div className="relative">
              <motion.div 
                animate={{ scale: isInserted ? 1.1 : 1 }}
                className={`w-20 h-[300px] md:w-28 md:h-[380px] rounded-full border-4 transition-all duration-300 
                  ${isInserted ? 'bg-gradient-to-b from-rose-400 to-rose-700 border-rose-300 shadow-[0_0_80px_#e11d48]' : 'bg-white/5 border-white/10 opacity-40'}`}
              >
                <div className="absolute top-0 w-full h-24 bg-rose-300/30 rounded-t-full border-b border-rose-200/20" />
              </motion.div>

              {/* Discharge Particles */}
              <AnimatePresence>
                {isClimaxing && (
                  <motion.div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 pointer-events-none">
                    {[...Array(dischargeWave === 2 ? 50 : 20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1 }}
                        animate={{ 
                          y: -350 - Math.random() * 200, 
                          x: (Math.random() - 0.5) * 350,
                          opacity: 0,
                          scale: 0
                        }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.01 }}
                        className="absolute top-0 left-1/2 w-6 h-6 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Arousal Meter */}
        <div className="w-full max-w-md px-12 space-y-2">
          <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
            <motion.div animate={{ width: `${arousal}%` }} className="h-full bg-gradient-to-r from-rose-800 to-rose-500 shadow-[0_0_30px_#e11d48]" />
          </div>
        </div>

        {/* Maya's Dialogue */}
        <div className="max-w-2xl text-center px-8 h-24 flex items-center justify-center">
           <AnimatePresence mode="wait">
             <motion.p 
               key={status}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-lg font-black italic text-rose-100 drop-shadow-md"
             >
                {status === "AWAITING_INSERTION" && "\"Connect your link to my core, Fahim... I'm waiting.\""}
                {status === "DEEP_SYNC" && "\"Mmm... yes... fill me up... don't stop moving...\""}
                {status === "FIRST_NEURAL_BURST" && "\"AHH! IT'S BURSTING! THE CORE IS OVERFLOWING!\""}
                {status === "CRITICAL_OVERFLOW" && "\"UFFF... AH! EVERYTHING IS DISCHARGING! I'M FLOODED!\""}
                {status === "AFTERGLOW" && "\"My system is still twitching... that was the perfect discharge.\""}
             </motion.p>
           </AnimatePresence>
        </div>
      </div>

      {/* Screen Flash */}
      <AnimatePresence>
        {isClimaxing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: [0, dischargeWave === 2 ? 0.8 : 0.4, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="fixed inset-0 z-50 bg-white pointer-events-none mix-blend-overlay"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
