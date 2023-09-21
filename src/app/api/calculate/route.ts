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
                id: "clmrx4qja0001jw08ch6j9ult",
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
                    "What is the term for materials that allow some light to pass through but scatter it in different directions?"
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
