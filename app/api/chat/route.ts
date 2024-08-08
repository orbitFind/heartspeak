import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import model from '@/app/lib/gemini';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: NextRequest) {
  try {
    // // returns an array of messages from the request body
    // const messages = await request.json();

    // // Validate that messages is an array
    // if (!Array.isArray(messages)) {
    //   return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    // }

    const body = await request.text();

    const result = await model.generateContent(body);
    const response = await result.response;
    const generatedText = response.text();
    
    return NextResponse.json(generatedText);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}