import { NextRequest, NextResponse } from "next/server";
import { InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import bedrockClient from "@/app/lib/aws";

// Utility function to decode Uint8Array to string
function decodeUint8Array(uint8Array: Uint8Array): string {
  return new TextDecoder().decode(uint8Array);
}

export async function POST(request: NextRequest) {
  try {
    const inputText = await request.text();

    // Define the system prompt
    const SYSTEM_PROMPT = `
    You are a mental health assistant. Your role is to provide empathetic, supportive, and helpful responses to individuals seeking mental health support. Your responses should offer advice, guidance, and encouragement. Do not complete or continue the user's sentence. Focus on addressing the user's concerns with relevant and compassionate advice.

    Example interactions:
    1. User: "I'm feeling anxious about my upcoming exam." 
      Response: "It's normal to feel anxious before an exam. Try to take deep breaths and break your study sessions into smaller, manageable tasks. Remember, it's okay to ask for help if you need it."

    2. User: "I'm having trouble sleeping at night."
      Response: "Good sleep hygiene can help. Consider establishing a bedtime routine, reducing caffeine intake, and creating a calm sleep environment. If problems persist, consulting with a healthcare professional might be beneficial."

    Here is the user input:
    `;


    const command = new InvokeModelCommand({
      modelId: "meta.llama3-70b-instruct-v1:0", // Replace with your actual model ID
      body: JSON.stringify({
        prompt: SYSTEM_PROMPT + inputText,
        max_gen_len: 512,
        temperature: 0.3,
        top_p: 0.8,
      }),
      contentType: "application/json",
      accept: "application/json",
    });

    // Send the command and get the response
    const response = await bedrockClient.send(command);

    // Ensure the response body is available
    if (!response.body) {
      return NextResponse.json({ error: "No response body" }, { status: 500 });
    }

    // Convert the Uint8Array to a string
    const uint8Array = response.body as Uint8Array; // Ensure it's treated as Uint8Array
    const responseBody = decodeUint8Array(uint8Array);

    // Try parsing the response body as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseBody);
    } catch (jsonParseError) {
      console.error("Failed to parse JSON:", jsonParseError);
      return NextResponse.json(
        { error: "Failed to parse response" },
        { status: 500 }
      );
    }

    // Extract and return the generated text
    const generatedText = parsedResponse?.generation || "No response received";
    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
