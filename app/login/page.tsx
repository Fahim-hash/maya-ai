"use client";
import { auth, googleProvider, facebookProvider } from '@/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // Social Login Function
  const handleSocialLogin = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login failed:", err.message);
    }
  };

  // Email Login Function
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      alert("Email/Password ERROR!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0216] px-4 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-lg shadow-rose-500/20">M</div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="email" placeholder="Email"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password"
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50"
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="w-full bg-rose-600 hover:bg-rose-700 py-4 rounded-2xl font-bold shadow-lg shadow-rose-600/20">Login</button>
        </form>

        {/* Social Login Section */}
        <div className="mt-8 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/5"></div>
            <span className="absolute bg-[#120520] px-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">Or login with</span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => handleSocialLogin(googleProvider)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
              <span className="text-xs font-bold">Google</span>
            </button>

            <button 
              onClick={() => handleSocialLogin(facebookProvider)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="F" />
              <span className="text-xs font-bold">Facebook</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-white/20 font-medium">
          New here? <Link href="/signup" className="text-rose-400 font-bold hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}