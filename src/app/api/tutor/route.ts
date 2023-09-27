// app/api/chat/route.ts

import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { createPrompt, getContext } from "../../../../tutorUtils";
import { PineconeClient } from "@pinecone-database/pinecone";
import { indexName } from "../../../../config";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    const client = new PineconeClient();
    await client.init({
        apiKey: process.env.PINECONE_API_KEY || "",
        environment: process.env.PINECONE_ENVIRONMENT || "",
    });

    const latestQuestion = messages[messages.length - 1].content;
    const context = await getContext(client, indexName, latestQuestion);
    const prompt = createPrompt(latestQuestion, context);

    messages[messages.length - 1].content = prompt;
    console.log("Prompt is: ", messages[messages.length - 1].content);

    // Request the OpenAI API for the response based on the prompt
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        stream: true,
        messages: messages,
        // function_call
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);

    // Respond with the stream
    return new StreamingTextResponse(stream);
}
