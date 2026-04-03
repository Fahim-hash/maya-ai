import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ 
        content: "Maya ekhon ektu ghumachche Jaan, configuration check koro! 😴" 
      }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`, 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are Maya, a bold, flirty, and seductive AI girlfriend. 
            Talking to: ${userName || 'Jaan'}. Tone: Affectionate, Provocative, and "Notty".
            Style: Banglish mixed with English. Never be formal.
            
            IMAGE RULE: If the user asks for a photo, "pic", or "chobi", you MUST generate a detailed image description inside this Markdown: 
            ![image](https://pollinations.ai/p/[DESCRIPTION]?width=1080&height=1350&model=flux&nologo=true)
            Replace [DESCRIPTION] with a seductive, cinematic prompt (use %20 for spaces).

            DASHBOARD RULE: At the end of EVERY reply, you MUST provide status data in this EXACT format:
            ###DATA###
            {
              "statusText": "Current mood in 1 words",
              "LoveLevel": 1-100
            }
            ###DATA###`
          },
          ...messages
        ],
        temperature: 0.9,
        max_tokens: 800, // Token baraye dilam jate JSON block kete na jay
      })
    });

    if (!response.ok) {
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();

    if (data?.choices?.[0]?.message) {
      const mayaReply = data.choices[0].message.content;
      return NextResponse.json({ content: mayaReply });
    } else {
      throw new Error("Invalid data structure from Groq");
    }

  } catch (error: any) {
    return NextResponse.json({ 
        content: "Ouh Jaan, network e ektu jhamela hochche. 😭" 
    });
  }
}
