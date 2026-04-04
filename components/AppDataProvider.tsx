"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/firebase'; 
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// --- Data Structure Interface ---
export interface MayaAppData {
  statusText: string;
  naughtyLevel: number;
  userName: string;
  avatarUrl: string;
  age: number;
  dob: string;
}

// --- Context Definition ---
const AppDataContext = createContext<{
  appData: MayaAppData | null;
  user: User | null;
  loading: boolean;
  updateLocalAppData: (data: Partial<MayaAppData>) => void;
  handleAIResponse: (data: Partial<MayaAppData>) => void;
}>({ 
  appData: null, 
  user: null, 
  loading: true, 
  updateLocalAppData: () => {}, 
  handleAIResponse: () => {} 
});

// --- Custom Hook for easy access ---
export const useAppData = () => useContext(AppDataContext);

// --- Provider Component ---
export default function AppDataProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [appData, setAppData] = useState<MayaAppData | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync logic for AI chat responses
  const handleAIResponse = (data: Partial<MayaAppData>) => {
    updateLocalAppData(data);
  };

  // Safe State Update Logic
  const updateLocalAppData = (data: Partial<MayaAppData>) => {
    setAppData((prev) => {
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
      return { ...prev, ...data } as MayaAppData;
    });
  };

  // Firebase Auth & Firestore Sync
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
            // If new user, create default entry in Firestore
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
        } catch (e) {
          console.error("Firestore Data Fetch Error:", e);
        }
      } else {
        setAppData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AppDataContext.Provider value={{ appData, user, loading, updateLocalAppData, handleAIResponse }}>
      {children}
    </AppDataContext.Provider>
  );
}
