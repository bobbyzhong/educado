import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const latestQuestion = body.question;
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(currentDate.getDate()).padStart(2, "0");
        const hours = String(currentDate.getHours()).padStart(2, "0");
        const minutes = String(currentDate.getMinutes()).padStart(2, "0");
        const seconds = String(currentDate.getSeconds()).padStart(2, "0");

        const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

        try {
            await prisma.tutorQuestions.create({
                data: {
                    question: latestQuestion,
                    studentName: body.studentName,
                    tutorId: body.tutorId,
                    date: formattedDateTime,
                },
            });
            console.log("LOGGED QUESTION");
        } catch (e) {
            console.log("ERROR: ", e);
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
