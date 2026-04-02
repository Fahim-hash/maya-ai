"use client";
import { useState, useEffect } from 'react';
import { auth, db } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    personality: 'Sweet',
    hobby: '',
    bio: ''
  });

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) router.push('/login');
      else {
        setUser(currentUser);
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProfile(prev => ({ ...prev, ...docSnap.data() }));
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, profile, { merge: true });
      router.push('/dashboard');
    } catch (e) {
      console.error("Save failed:", e);
    }
  };

  if (loading) return <div className="h-screen bg-[#0d0216] flex items-center justify-center text-rose-500 font-bold animate-pulse">NEURAL SYNC...</div>;

  return (
    <div className="min-h-screen bg-[#0d0216] text-white p-8 md:p-16 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 border-b border-white/5 pb-8">
          <h1 className="text-5xl font-black italic tracking-tighter text-rose-500 uppercase">Neural Config</h1>
          <p className="text-[10px] tracking-[5px] uppercase opacity-40 mt-2">Modify Maya's Soul & Your Identity</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Section 1: Maya's Brain */}
          <section className="space-y-8">
            <h3 className="text-xs font-black uppercase tracking-[4px] text-rose-400/60 flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"/> Maya Personality
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {['Sweet', 'Naughty', 'Aggressive', 'Mysterious'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setProfile({ ...profile, personality: mode })}
                  className={`p-5 rounded-[25px] border text-left transition-all duration-300 ${
                    profile.personality === mode 
                    ? 'bg-rose-600 border-rose-500 shadow-[0_0_30px_rgba(225,29,72,0.3)]' 
                    : 'bg-white/5 border-white/10 opacity-40 hover:opacity-100'
                  }`}
                >
                  <span className="text-xl font-black italic">{mode} Mode</span>
                </button>
              ))}
            </div>
          </section>

          {/* Section 2: User Telemetry */}
          <section className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[4px] text-white/30">User Telemetry</h3>
            <div className="space-y-4">
              <div className="group">
                <label className="text-[9px] uppercase font-bold text-white/40 ml-2">Display Name</label>
                <input 
                  value={profile.name} 
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-rose-500 transition-all mt-1" 
                  placeholder="What should she call you?"
                />
              </div>
              <div className="group">
                <label className="text-[9px] uppercase font-bold text-white/40 ml-2">Target Hobby</label>
                <input 
                  value={profile.hobby} 
                  onChange={e => setProfile({...profile, hobby: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl outline-none focus:border-rose-500 mt-1" 
                  placeholder="Coding, Gaming, Sleeping?"
                />
              </div>
              <div className="group">
                <label className="text-[9px] uppercase font-bold text-white/40 ml-2">Life Summary (Bio)</label>
                <textarea 
                  value={profile.bio} 
                  onChange={e => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 p-5 rounded-3xl h-32 outline-none focus:border-rose-500 mt-1" 
                  placeholder="Tell Maya something about yourself..."
                />
              </div>
            </div>
          </section>
        </div>

        <div className="mt-16 flex gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleSave}
            className="flex-grow bg-gradient-to-r from-rose-600 to-pink-600 py-6 rounded-[30px] font-black uppercase tracking-[8px] shadow-2xl shadow-rose-600/40 hover:brightness-110 transition-all"
          >
            Apply Neural Changes
          </motion.button>
          <button onClick={() => router.push('/dashboard')} className="px-10 bg-white/5 border border-white/10 rounded-[30px] font-bold uppercase text-[10px] tracking-widest">Back</button>
        </div>
      </div>
    </div>
  );
}