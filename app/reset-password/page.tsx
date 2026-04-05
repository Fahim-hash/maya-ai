"use client";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const actionCode = searchParams.get('oobCode');
  
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionCode) {
      setMsg({ text: "INVALID OR EXPIRED LINK! 🫦", type: 'error' });
      return;
    }

    if (newPassword.length < 6) {
      setMsg({ text: "PASSWORD MUST BE 6+ CHARS! 🫦", type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetCode(auth, actionCode);
      await confirmPasswordReset(auth, actionCode, newPassword);
      setMsg({ text: "NEURAL SYNC SUCCESS! REDIRECTING...", type: 'success' });
      
      setTimeout(() => router.push("/login"), 2500);
    } catch (error: any) {
      console.error(error);
      setMsg({ text: "LINK EXPIRED BA SYSTEM ERROR! 🫦", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      className="w-full max-w-md bg-white/5 p-10 rounded-[40px] backdrop-blur-2xl border border-white/10 shadow-2xl"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-tr from-emerald-500 to-teal-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-lg shadow-emerald-500/20">M</div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Reset Secret</h1>
        <p className="text-[10px] text-emerald-300/40 uppercase tracking-[4px] mt-2 font-bold font-mono">Update Identity</p>
      </div>

      <form onSubmit={handleReset} className="space-y-5">
        <input 
          type="password" 
          placeholder="NEW PASSWORD" 
          required 
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500/50 transition-all text-white"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        
        <button 
          disabled={loading || !actionCode} 
          className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-600/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white uppercase tracking-widest text-xs"
        >
          {loading ? "SYNCING..." : "UPDATE & ACTIVATE"}
        </button>
      </form>

      <AnimatePresence>
        {msg.text && (
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 text-center text-[10px] font-bold uppercase tracking-[2px] ${msg.type === 'error' ? 'text-rose-500' : 'text-emerald-400'}`}
          >
            {msg.text}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0d0216] flex items-center justify-center p-4 text-white font-sans">
      <Suspense fallback={
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin"></div>
          <p className="text-rose-500 font-bold tracking-widest text-[10px] uppercase">Establishing Neural Link...</p>
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
