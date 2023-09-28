// app/api/chat/route.ts

import OpenAI from "openai";
import { JSONValue, OpenAIStream, StreamingTextResponse } from "ai";
import {
    createPrompt,
    detectEmotionalIssues,
    functions,
    getContext,
} from "../../../../tutorUtils";
import { PineconeClient } from "@pinecone-database/pinecone";
import { indexName } from "../../../../config";
import fs from "fs";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    let { messages } = await req.json();

    const client = new PineconeClient();
    await client.init({
        apiKey: process.env.PINECONE_API_KEY || "",
        environment: process.env.PINECONE_ENVIRONMENT || "",
    });

    const latestQuestion = messages[messages.length - 1].content;

    const context = await getContext(client, indexName, latestQuestion);
    // console.log("CONTEXT: ", context);
    const prompt = createPrompt(latestQuestion, context);

    messages[messages.length - 1].content = prompt;
    messages = messages.slice(-5);
    // Request the OpenAI API for the response based on the prompt
    console.log("LENGHT OF MESSAGES: ", messages.length);
    console.log(messages);
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-0613",
        stream: true,
        messages: messages,
        functions: functions,
        function_call: "auto",
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response, {
        experimental_onFunctionCall: async (
            { name, arguments: args },
            createFunctionCallMessages
        ) => {
            // if you skip the function call and return nothing, the `function_call`
            // message will be sent to the client for it to handle
            if (name === "detectEmotionalIssues") {
                // Call a weather API here
                console.log("ARGs: ", args);

                // `createFunctionCallMessages` constructs the relevant "assistant" and "function" messages for you
                return openai.chat.completions.create({
                    messages: [...messages],
                    stream: true,
                    model: "gpt-3.5-turbo-0613",
                    // see "Recursive Function Calls" below
                });
            }
        },
    });

    // Respond with the stream
    return new StreamingTextResponse(stream);
}
