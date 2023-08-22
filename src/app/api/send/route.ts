// /api/check-in/route.ts

import { getAuthSession } from "@/lib/nextauth";
import { NextResponse } from "next/server";
import { getAccessSchema } from "@/schemas/form/quiz";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import axios from "axios";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { name, school, subject, contact } = getAccessSchema.parse(body);

        try {
            await prisma.accessRequest.create({
                data: {
                    name: name,
                    school: school,
                    subject: subject,
                    contact: contact,
                },
            });
        } catch (e) {
            console.log(e);
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
