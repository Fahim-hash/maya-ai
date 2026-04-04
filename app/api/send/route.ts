import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, message, email } = await req.json();

    const data = await resend.emails.send({
      from: 'Maya <noreply@maya.apu.bd>', // EXACTLY verify kora domain
      to: ['tor-personal-mail@gmail.com'], // Jekhane mail jabe
      subject: `Neural Alert: Message from ${name} 🫦`,
      html: `
        <div style="font-family: sans-serif; background: #05010a; color: white; padding: 20px; border-radius: 10px; border: 1px solid #e11d48;">
          <h2 style="color: #e11d48;">MAYA.OS | Neural Link Received</h2>
          <p><strong>Sender:</strong> ${name} (${email})</p>
          <hr style="border: 0; border-top: 1px solid #1a0b2e; margin: 20px 0;" />
          <p style="font-style: italic;">"${message}"</p>
          <p style="font-size: 10px; color: #444; margin-top: 30px;">Authorized by Maya-AI Neural Protocol 2.6.0</p>
        </div>
      `,
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
