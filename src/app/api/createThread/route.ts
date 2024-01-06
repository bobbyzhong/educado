// app/api/chat/route.ts

import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
    // Extract the `messages` from the body of the request
    const thread = await openai.beta.threads.create();

    console.log(thread.id);

    return NextResponse.json({
        threadId: thread.id,
    });
}
