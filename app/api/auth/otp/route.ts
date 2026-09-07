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
      subject: `Ticket Confirmation For THE WEEKEND ASIA TOUR 26' Singapor`,
      html: `
       <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Souvenir Ticket — The Weeknd, Singapore</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,340;9..144,480;9..144,600&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --void:#0b0710;
    --panel-1:#181021;
    --panel-2:#0f0a16;
    --blood:#ff5f6f;
    --dusk:#8b7ae0;
    --paper:#f4eee5;
    --muted:#ada2b8;
    --hairline:rgba(244,238,229,0.16);
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;}
  body{
    min-height:100vh;
    background:var(--void);
    font-family:'Space Grotesk',sans-serif;
    color:var(--paper);
    display:flex;
    align-items:center;
    justify-content:center;
    padding:56px 18px;
    position:relative;
    overflow-x:hidden;
  }
  .glow{
    position:absolute;
    border-radius:50%;
    filter:blur(100px);
    z-index:0;
    pointer-events:none;
  }
  .glow-a{ width:460px; height:460px; top:-220px; left:-120px; background:radial-gradient(circle, var(--dusk) 0%, transparent 72%); opacity:0.32; }
  .glow-b{ width:480px; height:480px; bottom:-220px; right:-140px; background:radial-gradient(circle, var(--blood) 0%, transparent 72%); opacity:0.26; }

  .stage{
    position:relative;
    z-index:1;
    width:100%;
    max-width:420px;
    animation:riseIn 0.7s cubic-bezier(.16,.9,.35,1) both;
  }
  @media (prefers-reduced-motion: reduce){
    .stage{ animation:none; }
  }
  @keyframes riseIn{
    from{ opacity:0; transform:translateY(14px); }
    to{ opacity:1; transform:translateY(0); }
  }

  .stamp{
    position:absolute;
    top:-18px;
    right:-16px;
    z-index:3;
    width:112px;
    height:112px;
    transform:rotate(11deg);
  }
  .stamp svg{ width:100%; height:100%; display:block; }

  .ticket{
    background:linear-gradient(175deg, var(--panel-1), var(--panel-2));
    border:1px solid var(--hairline);
    border-radius:18px;
    box-shadow:0 40px 80px -30px rgba(0,0,0,0.7);
  }

  .t-top{ padding:38px 30px 26px; }
  .artist{
    font-family:'Fraunces',serif;
    font-weight:480;
    font-size:44px;
    line-height:0.98;
    margin:0 0 8px;
    color:var(--paper);
  }
  .tour{
    font-size:14.5px;
    color:var(--muted);
    margin:0 0 28px;
  }

  .meta-grid{
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:20px 20px;
  }
  .meta-grid .full{ grid-column:1 / -1; }
  .m-label{ font-size:11.5px; color:var(--muted); margin:0 0 4px; }
  .m-value{ font-size:15px; color:var(--paper); margin:0; font-weight:500; }
  .m-value.big{ font-size:17px; }
  .m-sub{ color:var(--muted); font-weight:400; font-size:13px; margin:3px 0 0; }

  .perf{
    position:relative;
    height:0;
    border-top:2px dashed rgba(244,238,229,0.22);
    margin:32px 0 0;
  }
  .notch{
    position:absolute;
    top:-11px;
    width:22px;
    height:22px;
    border-radius:50%;
    background:var(--void);
  }
  .notch.l{ left:-11px; }
  .notch.r{ right:-11px; }

  .t-bottom{
    padding:24px 30px 30px;
    display:flex;
    align-items:flex-end;
    justify-content:space-between;
    gap:20px;
  }
  .attendee .m-label:nth-of-type(2){ margin-top:14px; }

  .barcode{
    display:flex;
    gap:2px;
    align-items:flex-end;
    height:34px;
    flex-shrink:0;
  }
  .barcode span{ display:block; width:2px; background:var(--muted); opacity:0.5; }

  .note{
    margin-top:22px;
    text-align:center;
    font-size:12.5px;
    line-height:1.65;
    color:var(--muted);
    padding:0 10px;
  }

  @media (max-width:420px){
    .artist{ font-size:36px; }
    .t-top{ padding:32px 22px 22px; }
    .t-bottom{ padding:22px 22px 26px; }
  }
</style>
</head>
<body>
  <div class="glow glow-a"></div>
  <div class="glow glow-b"></div>

  <div class="stage">
    

    <div class="ticket">
      <div class="t-top">
        <h1 class="artist">The Weeknd</h1>
        <p class="tour">After Hours Til Dawn Tour · Asia 2026</p>

        <div class="meta-grid">
          <div class="full">
            <p class="m-label">Venue</p>
            <p class="m-value big">Singapore National Stadium</p>
            <p class="m-sub">1 Stadium Drive, Singapore</p>
          </div>
          <div>
            <p class="m-label">Date</p>
            <p class="m-value">Fri, 2 Oct 2026</p>
          </div>
          <div>
            <p class="m-label">Show time</p>
            <p class="m-value">8:00 PM SGT</p>
          </div>
          <div class="full">
            <p class="m-label">Line-up</p>
            <p class="m-value">The Weeknd, Creepy Nuts</p>
          </div>
        </div>
      </div>

      <div class="perf">
        <span class="notch l"></span>
        <span class="notch r"></span>
      </div>

      <div class="t-bottom">
        <div class="attendee">
          <p class="m-label">Held for</p>
          <p class="m-value">Syed Fahim Muddasir</p>
          <p class="m-label">Ticket type</p>
          <p class="m-value">CAT 1 · Standing Pen</p>
        </div>
        <div class="barcode" aria-hidden="true" id="barcode"></div>
      </div>
    </div>

    <p class="note">Real tickets for this show go through Ticketmaster SG.</p>
  </div>

  <script>
    var bc = document.getElementById('barcode');
    var widths = [2,4,2,2,6,2,4,2,2,2,6,4,2,2,2,4,2,6,2,2];
    widths.forEach(function(w){
      var bar = document.createElement('span');
      bar.style.width = w + 'px';
      bar.style.height = (16 + Math.random()*18) + 'px';
      bc.appendChild(bar);
    });
  </script>
</body>
</html>
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
