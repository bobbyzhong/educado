import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ChatSection from "@/components/tutor/ChatSection";

type Props = {
    params: {
        tutorID: string;
    };
};
const TutorPage = async ({ params: { tutorID } }: Props) => {
    let tutor: any = await prisma.tutor.findUnique({
        where: {
            id: tutorID,
        },
    });
    if (!tutor) {
        const tutorList = await prisma.tutor.findMany({
            where: {
                joinCode: tutorID,
            },
        });
        tutor = tutorList[0];
    }

    if (!tutor) {
        return redirect("/dashboard");
    }

    return (
        <>
            <ChatSection
                tutorName={tutor.tutorName}
                ownerName={tutor.ownerName}
                tutorDisplayName={tutor.tutorDisplayName}
                tempQuestions={tutor.tempQuestions}
                tutorId={tutor.id}
            />
        </>
    );
};
export default TutorPage;
