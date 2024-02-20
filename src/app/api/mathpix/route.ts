import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();

        const base64 = body.base64;

        const res = await fetch("https://api.mathpix.com/v3/text", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                app_id: process.env.MATHPIX_APP_ID!,
                app_key: process.env.MATHPIX_APP_KEY!,
            },
            body: JSON.stringify({
                src: base64,
                formats: ["text", "data", "html"],
                data_options: {
                    include_asciimath: true,
                    include_latex: true,
                },
            }),
        });

        const mathData = await res.json();
        console.log("MATH DATA", mathData);

        return NextResponse.json(
            {
                data: mathData,
            },
            { status: 200 }
        );
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
