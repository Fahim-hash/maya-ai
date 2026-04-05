"use client";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, Suspense } from "react";
import { motion } from "framer-motion";

// --- Reset Form Component ---
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
      setMsg({ text: "INVALID LINK! 🫦", type: 'error' });
      return;
    }

    setLoading(true);
    try {
      await verifyPasswordResetCode(auth, actionCode);
      await confirmPasswordReset(auth, actionCode, newPassword);
      setMsg({ text: "SYNC SUCCESS! LOGGING IN...", type: 'success' });
      setTimeout(() => router.push("/login"), 2500);
    } catch (error) {
      setMsg({ text: "LINK EXPIRED BA ERROR! 🫦", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md bg-white/5 p-8 rounded-[40px] backdrop-blur-xl border border-white/10">
      <h1 className="text-2xl font-bold mb-6 text-center">New Secret</h1>
      <form onSubmit={handleReset} className="space-y-4">
        <input 
          type="password" placeholder="NEW PASSWORD" required 
          className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button disabled={loading} className="w-full bg-rose-600 py-4 rounded-2xl font-bold">
          {loading ? "SYNCING..." : "UPDATE IDENTITY"}
        </button>
      </form>
      {msg.text && (
        <p className={`mt-4 text-center text-[10px] font-bold uppercase tracking-widest ${msg.type === 'error' ? 'text-rose-500' : 'text-emerald-400'}`}>
          {msg.text}
        </p>
      )}
    </motion.div>
  );
}

// --- Main Page with Suspense (Deployment Fix) ---
export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0d0216] flex items-center justify-center p-4 text-white">
      <Suspense fallback={<div className="text-rose-500 font-bold">LOADING NEURAL LINK...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
