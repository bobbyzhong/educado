// /api/check-in/route.ts

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { quizCreationSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";
import { PineconeClient } from "@pinecone-database/pinecone";

function generateRandomCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let code = "";

    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters[randomIndex];
    }

    return code;
}

export async function POST(req: Request, res: Response) {
    try {
        const session = await getAuthSession();
        if (!session?.user) {
            return NextResponse.json(
                {
                    error: "You must be logged in",
                },
                {
                    status: 401,
                }
            );
        }
        const body = await req.json();
        const { title, amount, topic, type, context, standard } =
            quizCreationSchema.parse(body);

        const getCheckInCode: any = async () => {
            const code = generateRandomCode();
            const sameCodes = await prisma.checkIn.findMany({
                where: {
                    code: code,
                },
            });
            if (sameCodes.length > 0) {
                return getCheckInCode();
            }
            return code;
        };
        const code = await getCheckInCode();

        const checkIn = await prisma.checkIn.create({
            data: {
                title: title,
                checkInType: type,
                timeStarted: new Date(),
                userId: session.user.id,
                topic,
                standard,
                contentSource: "plain content",
                code: code,
            },
        });

        const { data } = await axios.post(
            `${process.env.API_URL}/api/questions`,
            {
                amount,
                topic,
                type,
                context,
                standard,
            }
        );

        if (type == "mcq") {
            type mcqQuestion = {
                question: string;
                answer: string;
                option1: string;
                option2: string;
                option3: string;
            };
            let manyData = data.questions.map((question: mcqQuestion) => {
                let options = [
                    question.answer,
                    question.option1,
                    question.option2,
                    question.option3,
                ];
                options = options.sort(() => Math.random() - 0.5);
                return {
                    question: question.question,
                    answer: question.answer,
                    options: JSON.stringify(options),
                    checkInId: checkIn.id,
                    questionType: "mcq",
                };
            });
            await prisma.question.createMany({
                data: manyData,
            });
        } else if (type === "open_ended") {
            type openQuestion = {
                question: string;
                answer: string;
            };
            let manyData = data.questions.map((question: openQuestion) => {
                return {
                    question: question.question,
                    answer: question.answer,
                    checkInId: checkIn.id,
                    questionType: "open_ended",
                };
            });

            await prisma.question.createMany({
                data: manyData,
            });
        }

        return NextResponse.json({
            checkInId: checkIn.id,
        });
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
