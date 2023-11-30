import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";

import { PineconeClient } from "@pinecone-database/pinecone";
import { ZodError } from "zod";
import { textbookCheckInSchema } from "@/schemas/form/quiz";
import { customEmbedInputAndQueryLLM } from "../../../../utils";
import { indexName } from "../../../../config";

// POST /api/questions
export const POST = async (req: Request, res: Response) => {
    try {
        const body = await req.json();
        const client = new PineconeClient();
        await client.init({
            apiKey: process.env.PINECONE_API_KEY || "",
            environment: process.env.PINECONE_ENVIRONMENT || "",
        });

        const text = await customEmbedInputAndQueryLLM(client, indexName, body);

        text.replace(/(\w)"(\w)/g, "$1'$2");
        let resObj = JSON.parse(text);

        let questions = resObj.questions;

        return NextResponse.json(
            {
                questions,
            },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    error: error.issues,
                },
                {
                    status: 400,
                }
            );
        }
    }
};
