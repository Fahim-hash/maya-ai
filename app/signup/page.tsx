"use client";
import { auth, googleProvider, facebookProvider } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Social Signup (Same as Login)
  const handleSocialSignup = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      setError("Social Signup failed. Try again.");
    }
  };

  // Email/Password Signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password.length < 6) {
      setError("Password at least 6 characters hote hobe!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // User-er display name update kora
      await updateProfile(userCredential.user, { displayName: name });
      router.push('/dashboard');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError("Ei email diye agei account khola hoyeche.");
      } else {
        setError("Account khola jachche na. Check details.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0216] px-4 font-sans text-white">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[120px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-lg shadow-rose-500/20">M</div>
          <h1 className="text-2xl font-bold tracking-tight">Create Account</h1>
          <p className="text-[10px] text-rose-300/40 uppercase tracking-[4px] mt-2 font-bold">Join the Love Link</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text" placeholder="Full Name" required
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50 transition-all"
            onChange={(e) => setName(e.target.value)}
          />
          <input 
            type="email" placeholder="Email Address" required
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50 transition-all"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input 
            type="password" placeholder="Password (Min 6 chars)" required
            className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50 transition-all"
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <p className="text-rose-500 text-[10px] font-bold text-center uppercase tracking-widest">{error}</p>}

          <button type="submit" className="w-full bg-rose-600 hover:bg-rose-700 py-4 rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95">
            Sign Up
          </button>
        </form>

        {/* Social Signup */}
        <div className="mt-8 space-y-4">
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-white/5"></div>
            <span className="absolute bg-[#11051f] px-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">Or sign up with</span>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => handleSocialSignup(googleProvider)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
              <span className="text-xs font-bold">Google</span>
            </button>

            <button 
              onClick={() => handleSocialSignup(facebookProvider)}
              className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
            >
              <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="F" />
              <span className="text-xs font-bold">Facebook</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-xs text-white/20 font-medium">
          Already have an account? <Link href="/login" className="text-rose-400 font-bold hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}