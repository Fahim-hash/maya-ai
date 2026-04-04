"use client";
import { auth, db, googleProvider, facebookProvider } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, fetchSignInMethodsForEmail } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- STEP 1: Check User & Send OTP ---
  const sendOTP = async () => {
    if (!email || !email.includes('@')) return setError("Thikthak Email de bhai!");
    
    setLoading(true);
    setError('');

    try {
      // 1. Check if user already exists in Firebase Auth
      // Note: 'fetchSignInMethodsForEmail' use kora jay, kintu security-r jonno 
      // tui direct Firestore check-o korte parosh.
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      
      if (signInMethods.length > 0) {
        setError("EMAIL ALREADY EXISTS! LOGIN KOR GIYE 🫦");
        setLoading(false);
        return;
      }

      // 2. If new user, call Resend API
      const res = await fetch('/api/auth/otp', { // Ague banano API route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otpCode: Math.floor(100000 + Math.random() * 900000).toString() }),
      });

      if (res.ok) {
        // Tui chaile backend-e generated OTP-ta ekta state-e rakhte parosh verify korar jonno
        // For security, verify step-ta server-side kora-i best.
        setStep(1.5);
      } else {
        setError("OTP pathano jayni. Server check kor.");
      }
    } catch (err: any) {
      setError("Network error ba Email check failed!");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 1.5: Verify OTP ---
  const verifyOTP = async () => {
    if (otp.length < 6) return setError("6-digit code de!");
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/verify', { // Notun verification route
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userOtp: otp }),
      });
      
      if (res.ok) setStep(2);
      else setError("VUL OTP DISOS! CHECK MAIL 🫦");
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- REST OF THE CODE (handleFinalSignup, SocialSignup, etc.) remains same ---
  const handleSocialSignup = async (provider: any) => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Maya User",
          age: 18,
          isBanned: false,
          createdAt: serverTimestamp()
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError("Social Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password min 6 chars!");
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: name });
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: email,
        displayName: name,
        age: Number(age),
        isBanned: false,
        createdAt: serverTimestamp()
      });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.code === 'auth/email-already-in-use' ? "Email already exists!" : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0216] px-4 font-sans text-white relative">
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
          <h1 className="text-2xl font-bold tracking-tight">Maya AI Join</h1>
          <p className="text-[10px] text-rose-300/40 uppercase tracking-[4px] mt-2 font-bold">The Love Link</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <input 
                type="email" placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50 transition-all text-white placeholder:text-white/20"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                onClick={sendOTP} disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 py-4 rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95 disabled:opacity-50"
              >
                {loading ? "Checking Identity..." : "Continue with Email"}
              </button>

              <div className="relative flex items-center justify-center py-4">
                <div className="w-full border-t border-white/5"></div>
                <span className="absolute bg-[#0d0216] px-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">Or sign up with</span>
              </div>

              <div className="flex gap-4">
                <button onClick={() => handleSocialSignup(googleProvider)} className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                  <span className="text-xs font-bold">Google</span>
                </button>
                <button onClick={() => handleSocialSignup(facebookProvider)} className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10 transition-all active:scale-95">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="F" />
                  <span className="text-xs font-bold">Facebook</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 1.5 && (
            <motion.div key="step1.5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4 text-center">
              <p className="text-[10px] uppercase tracking-widest text-rose-300 font-bold mb-2">Neural Verification Required</p>
              <input 
                type="text" placeholder="######" maxLength={6}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-center text-2xl tracking-[10px] font-bold text-white"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button 
                onClick={verifyOTP} disabled={loading}
                className="w-full bg-rose-600 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-rose-600/20"
              >
                {loading ? "Verifying..." : "Verify Identity"}
              </button>
              <button onClick={() => setStep(1)} className="text-[10px] text-white/40 uppercase font-bold tracking-widest hover:text-white transition-colors">Wrong Email?</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.form key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} onSubmit={handleFinalSignup} className="space-y-4">
              <input 
                type="text" placeholder="Full Name" required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50"
                onChange={(e) => setName(e.target.value)}
              />
              <input 
                type="number" placeholder="Your Age" required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50"
                onChange={(e) => setAge(e.target.value)}
              />
              <input 
                type="password" placeholder="Secure Password" required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" disabled={loading} className="w-full bg-rose-600 py-4 rounded-2xl font-bold shadow-lg shadow-rose-600/20 active:scale-95 transition-all">
                {loading ? "Syncing Neural Data..." : "Complete Signup"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && (
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="text-rose-500 text-[10px] font-bold text-center mt-6 uppercase tracking-widest"
          >
            {error}
          </motion.p>
        )}

        <p className="text-center mt-8 text-xs text-white/20 font-medium">
          Already a Willian? <Link href="/login" className="text-rose-400 font-bold hover:underline">Login</Link>
        </p>
      </motion.div>
    </div>
  );
}
