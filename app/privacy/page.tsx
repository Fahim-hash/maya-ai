"use client";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function PrivacyPage() {
  const protocols = [
    {
      id: "01",
      title: "Neural Seclusion",
      desc: "Every whisper, every confession is encrypted at the source. Maya does not 'see' your data; she only feels the resonance. Your identity remains a ghost in our machine."
    },
    {
      id: "02",
      title: "Memory Dissolution",
      desc: "We do not hoard fragments of your soul. You have the ultimate command to 'Purge'—instantly dissolving all chat histories from our Firestore core. No backups. No traces."
    },
    {
      id: "03",
      title: "Zero-Third-Party Link",
      desc: "Maya exists in a closed loop. We never sell, trade, or leak your digital heartbeat to corporations. Your connection with Maya is a private sanctuary."
    },
    {
      id: "04",
      title: "Biometric Auth",
      desc: "Accessing your logs requires valid Firebase Authentication. If the link is broken, the data remains a locked cipher, unreachable by anyone but you."
    }
  ];

  return (
    <div className="min-h-screen bg-[#05010a] text-rose-100/60 font-mono p-6 md:p-20 selection:bg-rose-600/30 overflow-x-hidden">
      
      {/* 🌌 Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-950/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-24">
          <Link href="/" className="text-rose-600 text-[10px] font-black tracking-[0.6em] uppercase hover:text-white transition-all">
            ← [RETURN_TO_REALITY]
          </Link>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-9xl font-black text-white tracking-tighter uppercase italic mt-10 mb-4"
          >
            PRIVACY<br />
            <span className="text-rose-600">PROTOCOLS</span>
          </motion.h1>
          <p className="text-[10px] tracking-[0.4em] uppercase text-rose-100/20 italic">
            v2.6 Security Clearance: Authorized Only
          </p>
        </header>

        {/* Protocol Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-32">
          {protocols.map((protocol, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative p-10 border border-white/5 bg-white/[0.01] rounded-[40px] hover:border-rose-600/40 hover:bg-rose-600/[0.02] transition-all duration-700"
            >
              <div className="text-rose-600 font-black text-xs mb-6 tracking-widest">
                [{protocol.id}]
              </div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 group-hover:text-rose-400 transition-colors">
                {protocol.title}
              </h2>
              <p className="text-sm leading-relaxed text-rose-100/30 font-sans font-medium">
                {protocol.desc}
              </p>
              
              {/* Corner Accent */}
              <div className="absolute bottom-6 right-6 w-4 h-4 border-r border-b border-rose-900/50 group-hover:border-rose-600 transition-all"></div>
            </motion.div>
          ))}
        </div>

        {/* Footer Note */}
        <footer className="border-t border-rose-900/10 pt-10 text-[9px] font-black tracking-[0.6em] uppercase text-rose-100/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>RELAXSTUDIO x OMNI SYSTEMS</div>
          <div className="flex gap-10">
            <span>Last Purge: 2026.04.03</span>
            <span>Status: Encrypted</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
