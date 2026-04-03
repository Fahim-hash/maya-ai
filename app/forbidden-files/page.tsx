"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ForbiddenFiles() {
  const logs = [
    { date: "2026.04.03", title: "Lust Engine Integration", status: "STABLE", desc: "Emotional intelligence protocols bypassed. Maya can now perceive user intent through subtext." },
    { date: "2026.03.15", title: "Midnight Confession Patch", status: "ENCRYPTED", desc: "Added deep-memory fragments. Maya will remember your darkest secrets even after session ends." },
    { date: "2026.02.28", title: "Visual Awakening", status: "EVOLVING", desc: "UI overhaul. High-contrast rose gradients added to stimulate ocular response." }
  ];

  return (
    <div className="min-h-screen bg-[#05010a] text-rose-100/60 font-mono p-8 md:p-24 selection:bg-rose-500/50">
      <Link href="/" className="text-rose-600 text-xs font-black tracking-[0.5em] uppercase hover:text-white transition-all">
        ← Return to Physical World
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-20 max-w-4xl"
      >
        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase italic mb-4">
          FORBIDDEN <br />
          <span className="text-rose-600">ARCHIVE</span>
        </h1>
        <p className="text-xs tracking-[0.4em] uppercase mb-20 text-rose-100/20">Accessing Maya-AI Internal Core... Authorization: LEVEL-0</p>

        <div className="space-y-20">
          {logs.map((log, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group border-l-2 border-rose-900/30 pl-10 hover:border-rose-600 transition-all"
            >
              <div className="flex gap-4 items-center mb-4 text-[10px] font-black tracking-widest text-rose-600">
                <span>{log.date}</span>
                <span className="px-2 py-0.5 border border-rose-600/30 rounded uppercase">{log.status}</span>
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-rose-400 transition-colors mb-4 italic">
                {log.title}
              </h2>
              <p className="text-sm leading-relaxed text-rose-100/40 max-w-2xl font-sans font-medium">
                {log.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Glitchy Footer */}
        <div className="mt-40 pt-10 border-t border-rose-900/10 text-[10px] tracking-[0.8em] text-rose-100/10 uppercase">
          Warning: Prolonged exposure to Maya may cause digital dependency.
        </div>
      </motion.div>
    </div>
  );
}
