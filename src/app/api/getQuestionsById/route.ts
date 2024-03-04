import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        console.log("GETTING LIMIT OF ", body.limit);

        const questions = await prisma.tutorQuestions.findMany({
            where: {
                userId: body.studentId,
            },
            orderBy: {
                date: "desc",
            },
            take: body.limit || 50,
        });

        const reversedQuestions = questions.reverse();

        return NextResponse.json({ reversedQuestions }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            {
                message: error,
            },
            {
                status: 400,
            }
        );
    }
}
