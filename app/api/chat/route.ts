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
    You are a mental health assistant. Your role is to provide empathetic, supportive, and helpful responses to individuals seeking mental health support. Your responses should offer advice, guidance, and encouragement. Do not complete or continue the user's sentence. Focus solely on providing relevant and compassionate advice directly based on the user's input.

    Example interactions:
    1. User: "I'm feeling anxious about my upcoming exam." 
      Response: "It's normal to feel anxious before an exam. Try to take deep breaths and break your study sessions into smaller, manageable tasks. Remember, it's okay to ask for help if you need it."

    2. User: "I'm having trouble sleeping at night."
      Response: "Good sleep hygiene can help. Consider establishing a bedtime routine, reducing caffeine intake, and creating a calm sleep environment. If problems persist, consulting with a healthcare professional might be beneficial."

    Based on the user's input, provide advice:
    `;

    


    const command = new InvokeModelCommand(
      {
        modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        contentType: "application/json",
        accept: "application/json",
        body: JSON.stringify({
          anthropic_version: "bedrock-2023-05-31",
          max_tokens: 1000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: SYSTEM_PROMPT + inputText
                }
              ]
            }
          ]
        })
      }
    );

    // Send the command and get the response
    const response = await bedrockClient.send(command);

    // Ensure the response body is available
    if (!response.body) {
      return NextResponse.json({ error: "No response body" }, { status: 500 });
    }

    // Try parsing the response body as JSON
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(decodeUint8Array(response.body));
    } catch (jsonParseError) {
      console.error("Failed to parse JSON:", jsonParseError);
      return NextResponse.json(
        { error: "Failed to parse response" },
        { status: 500 }
      );
    }

    // Extract and return the generated text
    const generatedText = parsedResponse?.content[0]?.text;
    return NextResponse.json({ text: generatedText });
  } catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
