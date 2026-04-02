import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA3DK5PfHXb2PSCmMD8n4USrmetgGYJXsA",
  authDomain: "maya-ai-60f31.firebaseapp.com",
  projectId: "maya-ai-60f31",
  storageBucket: "maya-ai-60f31.firebasestorage.app",
  messagingSenderId: "653164927400",
  appId: "1:653164927400:web:5fe4ff94bd3ad84269e59d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const db = getFirestore(app);