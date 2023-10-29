import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const { essayTopic, userId, studentName, tutorName } = await req.json();

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        const newNotif = `,${studentName} asked ${tutorName} to write an essay on ${essayTopic}`;

        let notifs = user?.notifs;
        if (notifs) {
            notifs = newNotif + notifs;
        } else {
            notifs = newNotif;
        }
        console.log("updating essay notif");

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                notifs: notifs,
            },
        });

        return NextResponse.json(
            {
                data: "updated",
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
