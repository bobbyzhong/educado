import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { authenticateAdmin } from "@/lib/accountHelpers";

export async function GET(req: Request, res: Response) {
    try {
      const admin = await authenticateAdmin();

      if(!admin) {
        return NextResponse.json(
          {
              message: "Unauthorized",
          },
          {
              status: 401,
          }
      )};

      const adminDistrict = admin?.email?.split("@")[1];

      const districtTutors = await prisma.tutor.findMany({
        where: {
            district: 
              adminDistrict,  
              // "tryeducado.com",
        },
        orderBy: {
            dateCreated: "desc",
        },
      });

      const districtTutorIds = districtTutors.map((tutor) => tutor.id);
      const questions = await prisma.tutorQuestions.findMany({
        where: {
            tutorId: {
              in: districtTutorIds
            }
        },
        orderBy: {
            date: "desc",
        },
      });

      return NextResponse.json(
        { questions },
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
