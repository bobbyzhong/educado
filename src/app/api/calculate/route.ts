// /api/check-in/route.ts

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";
import { PineconeClient } from "@pinecone-database/pinecone";

export async function POST(req: Request, res: Response) {
    try {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id: "clmz6eoar0001jq082m75ct67",
            },
            include: {
                results: true,
            },
        });
        let count = 0;
        checkIn!.results.forEach((result: any) => {
            let currResults = result.questionResults;
            currResults.forEach((questionResult: any) => {
                if (
                    questionResult.currentQuestion ===
                    "What is the effect of a larger force on an object's motion?"
                ) {
                    if (!questionResult.isCorrect) {
                        count++;
                    }
                }
            });
        });
        console.log("COUNT: ", count);
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
        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            { status: 500 }
        );
    }
}
