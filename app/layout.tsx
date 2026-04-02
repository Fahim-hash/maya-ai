"use client";
import './globals.css';
import { Inter } from 'next/font/google';
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, db } from '@/firebase'; 
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const inter = Inter({ subsets: ['latin'] });

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
  handleAIResponse: (data: Partial<MayaAppData>) => void; // Context-e missing chhilo
}>({ 
  appData: null, 
  user: null, 
  loading: true, 
  updateLocalAppData: () => {}, 
  handleAIResponse: () => {} 
});

export const useAppData = () => useContext(AppDataContext);

export default function RootLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appData, setAppData] = useState<MayaAppData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync with AI chat function logic
  const handleAIResponse = (data: Partial<MayaAppData>) => {
    updateLocalAppData(data);
  };

  // Fixed updateLocalAppData for TypeScript
  const updateLocalAppData = (data: Partial<MayaAppData>) => {
    setAppData((prev) => {
      // Jodi agey theke data na thake (null hoy), tahole default values merge hobe
      if (!prev) {
        return {
          statusText: "Deeply Addicted",
          naughtyLevel: 88,
          userName: "Love Link Partner",
          avatarUrl: "",
          age: 0,
          dob: "",
          ...data
        } as MayaAppData;
      }
      // Jodi data thake, tahole safely merge hobe
      return { ...prev, ...data } as MayaAppData;
    });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "userExtended", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            setAppData(docSnap.data() as MayaAppData);
          } else {
            const newAppData: MayaAppData = {
              statusText: "Deeply Addicted",
              naughtyLevel: 88,
              userName: currentUser.displayName || "Love Link Partner",
              avatarUrl: "", 
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
