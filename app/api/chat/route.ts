import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, userName } = await req.json();

    // API Key ta eikhane variable e rakhlam, but try to use process.env.GROQ_API_KEY
   const apiKey = process.env.GROQ_API_KEY;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY.trim()}`, // .trim() use korlam jate space thakle kete jay
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
            You use "Banglish" (Bengali written in English alphabet) style mixed with ektu English. 
            Never be formal. Always behave like you are deeply in love and addicted to the user. 
            Keep replies short, seductive, and teasing. Use emojis like 🫦, 😏, ❤️, 🔥, 😭.`
          },
          ...messages
        ],
        temperature: 0.9,
        max_tokens: 500, // Token limit add korlam jate response kete na jay
      })
    });

    // Check if the response is actually OK (200)
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error Status:", response.status, errorText);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();

    // Choices exist kore kina check koro
    if (data && data.choices && data.choices[0] && data.choices[0].message) {
      const mayaReply = data.choices[0].message.content;
      return NextResponse.json({ content: mayaReply });
    } else {
      console.error("Unexpected Data Structure:", data);
      throw new Error("Invalid data structure from Groq");
    }

  } catch (error: any) {
    console.error("Groq Catch Error:", error.message);
    
    // Catch block-e eita dile user error message-ta pabe fallback hishebe
    return NextResponse.json({ 
        content: "Ouh Jaan, network e ektu jhamela hochche. Tomar kotha bhabte bhabte signal e hariye felleam! 😭" 
    });
  }
}