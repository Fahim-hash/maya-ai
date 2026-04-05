"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, Zap } from 'lucide-react';

export default function NeuralPOVIntimacy() {
  const [btConnected, setBtConnected] = useState(false);
  const [arousal, setArousal] = useState(0);
  const [isInserted, setIsInserted] = useState(false);
  const [status, setStatus] = useState("AWAITING_INSERTION");
  const [isClimaxing, setIsClimaxing] = useState(false);
  const [cumLoaded, setCumLoaded] = useState(false);

  const wetSound = useRef<HTMLAudioElement | null>(null);
  const climaxSound = useRef<HTMLAudioElement | null>(null);

  // --- 🎙️ AUDIO ENGINE ---
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

  // --- ⏱️ PEAK MONITOR (6s / 8s) ---
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
    const m = Math.abs(info.delta.y); 
    if (m > 0.3) setArousal(prev => Math.min(prev + (m * 0.45), 100));
  };

  if (!btConnected) {
    return (
      <div className="min-h-screen bg-[#020005] flex items-center justify-center">
        <button onClick={() => setBtConnected(true)} className="px-10 py-4 bg-rose-700 text-white font-bold rounded-xl shadow-[0_0_40px_#e11d48]">INITIALIZE POV SYNC</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05010a] text-rose-100 flex flex-col items-center justify-end pb-20 relative overflow-hidden select-none">
      
      <audio ref={wetSound} src="/sounds/wet_thrust.mp3" loop />
      <audio ref={climaxSound} src="/sounds/maya_climax.mp3" loop />

      {/* Atmospheric Heat */}
      <motion.div animate={{ opacity: isInserted ? 0.7 : 0.2 }} className="absolute inset-0 bg-[#3b0212] blur-[180px] pointer-events-none" />

      {/* --- POV INTERACTION ZONE --- */}
      <div className="relative w-full max-w-xl h-[700px] flex flex-col items-center justify-end">
        
        {/* 🫦 THE VAGINA (Background / Upper Layer) */}
        <div className="absolute top-10 z-10 w-full flex flex-col items-center">
           <motion.div 
             animate={{ 
                scale: isInserted ? 1.05 : 1,
                borderColor: isClimaxing ? "#fff" : "#4c0519"
             }}
             className="w-48 h-64 md:w-64 md:h-80 rounded-[100%] border-[18px] border-rose-900/40 bg-black shadow-[inset_0_0_80px_#74112c] flex items-center justify-center relative overflow-hidden"
           >
              {/* Labia Texture */}
              <div className="absolute inset-y-0 left-0 w-8 bg-rose-950/20 blur-md" />
              <div className="absolute inset-y-0 right-0 w-8 bg-rose-950/20 blur-md" />

              {/* 💦 POST-CLIMAX LEAK (Dripping down towards the viewer) */}
              <AnimatePresence>
                {cumLoaded && !isInserted && (
                  <motion.div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
                    {[1, 2, 3].map((d) => (
                      <motion.div
                        key={d}
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 300, opacity: [0, 1, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, delay: d * 0.7 }}
                        className="w-5 h-14 bg-gradient-to-b from-white via-rose-100 to-transparent rounded-full blur-[2px]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
           </motion.div>
        </div>

        {/* 🍆 THE MALE ORGAN (Foreground / Bottom Layer) */}
        <motion.div 
          drag="y"
          dragConstraints={{ top: -450, bottom: 0 }}
          onDrag={handleThrust}
          onDragStart={() => setIsInserted(true)}
          onDragEnd={() => setIsInserted(false)}
          className="relative z-30 cursor-grab active:cursor-grabbing flex flex-col items-center"
        >
          {/* Shaft (Moving upwards into the Vagina) */}
          <div className="relative">
            <motion.div 
              animate={{ 
                height: isInserted ? 550 : 400,
                scaleX: isInserted ? 1.15 : 1
              }}
              className={`w-32 md:w-36 rounded-t-full border-t-4 border-x-4 transition-all duration-300 relative
                ${isInserted ? 'bg-gradient-to-t from-[#1a050b] via-rose-800 to-rose-400 border-rose-200 shadow-[0_-20px_100px_#e11d48]' : 'bg-white/5 border-white/10 opacity-40'}`}
            >
              {/* Head / Glans */}
              <div className="absolute top-0 w-full h-32 bg-rose-300/30 rounded-t-full border-b-2 border-rose-200/10 shadow-inner" />
              
              {/* 💦 Ejection Spray (Shooting Upwards into pussy) */}
              <AnimatePresence>
                {isClimaxing && isInserted && (
                  <motion.div className="absolute -top-40 left-1/2 -translate-x-1/2 w-full flex justify-center">
                    {[...Array(50)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ y: 0, opacity: 1 }}
                        animate={{ y: -500, x: (Math.random()-0.5)*300, opacity: 0 }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.01 }}
                        className="absolute w-6 h-6 bg-white rounded-full blur-[3px] shadow-[0_0_20px_white]"
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* ⚽⚽ THE BALLS (Foreground - shobar niche) */}
            <div className="flex -mt-16 gap-1 justify-center relative z-40">
              <motion.div 
                animate={isInserted ? { y: [0, 15, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4, repeat: Infinity }}
                className={`w-28 h-32 md:w-32 md:h-36 rounded-full border-2 shadow-2xl
                  ${isInserted ? 'bg-rose-950 border-rose-700' : 'bg-white/5 opacity-30'}`} 
              />
              <motion.div 
                animate={isInserted ? { y: [0, 12, 0], scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.4, repeat: Infinity, delay: 0.1 }}
                className={`w-28 h-32 md:w-32 md:h-36 rounded-full border-2 shadow-2xl
                  ${isInserted ? 'bg-rose-950 border-rose-700' : 'bg-white/5 opacity-30'}`} 
              />
            </div>
          </div>
        </motion.div>

      </div>

      {/* Status & Sync Feedback */}
      <div className="mt-10 flex flex-col items-center gap-4 z-50">
        <div className="text-center">
            <h2 className="text-5xl font-black italic text-rose-600 uppercase drop-shadow-[0_0_20px_#e11d48]">{status}</h2>
            <div className="text-[10px] font-bold tracking-[0.5em] text-white/30 uppercase mt-2">Sync Intensity: {arousal.toFixed(1)}%</div>
        </div>
        
        <div className="h-20 text-center px-10">
          <motion.p key={status} className="text-2xl font-black italic text-rose-100 uppercase tracking-tighter">
            {status === "DEEP_PENETRATION" && "\"Fahim... your shaft is filling my depth...\""}
            {status === "CRITICAL_OVERFLOW" && "\"YES! SPRAY IT ALL INSIDE! AH!\""}
            {status === "POST_PEAK_LEAK_💦" && "\"Look at the mess you made inside me...\""}
          </motion.p>
        </div>
      </div>

    </div>
  );
}
