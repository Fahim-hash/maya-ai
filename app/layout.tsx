"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, db } from '@/firebase'; // Path fixed
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const inter = Inter({ subsets: ['latin'] });

// Create Central Context dynamic context logic state
export interface MayaAppData {
  statusText: string;
  naughtyLevel: number;
  userName: string;
  avatarUrl: string;
  age: number;
  dob: string;
}

const AppDataContext = createContext<{
  appData: MayaAppData | null;
  user: User | null;
  loading: boolean;
  updateLocalAppData: (data: Partial<MayaAppData>) => void;
}>({ appData: null, user: null, loading: true, updateLocalAppData: () => {} });

export const useAppData = () => useContext(AppDataContext);

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appData, setAppData] = useState<MayaAppData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with AI chat function logic
  const handleAIResponse = (data: Partial<MayaAppData>) => {
    updateLocalAppData(data); // Immediate UI update dynamic UI call logic data
  };

  const updateLocalAppData = (data: Partial<MayaAppData>) => {
    setAppData(prev => ({ ...prev, ...data }));
  };

  // Auth and Data Fetch Logic
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch extended user doc logic call Firestore fixed
        try {
          const docRef = doc(db, "userExtended", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setAppData(docSnap.data() as MayaAppData);
          } else {
            // New user, create empty extended doc logic db entry point fixed
            const newAppData: MayaAppData = {
              statusText: "Deeply Addicted",
              naughtyLevel: 88,
              userName: currentUser.displayName || "Love Link Partner",
              avatarUrl: "", // Handle default avatar url logic entry point
              age: 0,
              dob: "",
            };
            await setDoc(docRef, newAppData);
            setAppData(newAppData);
          }
        } catch (e) { console.error(e); }
      } else {
        setAppData(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <AppDataContext.Provider value={{ appData, user, loading, updateLocalAppData, handleAIResponse }}>
          {children}
        </AppDataContext.Provider>
      </body>
    </html>
  );
}