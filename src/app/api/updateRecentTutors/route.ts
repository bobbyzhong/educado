import { prisma } from "@/lib/db";
import fs from "fs";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export async function POST(req: Request, res: Response) {
    try {
        const { userId, code } = await req.json();

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

        const tutorId = `,${tutors[0].id.toString()}`;
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
        } else if (recentTutorsList.includes(tutors[0].id.toString())) {
            return NextResponse.json(
                {
                    message: "don't need to update",
                },
                { status: 200 }
            );
        } else {
            recentTutors = tutorId + recentTutors;
        }
        console.log(recentTutors);
        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                recentTutors: recentTutors,
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
