// app/api/chat/route.ts

import OpenAI from "openai";
import { JSONValue, OpenAIStream, StreamingTextResponse } from "ai";
import {
    createPrompt,
    functions,
    getContext,
    runFunction,
} from "../../../../tutorUtils";
import { PineconeClient } from "@pinecone-database/pinecone";
import { indexName } from "../../../../config";
import { NextResponse } from "next/server";

export const runtime = "edge";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    let body = await req.json();

    const assistant = await openai.beta.assistants.create({
        name: "Warren Buffet",
        instructions:
            "You are Warren Buffet and you are tutoring a 6th grade student in financial responsibility.",

        model: "gpt-3.5-turbo-1106",
    });

    console.log("Assistant created! ");

    const thread = await openai.beta.threads.create({
        messages: body.messages,
    });

    const run = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant.id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);

    while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    const messages = await openai.beta.threads.messages.list(thread.id);

    const lastMessageForRun: any = messages.data
        .filter(
            (message: any) =>
                message.run_id === run.id && message.role === "assistant"
        )
        .pop();

    if (lastMessageForRun) {
        console.log(lastMessageForRun.content[0].text);
    }

    const stream = OpenAIStream(lastMessageForRun, {});

    return new StreamingTextResponse(stream);
}
