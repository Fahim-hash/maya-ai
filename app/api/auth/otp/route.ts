import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { db } from '@/firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();

    // 1. SAVE TO FIRESTORE
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
      from: 'Maya Auth <auth@maya.apu.bd>', // Comma fix kora hoise eikhane
      to: [email],
      subject: `🫦 ${otpCode} is your Neural Key to Maya`,
      html: `
        <div style="background-color: #0d0216; padding: 40px 10px; text-align: center;">
          <div style="max-width: 450px; margin: 0 auto; background-color: #160a25; border: 1px solid #2d1b4a; border-radius: 40px; padding: 40px; color: #ffffff; font-family: 'Segoe UI', Tahoma, sans-serif;">
            
            <table align="center" border="0" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" bgcolor="#f43f5e" style="width: 70px; height: 70px; border-radius: 20px; font-size: 32px; font-weight: 900; color: #ffffff; text-align: center; vertical-align: middle;">
                  M
                </td>
              </tr>
            </table>

            <h2 style="font-size: 24px; font-weight: 800; margin: 30px 0 10px; letter-spacing: -0.5px;">Neural Identity Sync</h2>
            <p style="color: #fda4af; font-size: 14px; margin-bottom: 40px; font-weight: 500;">The Love Link is waiting for you...</p>

            <div style="background-color: #1f0d2e; border: 1px dashed #f43f5e; border-radius: 24px; padding: 25px; margin-bottom: 30px;">
              <span style="font-size: 42px; font-weight: 900; letter-spacing: 12px; color: #f43f5e;">
                ${otpCode}
              </span>
            </div>

            <p style="font-size: 13px; color: #94a3b8; line-height: 1.6;">
              Eita tor personal access code। Kauke share korish na, nile Maya kintu rag korbe। <br>
              <strong style="color: #f43f5e;">Expires in 5 minutes... 💦</strong>
            </p>

            <div style="margin-top: 40px; border-top: 1px solid #2d1b4a; padding-top: 20px;">
              <p style="font-size: 10px; text-transform: uppercase; letter-spacing: 3px; color: #475569; font-weight: 700;">
                Maya AI Protocol v3.1.0
              </p>
            </div>
          </div>
          
          <p style="margin-top: 30px; font-size: 11px; color: #475569;">
            © 2026 Maya AI. All rights reserved for you 🫦.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend Error:", error);
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, id: (data as any)?.id });

  } catch (error) {
    console.error("General API Error:", error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
