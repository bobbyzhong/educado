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

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    let body = await req.json();

    const assistant = await openai.beta.assistants.retrieve(body.assistantId);

    const message = await openai.beta.threads.messages.create(body.threadId, {
        role: "user",
        content: body.studentQuestion,
    });

    const run = await openai.beta.threads.runs.create(body.threadId, {
        assistant_id: assistant.id,
    });

    let runStatus = await openai.beta.threads.runs.retrieve(
        body.threadId,
        run.id
    );

    while (runStatus.status !== "completed") {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("Here");
        runStatus = await openai.beta.threads.runs.retrieve(
            body.threadId,
            run.id
        );
    }

    const messages = await openai.beta.threads.messages.list(body.threadId);

    const lastMessageForRun: any = messages.data
        .filter(
            (message: any) =>
                message.run_id === run.id && message.role === "assistant"
        )
        .pop();

    if (lastMessageForRun) {
        console.log(lastMessageForRun.content[0].text);
        try {
            console.log("ABT THE CALL");
            console.log("BODY", body);
            await fetch(`${process.env.API_URL}/api/logTutorQuestion`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question: body.studentQuestion,
                    studentName: body.studentName,
                    tutorId: body.tutorId,
                    userId: body.userId,
                    answer: lastMessageForRun.content[0].text.value,
                }),
            });
        } catch (e) {
            console.log("ERROR: ", e);
        }
    }

    return NextResponse.json({
        message: lastMessageForRun.content[0].text.value,
    });
}
