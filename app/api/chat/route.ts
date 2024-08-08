import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, GenerateContentRequest } from '@google/generative-ai';
import model from '@/app/lib/gemini';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(request: Request) {
  try {
    // returns an array of messages from the request body
    const messages = await request.json();

    // Validate that messages is an array
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const result = await model.generateContent(messages.join('\n'));
    const response = await result.response;
    const generatedText = response.text;


    const stream = new ReadableStream({
        async start(controller) {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of result.stream()) {
                    const content = encoder.encode(chunk);
                    controller.enqueue(content);
                }
            } catch (error) {
                controller.error(error);
            } finally {
                controller.close();
            }
        }});
    

    return NextResponse.json(stream);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}