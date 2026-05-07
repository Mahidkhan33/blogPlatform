import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { topic, tone, keyPoints } = await req.json();
    if (!topic) {
      return NextResponse.json({ message: "Topic is required" }, { status: 400 });
    }
    const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
    const prompt = `
      Act as a professional tech blogger and content strategist. 
      Generate a blog post based on the following:
      - Topic: ${topic}
      - Tone: ${tone}
      - Key Points to include: ${keyPoints || "General overview and best practices"}
      The output must be a valid JSON object with the following keys:
      - "title": A catchy, SEO-friendly title.
      - "excerpt": A brief, compelling summary (1-2 sentences).
      - "content": The full blog post content in clean HTML format. Use <h2> and <h3> for headings, <p> for paragraphs, and <ul>/<li> for lists. Do not include <html> or <body> tags.
      - "tags": An array of 3-5 relevant tag strings (e.g., ["technology", "ai", "web"]).
      IMPORTANT: Return ONLY the JSON object. No markdown code blocks, no preamble.
    `;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    try {
      const jsonResponse = JSON.parse(cleanedText);
      return NextResponse.json(jsonResponse);
    } catch (parseError) {
      console.error("AI Response Parse Error:", text);
      return NextResponse.json({ 
        message: "Failed to parse AI response", 
        raw: text 
      }, { status: 500 });
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
