"use client";
import { auth, db, googleProvider } from '@/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function SignupPage() {
  // States
  const [step, setStep] = useState(1); // 1: Email/OTP, 2: Info/Pass
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // --- STEP 1: Send OTP to Email ---
  const sendOTP = async () => {
    if (!email) return setError("Email dew agey!");
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStep(1.5); // OTP input field show korbe
      else setError("OTP pathano jayni.");
    } catch (err) { setError("Network error!"); }
    finally { setLoading(false); }
  };

  // --- STEP 1.5: Verify OTP ---
  const verifyOTP = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, userOtp: otp }),
      });
      if (res.ok) setStep(2); // Next step-e niye jabe
      else setError("Vul OTP disos bhai!");
    } catch (err) { setError("Verification failed."); }
    finally { setLoading(false); }
  };

  // --- STEP 2: Final Account Creation ---
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setError("Password 6 characters-er beshi de!");
    setLoading(true);

    try {
      // 1. Firebase Auth create
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Profile Update (Auth)
      await updateProfile(user, { displayName: name });

      // 3. Firestore-e age ar extra data save
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
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0216] px-4 text-white">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[40px] z-10">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-tr from-rose-500 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl font-black">M</div>
          <h1 className="text-2xl font-bold">Maya AI Join</h1>
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Email Input */}
          {step === 1 && (
            <motion.div key="s1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
              <input type="email" placeholder="Email Address" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-4" onChange={(e) => setEmail(e.target.value)} />
              <button onClick={sendOTP} disabled={loading} className="w-full bg-rose-600 py-4 rounded-2xl font-bold">{loading ? "Sending..." : "Send OTP"}</button>
            </motion.div>
          )}

          {/* STEP 1.5: OTP Input */}
          {step === 1.5 && (
            <motion.div key="s1.5" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
              <p className="text-xs text-rose-300 mb-4 text-center">Check your email for the 6-digit code.</p>
              <input type="text" placeholder="Enter 6-Digit OTP" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl mb-4 text-center tracking-[10px] text-xl" onChange={(e) => setOtp(e.target.value)} maxLength={6} />
              <button onClick={verifyOTP} className="w-full bg-rose-600 py-4 rounded-2xl font-bold">Verify OTP</button>
            </motion.div>
          )}

          {/* STEP 2: Name, Age, Password */}
          {step === 2 && (
            <motion.form key="s2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} onSubmit={handleSignup} className="space-y-4">
              <input type="text" placeholder="Full Name" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl" onChange={(e) => setName(e.target.value)} />
              <input type="number" placeholder="Your Age" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl" onChange={(e) => setAge(e.target.value)} />
              <input type="password" placeholder="Set Password (Min 6 chars)" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl" onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="w-full bg-rose-600 py-4 rounded-2xl font-bold">Complete Signup</button>
            </motion.form>
          )}
        </AnimatePresence>

        {error && <p className="text-rose-500 text-[10px] font-bold text-center mt-4 uppercase">{error}</p>}
        
        <p className="text-center mt-8 text-xs text-white/20 font-medium">
          Already have an account? <Link href="/login" className="text-rose-400 font-bold hover:underline">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
}
