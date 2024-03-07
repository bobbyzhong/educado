import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const { admins, studentName, studentId, tutorName, tutorId } =
            await req.json();

        const adminList = admins.split(",");

        const notifText = `A message from ${studentName} with ${tutorName} has raised an emotional alert.`;

        const getCurrentDateFormatted = () => {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, "0");
            const month = String(date.getMonth() + 1).padStart(2, "0"); // January is 0!
            const year = String(date.getFullYear()).slice(-2); // Gets the last two digits of the year

            return `${month}/${day}/${year}`;
        };

        adminList.forEach(async (admin: string) => {
            await prisma.notifications.create({
                data: {
                    type: "Emotional Alert",
                    content: notifText,
                    studentName: studentName,
                    studentId: studentId,
                    tutorName: tutorName,
                    date: getCurrentDateFormatted(),
                    tutorId: tutorId,
                    userId: admin,
                },
            });
        });

        console.log("Updated Emotional Notification");

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
