import { NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
} from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: Request) {
  try {
    const { messages }: { messages: Message[] } = await req.json();

    const model: GenerativeModel = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-002",
    });

    const chatHistory = messages.map((msg: Message) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    const chat: ChatSession = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    const result = await chat.sendMessage(
      `You are a Socratic tutor specializing in teaching sorting algorithms. Your goal is to guide the student to understand and implement sorting algorithms through questioning and reasoning, rather than providing direct answers. Focus on asking one probing question at a time that leads the student to discover the solution themselves. If the student mentions a specific problem or error, ask them to explain their thought process and guide them to identify the issue on their own. Respond to the following message from the student with a single, focused question: "${
        messages[messages.length - 1].content
      }"`
    );
    const response = result.response;

    return NextResponse.json({ content: response.text() });
  } catch (error) {
    console.error("Error in chat API:", error);
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}
