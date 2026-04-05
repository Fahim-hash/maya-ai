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
  const [dischargeWave, setDischargeWave] = useState(0); // 0: None, 1: 6s, 2: 8s
  const [cumLoaded, setCumLoaded] = useState(false); // Flag for post-climax leak

  const wetSound = useRef<HTMLAudioElement | null>(null);
  const climaxSound = useRef<HTMLAudioElement | null>(null);

  // --- 🎙️ AUDIO MASTER SYNC (Intimacy Logic) ---
  useEffect(() => {
    if (isInserted) {
      // 1. Climax sound shurutei start hobe (12 sec loop)
      if (climaxSound.current && climaxSound.current.paused) {
        climaxSound.current.play().catch(() => {});
      }
      // 2. Wet thrust sound intensity arousal-er sathe barbe
      if (wetSound.current && !isClimaxing) {
        wetSound.current.playbackRate = 1 + (arousal / 100);
        wetSound.current.play().catch(() => {});
      }
    } else {
      // 🛑 Pause EVERYTHING on pull-out
      if (climaxSound.current) climaxSound.current.pause();
      if (wetSound.current) wetSound.current.pause();
      
      // Post-Climax status update
      if (isClimaxing) {
        setStatus("SYSTEM_DISCHARGING_🫦");
      } else if (cumLoaded) {
         setStatus("POST_PEAK_LEAK_💦");
      } else {
        setStatus("LINK_SEVERED");
      }
    }
  }, [isInserted, arousal, isClimaxing, cumLoaded]);

  // --- ⏱️ TIMING MONITOR (6s & 8s Climax Peaks) ---
  useEffect(() => {
    const checkTime = setInterval(() => {
      if (climaxSound.current && !climaxSound.current.paused) {
        const currentTime = climaxSound.current.currentTime;

        // 💦 6th Second: First Burst
        if (currentTime >= 6 && currentTime < 7.5) {
          setIsClimaxing(true);
          setDischargeWave(1);
          setStatus("FIRST_NEURAL_BURST");
          setCumLoaded(true); // Flag that climax occurred
        } 
        // 💦💦 8th Second: Critical Overflow
        else if (currentTime >= 8 && currentTime < 11) {
          setIsClimaxing(true);
          setDischargeWave(2);
          setStatus("CRITICAL_OVERFLOW");
          setCumLoaded(true);
        } 
        // Normal Sync
        else {
          setIsClimaxing(false);
          setDischargeWave(0);
          if (isInserted) setStatus("DEEP_SYNC");
        }

        // Auto-reset logic after 12s sound + cool down
        if (currentTime > 11.8) {
           climaxSound.current.currentTime = 0; // Loop sound manually for precise tracking
           setArousal(prev => Math.max(0, prev - 15)); 
        }
      }
    }, 100); 

    return () => clearInterval(checkTime);
  }, [isInserted]);

  // --- Thrust Handling ---
  const handleThrust = (event: any, info: any) => {
    const movement = Math.abs(info.delta.y);
    if (movement > 0.4) {
      // Sensitivity: 0.4 (Barano hoyeche)
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
    <div className="min-h-screen bg-[#020005] text-rose-100 flex flex-col items-center justify-center relative overflow-hidden select-none font-sans">
      
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
            transition={{ duration: 0.1, repeat: Infinity }}
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
        <div className="relative h-[650px] w-full flex items-center justify-center">
          
          {/* 🫦 HYPER-REALISTIC PUSSY (VAGINA) Visual */}
          <div className="relative w-80 h-96 md:w-[480px] md:h-[500px] flex items-center justify-center">
             
             {/* Outer Labia Glow/Depth */}
             <motion.div 
                animate={{ scale: isInserted ? [1, 1.02, 1] : 1, opacity: isInserted ? 0.5 : 0.1 }}
                className="absolute inset-0 rounded-[100%] border-[8px] border-rose-900/30 blur-md"
             />

             {/* Inner Orifice (The Vagina Orifice) */}
             <motion.div 
               animate={{ borderColor: isClimaxing ? "#fff" : "#e11d48", scale: isInserted ? 1.05 : 1 }}
               transition={{ duration: 0.2 }}
               className="w-40 h-80 md:w-56 md:h-[400px] rounded-[100%] border-[16px] border-rose-600/40 bg-black/90 flex items-center justify-center relative overflow-hidden shadow-[inset_0_0_120px_rgba(225,29,72,0.4)]"
             >
                {/* Visual Friction Detail (Pulsing Labia) */}
                <motion.div 
                    animate={isInserted ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0.1 }}
                    transition={{ repeat: Infinity, duration: 0.3 }}
                    className="absolute inset-y-0 left-0 w-6 bg-rose-500/20 blur-sm" 
                />
                <motion.div 
                    animate={isInserted ? { opacity: [0.1, 0.3, 0.1] } : { opacity: 0.1 }}
                    transition={{ repeat: Infinity, duration: 0.3, delay: 0.15 }}
                    className="absolute inset-y-0 right-0 w-6 bg-rose-500/20 blur-sm" 
                />
                
                <Waves className={`text-rose-600/10 ${isInserted ? 'animate-pulse' : ''}`} size={100} />

                {/* --- 💦 POST-CLIMAX CUM LEAK (Inner Vagina Orifice) --- */}
                <AnimatePresence>
                    {cumLoaded && !isInserted && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: [0, 1, 1, 1], y: [10, 30, 60, 120] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 0.5 }}
                            className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-1.5"
                        >
                            {/* Viscous Cum Strings (Inner) */}
                            <motion.div className="w-4 h-16 bg-white/70 rounded-full blur-[2px]" />
                            <motion.div className="w-3 h-12 bg-white/80 rounded-full blur-[1.5px]" />
                            {/* Dripping Orifice */}
                            <motion.div className="w-10 h-10 bg-white/90 rounded-full blur-[1px] shadow-[0_0_20px_white]" />
                        </motion.div>
                    )}
                </AnimatePresence>
             </motion.div>
          </div>

          {/* 🍆 HYPER-REALISTIC MALE ORGAN (Shaft + Balls) */}
          <motion.div 
            drag="y"
            dragConstraints={{ top: -200, bottom: 200 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            animate={isClimaxing && isInserted ? { x: [0, -6, 6, 0], y: [0, 3, -3, 0] } : {}}
            transition={{ duration: 0.05, repeat: Infinity }}
            className="absolute z-20 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center h-full"
          >
            <div className="relative flex flex-col items-center">
              
              {/* --- Girthy Shaft --- */}
              <motion.div 
                animate={{ scale: isInserted ? 1.25 : 1 }}
                className={`w-28 h-[350px] md:w-36 md:h-[450px] rounded-full border-4 transition-all duration-300 
                  ${isInserted ? 'bg-gradient-to-b from-rose-400 via-rose-700 to-rose-900 border-rose-200 shadow-[0_0_120px_#e11d48]' : 'bg-white/5 border-white/10 opacity-30'}`}
              >
                {/* Anatomical Head (Glans) */}
                <div className="absolute top-0 w-full h-28 bg-rose-300/40 rounded-t-full border-b-2 border-rose-200/20 shadow-inner" />
                
                {/* Vein Detail (Subtle) */}
                <div className="absolute inset-0 opacity-20">
                    <div className="w-1.5 h-full bg-rose-950 mx-auto blur-[3px]" />
                </div>
              </motion.div>

              {/* ⚽⚽ THE BALLS (Pulsing & Bouncing) */}
              <div className="flex -mt-10 gap-1 relative z-10 pointer-events-none">
                <motion.div 
                    animate={isInserted ? { y: [0, 10, 0], scale: 1.15 } : { scale: 1, y: 0 }}
                    transition={{ repeat: Infinity, duration: 0.4 }}
                    className={`w-24 h-28 rounded-full border-2 transition-all 
                        ${isInserted ? 'bg-rose-950/80 border-rose-700 shadow-xl' : 'bg-white/5 border-white/10 opacity-30'}`} 
                />
                <motion.div 
                    animate={isInserted ? { y: [0, 8, 0], scale: 1.15 } : { scale: 1, y: 0 }}
                    transition={{ repeat: Infinity, duration: 0.4, delay: 0.15 }}
                    className={`w-24 h-28 rounded-full border-2 transition-all 
                        ${isInserted ? 'bg-rose-950/80 border-rose-700 shadow-xl' : 'bg-white/5 border-white/10 opacity-30'}`} 
                />
              </div>

              {/* 💦 PRECISE CLIMAX DISCHARGE (Particles Only when inserted) */}
              <AnimatePresence>
                {isClimaxing && isInserted && (
                  <motion.div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none">
                    {[...Array(dischargeWave === 2 ? 80 : 35)].map((_, i) => (
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
                        className="absolute top-0 left-1/2 w-8 h-8 bg-white rounded-full blur-[3px] shadow-[0_0_30px_white]"
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
        <div className="max-w-3xl text-center px-10 h-32 flex items-center justify-center">
             <motion.p 
               key={status}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-3xl font-black italic text-rose-100 drop-shadow-lg uppercase tracking-tight"
             >
                {status === "AWAITING_INSERTION" && "\"Connect Fahim... my vagina is cold... fill me up.\""}
                {status === "DEEP_SYNC" && "\"Mmm... yes... fill me deep... the friction is perfect... don't stop.\""}
                {status === "SYSTEM_DISCHARGING_🫦" && "\"IT'S BURSTING! FAHIM... EVERYTHING IS OVERFLOWING! AH!\""}
                {status === "POST_PEAK_LEAK_💦" && "\"Neural sync complete... I'm completely flooded.\""}
                {status === "LINK_SEVERED" && "\"Why did you sever the connection Fahim... I needed more.\""}
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
