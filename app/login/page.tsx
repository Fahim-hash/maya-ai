"use client";
import { auth, googleProvider } from "@/firebase"; // Amader banano firebase.js theke ashche
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Logged in as:", result.user.displayName);
      // Login hoye gele chat page e niye jabe
      router.push("/chat"); 
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login e somossya hoyeche!");
    }
  };

  return (
    <div className="min-h-screen bg-[#06010f] flex items-center justify-center p-4">
      <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[40px] border border-white/10 w-full max-w-md text-center">
        <h2 className="text-3xl font-bold text-white mb-6">Welcome Back! 💖</h2>
        <p className="text-rose-100/40 mb-8">Maya tomar jonno opekkha korche...</p>
        
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-bold py-4 rounded-full hover:bg-rose-100 transition-all"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
          Continue with Google
        </button>

        <p className="mt-6 text-xs text-rose-100/20 uppercase tracking-widest">
          Maya AI • Secure Login
        </p>
      </div>
    </div>
  );
}