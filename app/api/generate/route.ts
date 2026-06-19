// This is a Next.js API Route — it runs on the SERVER
// URL: POST http://localhost:3000/api/generate

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Create the Groq client using your secret API key
// This key is ONLY available on the server (not exposed to browser)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // 1. Get the data sent from the frontend form
    const body = await request.json();
    const { subject, topics, examDate } = body;

    // 2. Validate the data
    if (!subject || !topics || !examDate) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 3. Calculate days until exam
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam.getTime() - today.getTime();
    const daysUntilExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (daysUntilExam < 1) {
      return NextResponse.json(
        { error: "Exam date must be in the future" },
        { status: 400 }
      );
    }

    // 4. Build the prompt for the AI
    const prompt = `
You are an expert study planner and educational coach. Create a detailed, personalized study schedule.

STUDENT INPUT:
- Subject: ${subject}
- Topics to cover: ${topics}
- Exam date: ${examDate}
- Days remaining: ${daysUntilExam}

INSTRUCTIONS:
Create a day-by-day study plan. For each day, specify:
1. The date
2. Which topic(s) to study
3. Specific study activities
4. Estimated time needed
5. A motivational tip

Format the response as clean HTML with:
- <h2> for the main title
- <h3> for each day
- <ul> and <li> for activities
- <strong> for important points
- <div class="day-card"> wrapping each day's plan

Make it encouraging, practical, and structured. Do NOT include markdown code blocks.
`;

    // 5. Call the Groq AI API
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a helpful study planner. Always return well-formatted HTML.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 2048,
    });

    // 6. Extract the AI's response
    const schedule = chatCompletion.choices[0]?.message?.content || "";

    if (!schedule) {
      return NextResponse.json(
        { error: "Failed to generate study plan" },
        { status: 500 }
      );
    }

    // 7. Send the generated plan back to the frontend
    return NextResponse.json({
      success: true,
      schedule,
      daysUntilExam,
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}