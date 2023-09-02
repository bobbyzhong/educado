import { prisma } from "@/lib/db";
import { editQuestionSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const questionId = body.questionId;

        try {
            await prisma.question.delete({
                where: { id: questionId },
            });
        } catch (e) {
            console.log(e);
        }

        return NextResponse.json(
            {
                data: "deleted",
            },
            { status: 200 }
        );
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
