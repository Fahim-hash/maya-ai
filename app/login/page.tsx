"use client";
import { auth, googleProvider, facebookProvider } from '@/firebase';
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpMode, setOtpMode] = useState(false); // OTP mode switch
  const [userOtp, setUserOtp] = useState(''); // User input OTP
  const [generatedOtp, setGeneratedOtp] = useState(''); // System generated OTP
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const router = useRouter();

  // --- Resend OTP Logic for Forgot Password ---
  const handleForgotPassword = async () => {
    if (!email) {
      setMessage({ text: "AGEY EMAIL TA LEKH BHAI!", type: 'error' });
      return;
    }
    
    setLoading(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setGeneratedOtp(code);

      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: code }),
      });

      if (res.ok) {
        setOtpMode(true);
        setMessage({ text: "NEURAL OTP SENT! CHECK MAIL 💌", type: 'success' });
      } else {
        throw new Error();
      }
    } catch (err) {
      setMessage({ text: "SYSTEM ERROR! EMAIL TA THIK NAI!", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // --- Verify OTP Logic ---
  const handleVerifyOtp = () => {
    if (userOtp === generatedOtp) {
      setMessage({ text: "OTP VERIFIED! NOW LOGIN WITH NEW PASS (COMMING SOON)", type: 'success' });
      // Eikhane tui password reset er porer step add korte parbi
    } else {
      setMessage({ text: "VUL OTP! ABAR DEKH 🫦", type: 'error' });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard');
    } catch (err) {
      setMessage({ text: "VUL EMAIL BA PASSWORD!", type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: any) => {
    try {
      await signInWithPopup(auth, provider);
      router.push('/dashboard');
    } catch (err: any) {
      console.error("Login failed:", err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0216] px-4 font-sans text-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] shadow-2xl relative overflow-hidden"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black shadow-lg shadow-rose-500/20">M</div>
          <h1 className="text-2xl font-bold tracking-tight">
            {otpMode ? "Neural Verify" : "Welcome Back"}
          </h1>
          <p className="text-[10px] text-rose-300/40 uppercase tracking-[4px] mt-2 font-bold">
            {otpMode ? "Enter Secret Code" : "The Love Awaits"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!otpMode ? (
            <motion.form 
              key="login"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              onSubmit={handleLogin} 
              className="space-y-4"
            >
              <input 
                type="email" placeholder="Email" required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="relative">
                <input 
                  type="password" placeholder="Password" required
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-rose-400 hover:text-rose-300 uppercase tracking-wider"
                >
                  Forgot?
                </button>
              </div>

              {message.text && (
                <p className={`text-[10px] font-bold text-center uppercase tracking-widest ${message.type === 'error' ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {message.text}
                </p>
              )}

              <button 
                disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 py-4 rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="otp"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="space-y-4"
            >
              <input 
                type="text" placeholder="######" maxLength={6}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-center text-2xl tracking-[10px] font-bold outline-none focus:border-rose-500/50"
                onChange={(e) => setUserOtp(e.target.value)}
              />
              
              {message.text && (
                <p className={`text-[10px] font-bold text-center uppercase tracking-widest ${message.type === 'error' ? 'text-rose-500' : 'text-emerald-400'}`}>
                  {message.text}
                </p>
              )}

              <button 
                onClick={handleVerifyOtp}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl font-bold shadow-lg transition-all active:scale-95"
              >
                Verify OTP
              </button>
              <button 
                onClick={() => setOtpMode(false)}
                className="w-full text-[10px] text-white/30 uppercase font-bold tracking-widest"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {!otpMode && (
          <div className="mt-8 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="w-full border-t border-white/5"></div>
              <span className="absolute bg-[#0d0216] px-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">Or login with</span>
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
        )}

        <p className="text-center mt-8 text-xs text-white/20 font-medium">
          New here? <Link href="/signup" className="text-rose-400 font-bold hover:underline">Create Account</Link>
        </p>
      </motion.div>
    </div>
  );
}
