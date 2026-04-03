"use client";
import { auth, db, googleProvider, facebookProvider } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup } from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  // --- States ---
  const [step, setStep] = useState(1); // 1: Email/Social, 1.5: OTP, 2: Info/Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- Social Signup (Direct Dashboard) ---
  const handleSocialSignup = async (provider: any) => {
    try {
      setLoading(true);
      setError('');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Firestore check: User agey thakle data overwrite korbo na
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "Maya User",
          age: 18, // Default age for social
          isBanned: false,
          createdAt: serverTimestamp()
        });
      }
      router.push('/dashboard');
    } catch (err: any) {
      setError("Social Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 1: Send OTP ---
  const sendOTP = async () => {
    if (!email || !email.includes('@')) return setError("Thikthak Email de bhai!");
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStep(1.5);
      else setError("OTP pathano jayni. Server check kor.");
    } catch (err) {
      setError("Network error! Try again.");
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
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userOtp: otp }),
      });
      if (res.ok) setStep(2);
      else setError("Vul OTP disos! Check mail.");
    } catch (err) {
      setError("Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // --- STEP 2: Final Email/Password Account ---
  const handleFinalSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password min 6 chars!");
    setLoading(true);
    setError('');

    try {
      // 1. Firebase Auth Create
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Auth Profile Update
      await updateProfile(user, { displayName: name });

      // 3. Firestore Final Data
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
      {/* Glow Decor */}
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
          {/* STEP 1: Email & Social */}
          {step === 1 && (
            <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4">
              <input 
                type="email" placeholder="Email Address"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-rose-500/50 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button 
                onClick={sendOTP} disabled={loading}
                className="w-full bg-rose-600 hover:bg-rose-700 py-4 rounded-2xl font-bold shadow-lg shadow-rose-600/20 transition-all active:scale-95"
              >
                {loading ? "Sending..." : "Continue with Email"}
              </button>

              <div className="relative flex items-center justify-center py-4">
                <div className="w-full border-t border-white/5"></div>
                <span className="absolute bg-[#120520] px-4 text-[10px] text-white/30 uppercase tracking-widest font-bold">Or sign up with</span>
              </div>

              <div className="flex gap-4">
                <button onClick={() => handleSocialSignup(googleProvider)} className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10">
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                  <span className="text-xs font-bold">Google</span>
                </button>
                <button onClick={() => handleSocialSignup(facebookProvider)} className="flex-1 flex items-center justify-center gap-2 bg-white/5 border border-white/10 py-3.5 rounded-2xl hover:bg-white/10">
                  <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-5 h-5" alt="F" />
                  <span className="text-xs font-bold">Facebook</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 1.5: OTP Verification */}
          {step === 1.5 && (
            <motion.div key="step1.5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} className="space-y-4 text-center">
              <p className="text-sm text-rose-200">OTP pathiyechi tor mail-e. Check kor!</p>
              <input 
                type="text" placeholder="Enter 6-Digit OTP" maxLength={6}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none text-center text-2xl tracking-[10px] font-bold"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button 
                onClick={verifyOTP} disabled={loading}
                className="w-full bg-rose-600 py-4 rounded-2xl font-bold transition-all active:scale-95"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
              <button onClick={() => setStep(1)} className="text-[10px] text-white/40 uppercase font-bold tracking-widest hover:text-white">Change Email</button>
            </motion.div>
          )}

          {/* STEP 2: Profile Info & Password */}
          {step === 2 && (
            <motion.form key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} onSubmit={handleFinalSignup} className="space-y-4">
              <input 
                type="text" placeholder="Full Name" required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
                onChange={(e) => setName(e.target.value)}
              />
              <input 
                type="number" placeholder="Your Age" required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
                onChange={(e) => setAge(e.target.value)}
              />
              <input 
                type="password" placeholder="Set Password (Min 6 chars)" required
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" disabled={loading} className="w-full bg-rose-600 py-4 rounded-2xl font-bold shadow-lg shadow-rose-600/20">
                {loading ? "Creating..." : "Complete Signup"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && <p className="text-rose-500 text-[10px] font-bold text-center mt-6 uppercase tracking-widest animate-pulse">{error}</p>}

        <p className="text-center mt-8 text-xs text-white/20 font-medium">
          Already have an account? <Link href="/login" className="text-rose-400 font-bold hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}
