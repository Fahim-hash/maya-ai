import { NextResponse } from 'next/server';
import { db } from '@/firebase'; // Path check korish tor firebase config onujayi
import { doc, getDoc, deleteDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { email, userOtp } = await req.json();

    if (!email || !userOtp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    // 1. Firestore theke oi email-er temporary OTP data-ta tulo
    const docRef = doc(db, "temp_otps", email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const savedData = docSnap.data();
      const savedOtp = savedData.otp;
      const createdAt = savedData.createdAt?.toDate();

      // 2. Optional: OTP Expiry check (5 mins)
      const now = new Date();
      if (createdAt && (now.getTime() - createdAt.getTime()) > 5 * 60 * 1000) {
        await deleteDoc(docRef);
        return NextResponse.json({ error: 'OTP Expired! 🫦' }, { status: 400 });
      }

      // 3. Match the OTP
      if (savedOtp === userOtp) {
        // Success hole temporary data muche fel jate re-use na hoy
        await deleteDoc(docRef);
        return NextResponse.json({ success: true });
      } else {
        return NextResponse.json({ error: 'Wrong OTP' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: 'No OTP found for this email' }, { status: 404 });
    }

  } catch (error) {
    console.error("Verification Route Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
