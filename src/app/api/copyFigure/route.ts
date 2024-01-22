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

        const generateRandomCode = () => {
            var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var code = "";
            for (var i = 0; i < 5; i++) {
                var randomIndex = Math.floor(Math.random() * characters.length);
                code += characters[randomIndex];
            }
            return code;
        };

        const {
            tutorDisplayName,
            tutorName,
            tutorDescription,
            tutorType,
            placeholderQs,
            basePrompt,
            uploadedContent,
            userId,
            userName,
        } = await req.json();
        console.log(tutorDisplayName);

        try {
            const newTutor = await prisma.tutor.create({
                data: {
                    joinCode: generateRandomCode(),
                    userId: userId,
                    tutorDisplayName: tutorDisplayName,
                    tutorName: tutorName,
                    tutorDescription: tutorDescription,
                    tutorType: tutorType,
                    placeholderQs: placeholderQs,
                    basePrompt: basePrompt,
                    dateCreated: new Date().getTime(),
                    visibility: "private",
                    uploadedContent: uploadedContent,
                    ownerName: userName,
                },
            });
            console.log("CREATED NEW TUTOR", newTutor);
            return NextResponse.json(
                {
                    tutorId: newTutor.id,
                },
                { status: 200 }
            );
        } catch (e) {
            console.log(e);
            const newTutor = await prisma.tutor.create({
                data: {
                    joinCode: generateRandomCode(),
                    userId: userId,
                    tutorDisplayName: tutorDisplayName,
                    tutorName: tutorName,
                    tutorDescription: tutorDescription,
                    tutorType: tutorType,
                    placeholderQs: placeholderQs,
                    basePrompt: basePrompt,
                    dateCreated: new Date().getTime(),
                    visibility: "private",
                    uploadedContent: uploadedContent,
                    ownerName: userName,
                },
            });
            return NextResponse.json(
                {
                    tutorId: newTutor.id,
                },
                { status: 200 }
            );
        }

        return NextResponse.json({
            res: 1,
        });
    } catch (error) {
        return NextResponse.json(
            {
                error: error,
            },
            { status: 500 }
        );
    }
}
