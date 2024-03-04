import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { authenticateAdmin } from "@/lib/accountHelpers";

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

        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        const oneWeekAgoStr =
            oneWeekAgo.toISOString().split("T")[0] +
            " " +
            oneWeekAgo.toTimeString().split(" ")[0];

        const districtTutors = await prisma.tutor.findMany({
            where: {
                district: adminDistrict,
            },
            orderBy: {
                dateCreated: "desc",
            },
        });

        const districtTutorIds = districtTutors.map((tutor) => tutor.id);
        const recentQuestions = await prisma.tutorQuestions.findMany({
            where: {
                tutorId: {
                    in: districtTutorIds,
                },
                date: {
                    gte: oneWeekAgoStr,
                },
            },
            select: {
                userId: true, // only select studentId
            },
        });

        const uniqueStudentIds = new Set(recentQuestions.map((q) => q.userId));
        const activeStudentCount = uniqueStudentIds.size;
        const questionsThisWeek = recentQuestions.length;

        return NextResponse.json(
            { activeStudentCount, questionsThisWeek },
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
