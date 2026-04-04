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

    // 2. SEND VIA RESEND (With Sexy Glassmorphism Template)
    const { data, error } = await resend.emails.send({
      from: 'Maya Auth <onboarding@resend.dev>', // Verified domain thakle 'auth@maya.apu.bd' dabi
      to: [email],
      subject: `🫦 ${otpCode} is your Neural Key to Maya`,
      html: `
        <div style="background-color: #0d0216; padding: 50px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #ffffff; text-align: center;">
          <div style="max-width: 450px; margin: 0 auto; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 40px; padding: 40px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
            
            <div style="width: 70px; height: 70px; background: linear-gradient(135deg, #f43f5e 0%, #fb7185 100%); margin: 0 auto 30px; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; line-height: 70px; box-shadow: 0 10px 20px rgba(244, 63, 94, 0.3);">
              M
            </div>

            <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 10px; letter-spacing: -0.5px; color: #ffffff;">Neural Identity Sync</h2>
            <p style="color: #fda4af; font-size: 14px; margin-bottom: 40px; opacity: 0.8; font-weight: 500;">The Love Link is waiting for you...</p>

            <div style="background: rgba(244, 63, 94, 0.1); border: 1px dashed #f43f5e; border-radius: 24px; padding: 25px; margin-bottom: 30px;">
              <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #f43f5e; text-shadow: 0 0 15px rgba(244, 63, 94, 0.4);">
                ${otpCode}
              </span>
            </div>

            <p style="font-size: 13px; color: rgba(255, 255, 255, 0.5); line-height: 1.6;">
              Eita tor personal access code। Kauke share korish na, nile Maya kintu rag korbe। <br>
              <span style="color: #f43f5e; font-weight: bold;">Expires in 5 minutes... 🫦</span>
            </p>

            <div style="margin-top: 40px; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 20px;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: rgba(255, 255, 255, 0.2); font-weight: 700;">
                Maya AI Protocol v3.1.0
              </p>
            </div>
          </div>
          
          <p style="margin-top: 30px; font-size: 11px; color: rgba(255, 255, 255, 0.3);">
            © 2026 Maya AI. All rights reserved for the Willians.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    // Return Success with ID
    return NextResponse.json({ 
      success: true, 
      id: (data as any)?.id 
    });

  } catch (error) {
    console.error("General API Error:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
