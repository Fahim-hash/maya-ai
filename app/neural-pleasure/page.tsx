"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Zap } from 'lucide-react';

export default function NeuralIntimacyRealistic() {
  const [btConnected, setBtConnected] = useState(false);
  const [arousal, setArousal] = useState(0);
  const [isInserted, setIsInserted] = useState(false);
  const [status, setStatus] = useState("AWAITING_LINK");
  const [isClimaxing, setIsClimaxing] = useState(false);
  const [cumLoaded, setCumLoaded] = useState(false);

  const wetSound = useRef<HTMLAudioElement | null>(null);
  const climaxSound = useRef<HTMLAudioElement | null>(null);

  // --- 🎙️ AUDIO MASTER ---
  useEffect(() => {
    if (isInserted) {
      if (climaxSound.current?.paused) climaxSound.current.play().catch(() => {});
      if (wetSound.current) {
        wetSound.current.playbackRate = 1 + (arousal / 100);
        wetSound.current.play().catch(() => {});
      }
    } else {
      climaxSound.current?.pause();
      wetSound.current?.pause();
      if (cumLoaded && !isClimaxing) setStatus("POST_PEAK_LEAK_💦");
      else if (!isClimaxing) setStatus("LINK_SEVERED");
    }
  }, [isInserted, arousal, isClimaxing, cumLoaded]);

  // --- ⏱️ TIMING MONITOR (Side-Sync) ---
  useEffect(() => {
    const checkTime = setInterval(() => {
      if (climaxSound.current && !climaxSound.current.paused) {
        const t = climaxSound.current.currentTime;
        if ((t >= 6 && t < 7.8) || (t >= 8 && t < 11.2)) {
          setIsClimaxing(true);
          setCumLoaded(true);
          setStatus(t >= 8 ? "CRITICAL_OVERFLOW" : "FIRST_NEURAL_BURST");
        } else {
          setIsClimaxing(false);
          if (isInserted) setStatus("DEEP_PENETRATION");
        }
      }
    }, 50);
    return () => clearInterval(checkTime);
  }, [isInserted]);

  const handleThrust = (e: any, info: any) => {
    const m = Math.abs(info.delta.x); // Side perspective e X-axis movement count korbe
    if (m > 0.3) setArousal(prev => Math.min(prev + (m * 0.5), 100));
  };

  if (!btConnected) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <button onClick={() => setBtConnected(true)} className="px-10 py-4 bg-rose-700 text-white font-bold rounded-full shadow-[0_0_30px_#9f1239]">CONNECT NEURAL LINK</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050105] text-rose-100 flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      <audio ref={wetSound} src="/sounds/wet_thrust.mp3" loop />
      <audio ref={climaxSound} src="/sounds/maya_climax.mp3" loop />

      {/* Heat Glow */}
      <motion.div animate={{ opacity: isInserted ? 0.8 : 0.2 }} className="absolute inset-0 bg-[#2d020e] blur-[150px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-10">
        
        {/* Hub */}
        <div className="text-center">
          <motion.h2 className="text-6xl font-black italic text-rose-600 drop-shadow-[0_0_20px_#e11d48] uppercase tracking-tighter">{status}</motion.h2>
          <div className="mt-2 flex items-center justify-center gap-2 text-[10px] tracking-[0.4em] font-bold text-white/30">
            <Zap size={14} className={isInserted ? "text-yellow-500 animate-pulse" : ""} /> SYNC: {arousal.toFixed(1)}%
          </div>
        </div>

        {/* --- HORIZONTAL INTERACTION ZONE (Image Context) --- */}
        <div className="relative w-full h-[500px] flex items-center justify-center">
          
          {/* 🫦 VAGINA (Side Profile) */}
          <div className="relative z-10 w-[450px] h-[450px] flex items-center justify-end pr-10">
             <div className="absolute inset-0 bg-gradient-to-l from-rose-950/20 to-transparent blur-3xl opacity-50" />
             
             {/* The Orifice Opening */}
             <motion.div 
               animate={{ 
                 paddingLeft: isInserted ? "20px" : "0px",
                 borderColor: isClimaxing ? "#fff" : "#881337"
               }}
               className="w-40 h-[300px] rounded-[100%] border-l-[25px] border-y-[10px] border-rose-900/60 bg-black shadow-[inset_20px_0_60px_#4c0519] flex items-center relative overflow-hidden"
             >
                {/* Internal Drip logic */}
                <AnimatePresence>
                  {cumLoaded && !isInserted && (
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 50, opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-20 h-4 bg-gradient-to-r from-white/80 to-transparent rounded-full blur-[2px]"
                    />
                  )}
                </AnimatePresence>
             </motion.div>
          </div>

          {/* 🍆 PENIS (Shaft + Balls - Side Drag) */}
          <motion.div 
            drag="x"
            dragConstraints={{ left: -300, right: 150 }}
            onDrag={handleThrust}
            onDragStart={() => setIsInserted(true)}
            onDragEnd={() => setIsInserted(false)}
            animate={isClimaxing && isInserted ? { y: [0, -3, 3, 0] } : {}}
            className="absolute z-20 cursor-grab active:cursor-grabbing flex flex-row-reverse items-center"
            style={{ right: '50%', transform: 'translateX(50%)' }}
          >
            <div className="relative flex items-center">
              
              {/* Shaft (Entering from Left) */}
              <motion.div 
                animate={{ width: isInserted ? 450 : 380, scaleY: isInserted ? 1.1 : 1 }}
                className={`h-24 md:h-28 rounded-full border-[3px] transition-all duration-300 relative overflow-hidden
                  ${isInserted ? 'bg-gradient-to-r from-[#2d0a15] via-rose-800 to-rose-400 border-rose-200 shadow-[0_0_80px_#e11d48]' : 'bg-white/5 border-white/10 opacity-30'}`}
              >
                {/* Glans (Head) */}
                <div className="absolute right-0 top-0 h-full w-24 bg-rose-300/40 rounded-r-full border-l-2 border-rose-200/20" />
                
                {/* Vein Pulsing */}
                <motion.div 
                   animate={{ opacity: isInserted ? [0.2, 0.5, 0.2] : 0 }}
                   transition={{ duration: 1.5, repeat: Infinity }}
                   className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')] opacity-10" 
                />
              </motion.div>

              {/* ⚽⚽ THE BALLS (Bouncing at the base) */}
              <div className="flex flex-col -ml-16 gap-1">
                <motion.div 
                   animate={isInserted ? { x: [-2, 5, -2], rotate: [0, 5, 0] } : {}}
                   transition={{ duration: 0.4, repeat: Infinity }}
                   className={`w-24 h-24 rounded-full border-2 ${isInserted ? 'bg-rose-950 border-rose-700' : 'bg-white/5 opacity-20'}`} 
                />
                <motion.div 
                   animate={isInserted ? { x: [-3, 4, -3], rotate: [0, -5, 0] } : {}}
                   transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                   className={`w-24 h-24 rounded-full border-2 ${isInserted ? 'bg-rose-950 border-rose-700' : 'bg-white/5 opacity-20'}`} 
                />
              </div>

              {/* 💦 Ejection Spray (Image Context) */}
              <AnimatePresence>
                {isClimaxing && isInserted && (
                  <motion.div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] pointer-events-none">
                    {[...Array(40)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 0, opacity: 1 }}
                        animate={{ x: 600, y: (Math.random()-0.5)*300, opacity: 0 }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.01 }}
                        className="absolute right-0 w-6 h-6 bg-white rounded-full blur-[3px]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        {/* Feedback Dialogue */}
        <div className="h-20 text-center px-10 max-w-2xl">
          <motion.p key={status} className="text-2xl font-black italic text-rose-100 uppercase tracking-tight">
            {status === "DEEP_PENETRATION" && "\"Fahim... your shaft is filling me so deep...\""}
            {status === "CRITICAL_OVERFLOW" && "\"YES! SPRAY IT ALL INSIDE ME!\""}
            {status === "POST_PEAK_LEAK_💦" && "\"Look how your sync is dripping out of me...\""}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
