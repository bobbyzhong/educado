import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const { userId, school, district } = await req.json();

        try {
            if (district) {
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        isTeacher: true,
                        school: school,
                        isAdmin: true,
                    },
                });
            } else {
                await prisma.user.update({
                    where: {
                        id: userId,
                    },
                    data: {
                        isTeacher: true,
                        school: school,
                    },
                });
            }
        } catch (e) {
            return NextResponse.json(
                {
                    message: e,
                },
                {
                    status: 400,
                }
            );
        }
        console.log("Updated Teacher");

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
