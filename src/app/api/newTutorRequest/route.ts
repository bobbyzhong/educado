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
        // Google
        const body = await req.json();
        const { teacherName, chosenName, description, userId, desiredContent } =
            createTutorAPISchema.parse(body);

        try {
            await transporter.sendMail({
                ...mailOptions,
                subject: "Create Tutor Request",
                text: `${teacherName} requested a tutor named ${chosenName}. This is the description: [${description}].
                This is the userId: [${userId}].
                This is the desired content: [${desiredContent}]`,
                html: `<p>${teacherName} requested a tutor named ${chosenName}. This is the description: [${description}].
                This is the userId: [${userId}].
                This is the desired content: [${desiredContent}]</p>`,
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
