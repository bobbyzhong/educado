import { prisma } from "@/lib/db";
import { checkAnswerSchema } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { compareTwoStrings } from "string-similarity";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        console.log("HERE ", body.studentName);

        // const { studentName, checkInId, questionResults } = JSON.parse(body);

        const result = await prisma.result.create({
            data: {
                studentName: body.studentName,
                checkInId: body.checkInId,
                questionResults: body.questionResults,
            },
        });

        return NextResponse.json(result);
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
