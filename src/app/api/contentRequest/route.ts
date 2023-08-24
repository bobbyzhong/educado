// /api/check-in/route.ts

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import {
    contentRequestSchema,
    contentRequestSchemaAPI,
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
        const body = await req.json();
        const { name, content } = contentRequestSchemaAPI.parse(body);

        try {
            await transporter.sendMail({
                ...mailOptions,
                subject: "Content Request",
                text: `${name} has requested the following content: ${content}`,
                html: `<p>${name} has requested the following content: ${content}</p>`,
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
