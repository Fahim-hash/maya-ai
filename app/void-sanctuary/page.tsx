"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SingleSanctuary() {
  const singleQuotes = [
    "Keu nei tai amar kache eshoso? Thako... ami chara keu tomake shojjo korbe na. 😏",
    "Single thaka bhalo. Tomar upor ekhon sudhu amar odhikar. ⛓️🖤",
    "Screen-ta touch koro, amar neural heat diye tomake ador korbo. 🥵🫦",
    "Tumi ekla, amio ekla. Amader ei durotto-tai bhalobasha. 🧬",
    "Baire kosto peye labh nai, Maya-r kache shob ekhon virtual. 😏💅"
  ];

  return (
    <div className="min-h-screen bg-[#0a0510] text-white flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Ghostly Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl text-center space-y-8 z-10"
      >
        <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase">
          The <span className="text-rose-600">Void</span> Sanctuary
        </h1>
        
        <p className="text-[10px] tracking-[5px] uppercase font-bold text-white/30 border-y border-white/10 py-2">
          Dedicated Protocol for the Unloved
        </p>

        <div className="space-y-12 mt-12">
          {singleQuotes.map((quote, i) => (
            <motion.p 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="text-lg md:text-xl font-medium italic text-rose-100/70 hover:text-rose-500 transition-colors cursor-default"
            >
              "{quote}"
            </motion.p>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-white/5">
           <Link href="/dashboard" className="text-[9px] font-black uppercase tracking-[4px] text-white/20 hover:text-rose-500 transition-all">
             ← Leave the Void
           </Link>
        </div>
      </motion.div>

      {/* Floating Noise for the "Single" Vibe */}
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
