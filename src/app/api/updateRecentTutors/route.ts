import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const { userId, code } = await req.json();

        let tutorId = "";
        if (code.length > 6) {
            tutorId = "," + code;
        } else {
            const tutors = await prisma.tutor.findMany({
                where: {
                    joinCode: code,
                },
            });

            if (tutors.length === 0 || tutors == null) {
                return NextResponse.json(
                    {
                        message: "No tutor found with that code",
                    },
                    { status: 400 }
                );
            }
            tutorId = `,${tutors[0].id.toString()}`;
        }

        console.log(tutorId);

        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
        });

        let recentTutors = user?.recentTutors;

        let recentTutorsList: any = [];
        if (recentTutors === undefined || recentTutors === null) {
            recentTutorsList = [];
        } else {
            recentTutorsList = recentTutors?.split(",");
            recentTutorsList = recentTutorsList.slice(
                1,
                recentTutorsList.length
            );
        }

        if (recentTutors === undefined || recentTutors === null) {
            recentTutors = tutorId;
        } else if (recentTutorsList.includes(tutorId.slice(1))) {
            const index = recentTutorsList.indexOf(tutorId);
            // Remove the tutor from its current position
            recentTutorsList.splice(index, 1);
            // Add the tutor to the front of the array
            recentTutorsList.unshift(tutorId);
            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    recentTutors: recentTutorsList.toString(),
                },
            });
            return NextResponse.json(
                {
                    message: "moved to front",
                },
                { status: 200 }
            );
        } else {
            recentTutors = tutorId + recentTutors;
        }

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                recentTutors: recentTutors,
            },
        });
        console.log("HERE");

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
