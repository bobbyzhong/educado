import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const { userId, code } = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
        let currCodes = user!.recentCodes;
        if (currCodes === undefined || currCodes === null) {
            currCodes = `,${code}`;
        } else {
            currCodes = `,${code}` + currCodes;
        }

        console.log(currCodes);

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                recentCodes: currCodes,
            },
        });

        return NextResponse.json(
            {
                message: "updated",
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
