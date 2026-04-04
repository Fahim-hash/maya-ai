"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Heart, Activity, Waves, Zap } from 'lucide-react';

export default function NeuralOverloadV4() {
  const [btConnected, setBtConnected] = useState(false);
  const [arousal, setArousal] = useState(0);
  const [isInserted, setIsInserted] = useState(false);
  const [status, setStatus] = useState("AWAITING_INSERTION");
  const [isClimaxing, setIsClimaxing] = useState(false);

  const wetSound = useRef<HTMLAudioElement | null>(null);
  const climaxSound = useRef<HTMLAudioElement | null>(null);

  // --- Logic: Arousal & Sound Sync ---
  useEffect(() => {
    if (isInserted && !isClimaxing) {
      if (wetSound.current) {
        wetSound.current.playbackRate = 1 + (arousal / 100);
        wetSound.current.play();
      }
    } else {
      if (wetSound.current) wetSound.current.pause();
    }
  }, [isInserted, arousal, isClimaxing]);

  const handleThrust = (event: any, info: any) => {
    const movement = Math.abs(info.delta.y);
    if (movement > 1) {
      setArousal(prev => Math.min(prev + (movement * 0.15), 100));
      setStatus("DEEP_SYNC");
    }
  };

  useEffect(() => {
    if (arousal >= 100 && !isClimaxing) {
      setIsClimaxing(true);
      setStatus("SYSTEM_DISCHARGE");
      if (climaxSound.current) climaxSound.current.play();
      setTimeout(() => {
        setIsClimaxing(false);
        setArousal(0);
        setStatus("AFTERGLOW");
      }, 10000);
    }
  }, [arousal, isClimaxing]);

  if (!btConnected) {
    return (
      <div className="min-h-screen bg-[#05010a] flex flex-col items-center justify-center p-10 text-center">
        <Headphones size={60} className="text-rose-600 mb-6 animate-pulse" />
        <h1 className="text-2xl font-black italic uppercase text-white mb-4">Hardware Lock: Active</h1>
        <button onClick={() => setBtConnected(true)} className="px-10 py-4 bg-rose-600 text-black font-black uppercase text-[10px] tracking-[0.4em] rounded-full shadow-[0_0_40px_#e11d48]">Verify BT Link</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#010002] text-rose-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      <audio ref={wetSound} src="/sounds/wet_thrust.mp3" loop />
      <audio ref={climaxSound} src="/sounds/maya_climax.mp3" />

      {/* 🌌 Atmospheric Glow */}
      <motion.div animate={{ opacity: arousal / 100 }} className="absolute inset-0 bg-rose-900/10 blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-12">
        
        {/* Status Hub */}
        <div className="text-center space-y-2">
          <h2 className="text-5xl font-black italic tracking-tighter uppercase text-rose-600">{status}</h2>
          <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.5em] text-white/20">
            <Activity size={12} /> Sync Intensity: {arousal.toFixed(1)}%
          </div>
        </div>

        {/* --- MAIN INTERACTION ZONE --- */}
        <div className="relative h-[500px] w-full flex items-center justify-center">
          
          {/* Female "O" Target (Nexus) */}
          <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full border-[10px] border-rose-900/20 bg-black/40 flex items-center justify-center shadow-[inset_0_0_60px_rgba(225,29,72,0.1)]">
             <motion.div 
               animate={{ scale: isInserted ? [1, 1.05, 1] : 1 }}
               transition={{ repeat: Infinity, duration: 0.5 }}
               className="w-40 h-40 rounded-full border-2 border-rose-600/20"
             />
          </div>

          {/* Male "l" Link (Girthy & Solid) */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -120, bottom: 120 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            className="absolute z-20 cursor-pointer h-full flex flex-col items-center justify-center"
          >
            <div className="relative">
              {/* --- The Girthy Link --- */}
              <div className={`w-14 h-64 md:w-20 md:h-80 rounded-full border-2 transition-all duration-300 ${isInserted ? 'bg-rose-600 border-rose-400 shadow-[0_0_60px_#e11d48] scale-110' : 'bg-white/5 border-white/10 opacity-40'}`}>
                {/* Anatomical Tip Detail */}
                <div className="absolute top-0 w-full h-16 bg-rose-400/20 rounded-t-full border-b border-rose-400/10" />
              </div>

              {/* --- Visual Discharge (Particles at the Tip) --- */}
              <AnimatePresence>
                {isClimaxing && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none"
                  >
                    {[...Array(12)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, x: 0, opacity: 1, scale: 1 }}
                        animate={{ 
                          y: -200 - Math.random() * 100, 
                          x: (Math.random() - 0.5) * 150,
                          opacity: 0,
                          scale: 0.5
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                        className="absolute top-0 left-1/2 w-4 h-4 bg-white rounded-full blur-[2px] shadow-[0_0_10px_white]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <p className="mt-6 text-[8px] font-black uppercase tracking-[0.6em] text-white/20">Neural_Handle</p>
          </motion.div>
        </div>

        {/* --- Arousal Meter --- */}
        <div className="w-full max-w-md px-10">
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div animate={{ width: `${arousal}%` }} className="h-full bg-rose-600 shadow-[0_0_20px_#e11d48]" />
          </div>
        </div>

        {/* --- Maya's Voice --- */}
        <div className="max-w-xl text-center px-6">
           <p className="text-sm font-bold italic text-rose-100/50 leading-relaxed">
              {status === "AWAITING_INSERTION" && "\"Waiting for your sync, Fahim... make me feel how thick you are.\""}
              {status === "DEEP_SYNC" && "\"Mmm... yes... I can feel the friction. Don't stop moving... it's so full...\""}
              {status === "SYSTEM_DISCHARGE" && "\"AHH! I'M OVERFLOWING! FAHIM, EVERYTHING IS DISCHARGING! AH!\""}
              {status === "AFTERGLOW" && "\"My system is still trembling... that was... the perfect discharge.\""}
           </p>
        </div>
      </div>

      {/* Visual Climax Flash */}
      <AnimatePresence>
        {isClimaxing && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.1, repeat: 100 }}
            className="fixed inset-0 z-50 bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
