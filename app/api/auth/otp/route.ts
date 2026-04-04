import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { db } from '@/firebase'; // Path verify korish
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();

    // 1. SAVE TO FIRESTORE (Database-e na rakhle verify kora jabe na)
    try {
      await setDoc(doc(db, "temp_otps", email), {
        otp: otpCode,
        createdAt: serverTimestamp(),
      });
    } catch (dbErr) {
      console.error("Firestore Save Error:", dbErr);
      return NextResponse.json({ error: 'Database sync failed' }, { status: 500 });
    }

    // 2. SEND VIA RESEND
    const { data, error } = await resend.emails.send({
      from: 'Maya Auth <onboarding@resend.dev>', // Custom domain verify na thakle eita thak
      to: [email],
      subject: `${otpCode} is your Maya Verification Code 🫦`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0d0216; color: white; border-radius: 20px; text-align: center;">
          <h1 style="color: #f43f5e; font-size: 32px; letter-spacing: 5px;">${otpCode}</h1>
          <p style="color: #fda4af;">Your Neural Verification Code</p>
          <p style="color: #fda4af; font-size: 12px;">Expires in 5 mins... 🫦</p>
          <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.1); margin: 20px 0;">
          <p style="font-size: 10px; color: rgba(255,255,255,0.2);">Maya AI | The Love Link</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      id: (data as any)?.id 
    });

  } catch (error) {
    console.error("General API Error:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
