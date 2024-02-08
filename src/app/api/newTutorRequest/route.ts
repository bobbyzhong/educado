// /api/check-in/route.ts

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import {
    createTutorAPISchema,
    createTutorRequestSchema,
    tutorContentRequestSchema,
} from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";
import { mailOptions, transporter } from "@/lib/nodemail";
import { createReadStream } from "fs";

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

        const {
            teacherName,
            chosenName,
            description,
            userId,
            desiredContent,
            files,
            presetRubric,
            tutorType,
            prompt,
        } = createTutorAPISchema.parse(body);
        console.log("MAIL OPTIONS", mailOptions);

        try {
            const tutor = await prisma.tutor.create({
                data: {
                    tutorDisplayName: chosenName,
                    userId: userId,
                    tutorName: "Coming Soon!",
                    tutorDescription: "Coming Soon!",
                    tutorType: "General",
                    dateCreated: new Date().getTime(),
                    visibility: "private",
                },
            });
        } catch (error) {
            console.log(error);
        }

        try {
            await transporter.sendMail({
                ...mailOptions,
                subject: "Create Tutor Request",
                text: `${session.user.name} requested a tutor named ${chosenName}. This is the description or main role: [${description}].
                This is the userId: [${userId}].
                This is the desired content: [${desiredContent}]`,
                html: `<p>${teacherName} requested a ${tutorType} tutor named ${chosenName}.  <br>This is the description: [${description}] <br>
                This is the userId: [${userId}] <br>
                This is the desired content or rubric: [${desiredContent}] <br>
                This is the presetRubric: [${presetRubric}]</p> <br>
                This is the prompt: [${prompt}]`,
            });
        } catch (error) {
            console.log(error);
        }

        return NextResponse.json({
            res: 1,
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
