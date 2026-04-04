import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();

    // Destructure data and error from Resend response
    const { data, error } = await resend.emails.send({
      from: 'Maya Auth <auth@maya.apu.bd>', // Make sure this domain is verified in Resend!
      to: [email],
      subject: `${otpCode} is your Maya Verification Code 🫦`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; background: #0d0216; color: white; border-radius: 20px;">
          <h1 style="color: #f43f5e;">Your OTP: ${otpCode}</h1>
          <p style="color: #fda4af;">Expires in 5 mins... 🫦</p>
          <p style="font-size: 10px; color: rgba(255,255,255,0.2);">Neural Identity Verification Required.</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    // Using 'as any' to bypass the 'id' property check during build
    return NextResponse.json({ 
      success: true, 
      id: (data as any)?.id 
    });

  } catch (error) {
    console.error("Resend Error:", error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
