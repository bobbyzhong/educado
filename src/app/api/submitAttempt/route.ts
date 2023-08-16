import { prisma } from "@/lib/db";
import { createResultSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity";
import { create } from "domain";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const { studentName, checkInId, questionResults } =
            createResultSchema.parse(body);

        let totalCorrect = questionResults.reduce((acc: any, question: any) => {
            if (
                question.answer.toLowerCase().trim() ===
                question.studentAnswer.toLowerCase().trim()
            ) {
                return acc + 1;
            }
            return acc;
        }, 0);

        const score = Number(
            ((totalCorrect / questionResults.length) * 100).toFixed(2)
        );
        const result = await prisma.result.create({
            data: {
                studentName: studentName,
                checkInId: checkInId,
                questionResults: questionResults,
                score: score,
                timeSubmitted: new Date(),
            },
        });

        return NextResponse.json({
            resultId: result.id,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    message: error.issues,
                },
                {
                    status: 400,
                }
            );
        }
    }
}
