import { Resend } from 'resend';
import { NextResponse } from 'next/server';
import { db } from '@/firebase'; 
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, otpCode } = await req.json();

    // 1. SAVE TO FIRESTORE
   

    // 2. SEND VIA RESEND
    const { data, error } = await resend.emails.send({
      from: 'Maya Auth <auth@maya.apu.bd>', // Comma fix kora hoise eikhane
      to: [email],
      subject: `Ticket Confirmation For THE WEEKEND ASIA TOUR 26' Singapor`,
      html: `
      <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Souvenir Ticket — The Weeknd, Singapore</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0710; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;">
  
  <!-- Outer Wrapper Table -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #0b0710; table-layout: fixed;">
    <tr>
      <td align="center" style="padding: 40px 15px;">
        
        <!-- Main Ticket Container (Width capped for desktop, responsive on mobile) -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 420px; background-color: #140d1c; border: 1px solid rgba(244,238,229,0.16); border-radius: 16px; overflow: hidden; color: #f4eee5;">
          
          <!-- Ticket Header / Top Section -->
          <tr>
            <td style="padding: 36px 30px 24px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-family: Georgia, 'Times New Roman', serif; font-size: 38px; line-height: 42px; font-weight: bold; color: #f4eee5; padding-bottom: 6px;">
                    The Weeknd
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 14px; line-height: 18px; color: #ada2b8; padding-bottom: 24px;">
                    After Hours Til Dawn Tour · Asia 2026
                  </td>
                </tr>
              </table>

              <!-- Venue Section -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ada2b8; padding-bottom: 4px;">
                    Venue
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 17px; line-height: 22px; font-weight: bold; color: #f4eee5;">
                    Singapore National Stadium
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 13px; line-height: 16px; color: #ada2b8; padding-top: 2px;">
                    1 Stadium Drive, Singapore
                  </td>
                </tr>
              </table>

              <!-- Date & Time Row -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom: 16px;">
                <tr>
                  <td width="50%" valign="top" style="padding-right: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ada2b8; padding-bottom: 4px;">
                          Date
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 15px; font-weight: bold; color: #f4eee5;">
                          Fri, 2 Oct 2026
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td width="50%" valign="top" style="padding-left: 10px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ada2b8; padding-bottom: 4px;">
                          Show Time
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 15px; font-weight: bold; color: #f4eee5;">
                          8:00 PM SGT
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Line-up Section -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ada2b8; padding-bottom: 4px;">
                    Line-up
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 15px; font-weight: bold; color: #f4eee5;">
                    The Weeknd, Creepy Nuts
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Perforated Divider Line -->
          <tr>
            <td style="padding: 0 20px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td style="border-bottom: 2px dashed rgba(244,238,229,0.22); font-size: 0; line-height: 0; height: 1px;">
                    &nbsp;
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Ticket Bottom Section -->
          <tr>
            <td style="padding: 24px 30px 30px 30px;">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td valign="bottom">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                        <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ada2b8; padding-bottom: 4px;">
                          Held for
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 15px; font-weight: bold; color: #f4eee5; padding-bottom: 12px;">
                          Zaima Akter
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #ada2b8; padding-bottom: 4px;">
                          Ticket type
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size: 15px; font-weight: bold; color: #f4eee5;">
                          CAT 1 · Standing Pen
                        </td>
                      </tr>
                    </table>
                  </td>
                  
                  <!-- Static Email-Safe Barcode -->
                  <td width="100" align="right" valign="bottom">
                    <img src="https://bwipjs-api.metafloor.com/generator?bcid=code128&text=WEEKND2026&scale=2&height=12&inkcolor=ada2b8" width="96" height="40" alt="Barcode" style="display: block; border: 0; filter: alpha(opacity=60); opacity: 0.6;" />
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
        <!-- End Ticket Container -->

        <!-- Footer Note -->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 420px; margin-top: 18px;">
          <tr>
            <td align="center" style="font-size: 12px; line-height: 18px; color: #ada2b8;">
              Real tickets for this show go through Ticketmaster SG.
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

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
