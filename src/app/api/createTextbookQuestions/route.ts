import { NextResponse } from "next/server";
import { OpenAI } from "langchain/llms/openai";

import { PineconeClient } from "@pinecone-database/pinecone";
import { ZodError } from "zod";
import { textbookCheckInSchema } from "@/schemas/form/quiz";
import { embedInputAndQueryLLM } from "../../../../documentsOld/utils";
import { indexName } from "../../../../config";

// POST /api/questions
export const POST = async (req: Request, res: Response) => {
    const demo = `{"questions": [
    {"question": "What was the main staple crop of Native American civilizations in Mexico and South America?", 
     "answer": "Maize", 
     "option1": "Potatoes", 
     "option2": "Yams", 
     "option3": "Lima beans"},
     
    {"question": "Which European country had established settlements in the modern Southwest, including Texas and California, before the British arrived in the New World?", 
     "answer": "Spain", 
     "option1": "France", 
     "option2": "Dutch", 
     "option3": "Swedish"},
     
    {"question": "What was the name of the Native American Confederacy in the northeastern woodlands that developed political and organizational skills to sustain a military alliance?", 
     "answer": "Iroquois", 
     "option1": "Choctaw", 
     "option2": "Creek", 
     "option3": "Cherokee"}
]}`;

    try {
        const body = await req.json();

        const { amount, topic, type, textbook, chapters } =
            textbookCheckInSchema.parse(body);

        const client = new PineconeClient();
        await client.init({
            apiKey: process.env.PINECONE_API_KEY || "",
            environment: process.env.PINECONE_ENVIRONMENT || "",
        });

        const text = await embedInputAndQueryLLM(client, indexName, body);

        // const text = demo;

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
