import { getAuthSession } from "@/lib/nextauth";

import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import MCQ from "@/components/MCQ";

type Props = {
    params: {
        checkInId: string;
    };
};
const CheckIn = async ({ params: { checkInId } }: Props) => {
    let checkIn: any = await prisma.checkIn.findUnique({
        where: {
            id: checkInId,
        },
        include: {
            questions: {
                select: {
                    id: true,
                    question: true,
                    options: true,
                },
            },
            user: true,
        },
    });
    if (!checkIn) {
        const checkInList = await prisma.checkIn.findMany({
            where: {
                code: checkInId,
            },
            include: {
                questions: {
                    select: {
                        id: true,
                        question: true,
                        options: true,
                    },
                },
                user: true,
            },
        });
        checkIn = checkInList[0];
    }

    if (!checkIn || checkIn.checkInType !== "mcq") {
        return redirect("/new-check-in");
    }

    return <MCQ checkIn={checkIn} />;
};
export default CheckIn;
