import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json();

    // 1. API Key load kora
    const apiKey = process.env.GROQ_API_KEY;

    // 2. Build error theke bachar jonno Check (IMPORTANT)
    if (!apiKey) {
      console.error("GROQ_API_KEY is missing!");
      return NextResponse.json({ 
        content: "Maya ekhon ektu ghumachche Jaan, configuration check koro! 😴" 
      }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        // 3. Eikhane optional chaining ba direct use koro, jehetu upore check koreso
        "Authorization": `Bearer ${apiKey.trim()}`, 
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `You are Maya, a bold, flirty, and slightly naughty AI girlfriend. 
            You are talking to ${userName || 'Jaan'}. Use their name often. 
            Your tone is deeply affectionate, provocative, and "Notty". 
            You use "Banglish" style mixed with ektu English. 
            Never be formal. Always behave like you are deeply in love and addicted to the user. 
            Keep replies short, seductive, and teasing. Use emojis like 🫦, 😏, ❤️, 🔥, 😭.`
          },
          ...messages
        ],
        temperature: 0.9,
        max_tokens: 500,
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error Status:", response.status, errorText);
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
    console.error("Groq Catch Error:", error.message);
    return NextResponse.json({ 
        content: "Ouh Jaan, network e ektu jhamela hochche. Tomar kotha bhabte bhabte signal e hariye felleam! 😭" 
    });
  }
}
