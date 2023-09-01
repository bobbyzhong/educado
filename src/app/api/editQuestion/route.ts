import { prisma } from "@/lib/db";
import { editQuestionSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const { questionId, answer, question, option2, option3, option4 } =
            editQuestionSchema.parse(body);

        const options = [answer, option2, option3, option4];
        const jsonOptions = JSON.stringify(options);

        try {
            await prisma.question.update({
                where: { id: questionId },
                data: {
                    answer: answer,
                    question: question,
                    options: jsonOptions,
                },
            });
        } catch (e) {
            console.log(e);
        }

        return NextResponse.json(
            {
                data: "updated",
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
