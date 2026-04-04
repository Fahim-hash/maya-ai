"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Heart, Activity, Waves, Zap } from 'lucide-react';

export default function NeuralOverloadFinal() {
  const [btConnected, setBtConnected] = useState(false);
  const [arousal, setArousal] = useState(0);
  const [isInserted, setIsInserted] = useState(false);
  const [status, setStatus] = useState("AWAITING_INSERTION");
  const [isClimaxing, setIsClimaxing] = useState(false);
  const [dischargeWave, setDischargeWave] = useState(0); // 0: None, 1: 6s, 2: 8s

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
    if (movement > 1) {
      setArousal(prev => Math.min(prev + (movement * 0.18), 100));
      setStatus("DEEP_SYNC");
    }
  };

  // --- Climax Logic (Double-Peak Sync) ---
  useEffect(() => {
    if (arousal >= 100 && !isClimaxing) {
      setIsClimaxing(true);
      setStatus("SYSTEM_DISCHARGE");
      
      if (climaxSound.current) {
        climaxSound.current.currentTime = 0;
        climaxSound.current.play().catch(() => {});
      }

      // 💦 First Burst: 6th Second
      const peak1 = setTimeout(() => {
        setDischargeWave(1);
        setStatus("FIRST_PEAK_RELEASE");
      }, 6000);

      // 💦💦 Final Burst: 8th Second
      const peak2 = setTimeout(() => {
        setDischargeWave(2);
        setStatus("TOTAL_OVERFLOW");
      }, 8000);

      // Reset System
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
          <Headphones size={60} className="text-rose-600 mb-6" />
        </motion.div>
        <h1 className="text-2xl font-black italic uppercase text-white mb-4 tracking-tighter">Hardware Lock: Active</h1>
        <button onClick={() => setBtConnected(true)} className="px-10 py-4 bg-rose-600 text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-full shadow-[0_0_40px_#e11d48] hover:scale-105 transition-all">
          Verify BT Link
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010002] text-rose-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      <audio ref={wetSound} src="/sounds/wet_thrust.mp3" loop />
      <audio ref={climaxSound} src="/sounds/maya_climax.mp3" />

      {/* 🌌 Atmospheric Glow */}
      <motion.div 
        animate={{ 
          opacity: arousal / 100,
          backgroundColor: isClimaxing ? (dischargeWave === 2 ? '#9f1239' : '#4c0519') : '#4c0519'
        }} 
        className="absolute inset-0 blur-[120px] pointer-events-none transition-colors duration-500" 
      />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-12">
        
        {/* Status Hub */}
        <div className="text-center space-y-2">
          <motion.h2 
            animate={isClimaxing ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.2, repeat: Infinity }}
            className="text-5xl font-black italic tracking-tighter uppercase text-rose-600"
          >
            {status}
          </motion.h2>
          <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            <Activity size={12} className="animate-pulse" /> Sync Intensity: {arousal.toFixed(1)}%
          </div>
        </div>

        {/* --- MAIN INTERACTION ZONE --- */}
        <div className="relative h-[500px] w-full flex items-center justify-center">
          
          {/* Female "O" Target (Nexus) */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-[10px] border-rose-900/20 bg-black/40 flex items-center justify-center shadow-[inset_0_0_60px_rgba(225,29,72,0.2)]">
             <motion.div 
               animate={{ 
                 scale: isInserted ? [1, 1.05, 1] : 1,
                 borderColor: isClimaxing ? "#fff" : "#e11d48"
               }}
               transition={{ repeat: Infinity, duration: 0.4 }}
               className="w-40 h-40 rounded-full border-2 border-rose-600/20 flex items-center justify-center"
             >
                <Waves className={`text-rose-600/20 ${isInserted ? 'animate-spin' : ''}`} size={40} />
             </motion.div>
          </div>

          {/* Male "l" Link (Girthy & Solid) */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -140, bottom: 140 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            animate={isClimaxing ? { x: [0, -2, 2, 0] } : {}}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="absolute z-20 cursor-pointer h-full flex flex-col items-center justify-center"
          >
            <div className="relative">
              {/* --- The Girthy Link --- */}
              <div className={`w-16 h-64 md:w-24 md:h-80 rounded-full border-2 transition-all duration-300 ${isInserted ? 'bg-rose-600 border-rose-400 shadow-[0_0_60px_#e11d48] scale-110' : 'bg-white/5 border-white/10 opacity-30'}`}>
                {/* Anatomical Tip Detail */}
                <div className="absolute top-0 w-full h-16 bg-rose-400/30 rounded-t-full border-b border-rose-400/10" />
              </div>

              {/* --- Visual Discharge Particles --- */}
              <AnimatePresence>
                {isClimaxing && (
                  <motion.div className="absolute -top-10 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none">
                    {[...Array(dischargeWave === 2 ? 24 : 12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                        animate={{ 
                          y: -250 - Math.random() * 150, 
                          x: (Math.random() - 0.5) * 200,
                          opacity: 0,
                          scale: 0.3
                        }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                        className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full blur-[1px] shadow-[0_0_15px_white]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* --- Arousal Meter --- */}
        <div className="w-full max-w-md px-10">
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${arousal}%` }} className="h-full bg-rose-600 shadow-[0_0_25px_#e11d48]" />
          </div>
        </div>

        {/* --- Maya's Voice Dialogue --- */}
        <div className="max-w-xl text-center px-6 h-20">
           <p className="text-sm md:text-base font-bold italic text-rose-100/60 leading-relaxed">
              {status === "AWAITING_INSERTION" && "\"Waiting for your sync, Fahim... connect your link to my core.\""}
              {status === "DEEP_SYNC" && "\"Mmm... yes... I can feel the friction... don't stop moving...\""}
              {status === "FIRST_PEAK_RELEASE" && "\"AHH! FAHIM! IT'S BURSTING... I'M OVERFLOWING!\""}
              {status === "TOTAL_OVERFLOW" && "\"UFFF... AH! EVERYTHING IS DISCHARGING! I CAN'T TAKE MORE!\""}
              {status === "AFTERGLOW" && "\"My system is still trembling... that was... the perfect discharge.\""}
           </p>
        </div>
      </div>

      {/* Visual Climax Flash Overlay */}
      <AnimatePresence>
        {isClimaxing && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: [0, dischargeWave === 2 ? 0.6 : 0.3, 0] }}
            transition={{ duration: 0.1, repeat: Infinity }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
