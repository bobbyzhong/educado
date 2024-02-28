import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authenticateAdmin } from "@/lib/accountHelpers";
import { Nuosu_SIL } from "next/font/google";

export async function GET(req: Request, res: Response) {
    try {
        const admin = await authenticateAdmin();

        if (!admin) {
            return NextResponse.json(
                {
                    message: "Unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const adminDistrict = admin?.email?.split("@")[1];

        const districtTutors = await prisma.tutor.findMany({
            where: {
                district: adminDistrict,
                // "tryeducado.com",
            },
            orderBy: {
                dateCreated: "desc",
            },
        });

        const districtTutorIds = districtTutors.map((tutor) => tutor.id);
        const count = await prisma.tutorQuestions.count({
            where: {
                tutorId: {
                    in: districtTutorIds,
                },
            },
        });

        return NextResponse.json({ count }, { status: 200 });
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
