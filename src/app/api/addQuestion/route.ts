import { prisma } from "@/lib/db";
import { editQuestionSchema, newQuestionSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const { checkInId, question, answer, option2, option3, option4 } =
            newQuestionSchema.parse(body);

        const options = [answer, option2, option3, option4];
        const jsonOptions = JSON.stringify(options);

        try {
            await prisma.question.create({
                data: {
                    checkInId,
                    question,
                    answer,
                    options: jsonOptions,
                    questionType: "mcq",
                },
            });
        } catch (e) {
            console.log(e);
        }

        return NextResponse.json(
            {
                data: "added",
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
