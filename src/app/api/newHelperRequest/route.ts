// /api/check-in/route.ts

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import {
    createHelperAPISchema,
    createHelperSchema,
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

        const generateRandomCode = () => {
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var code = "";
            for (var i = 0; i < 5; i++) {
                var randomIndex = Math.floor(Math.random() * characters.length);
                code += characters[randomIndex];
            }
            return code;
        };

        const { chosenName, subject, userId } =
            createHelperAPISchema.parse(body);
        console.log("MAIL OPTIONS", mailOptions);

        try {
            const tutor = await prisma.tutor.create({
                data: {
                    tutorDisplayName: chosenName,
                    joinCode: generateRandomCode(),
                    userId: userId,
                    tutorName: "none_needed",
                    tutorDescription: `I'm a homework helper for ${subject}!`,
                    tutorType: "General",
                    dateCreated: new Date().getTime(),
                    visibility: "private",
                    isHomework: true,
                    subject: subject,
                },
            });
        } catch (error) {
            console.log(error);
        }

        try {
            await transporter.sendMail({
                ...mailOptions,
                subject: "Create Helper Request",
                text: `${session.user.name} requested a helper named ${chosenName}.`,
                html: `<p>${session.user.name} requested helper named ${chosenName}. `,
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
