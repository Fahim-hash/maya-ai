"use client";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "@/firebase";
import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const actionCode = searchParams.get('oobCode'); // Firebase eii code-ta link-e pathay
  
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionCode) return;

    try {
      // 1. Code verify korbe
      await verifyPasswordResetCode(auth, actionCode);
      // 2. New password update korbe
      await confirmPasswordReset(auth, actionCode, newPassword);
      
      setMsg("PASSWORD UPDATED! RETURNING TO LOGIN...");
      setTimeout(() => router.push("/login"), 3000);
    } catch (error) {
      setMsg("INVALID OR EXPIRED LINK! 🫦");
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0216] flex items-center justify-center p-6 text-white">
      {/* Tor custom futuristic CSS and AnimatePresence eikhane use korbi */}
      <form onSubmit={handleReset} className="w-full max-w-sm space-y-6">
         <h1 className="text-2xl font-black italic uppercase">New Neural Identity</h1>
         <input 
           type="password" 
           placeholder="NEW PASSWORD" 
           className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl"
           onChange={(e) => setNewPassword(e.target.value)}
         />
         <button className="w-full bg-rose-600 py-4 rounded-2xl font-bold uppercase">Update & Sync</button>
         {msg && <p className="text-rose-400 text-[10px] text-center font-bold tracking-widest uppercase">{msg}</p>}
      </form>
    </div>
  );
}
