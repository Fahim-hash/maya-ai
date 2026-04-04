import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, otpCode } = await req.json();

  try {
    const data = await resend.emails.send({
      from: 'Maya Auth <auth@maya.apu.bd>',
      to: [email],
      subject: `${otpCode} is your Maya Verification Code 🫦`,
      // OTP Template
      html: `<h1>Your OTP: ${otpCode}</h1><p>Expires in 5 mins... 🫦</p>`,
    });

    return NextResponse.json({ success: true, id: data.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
