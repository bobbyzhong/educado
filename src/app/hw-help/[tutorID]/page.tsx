import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ChatSection from "@/components/tutor/ChatSection";
import { getAuthSession } from "@/lib/nextauth";
import { signIn } from "next-auth/react";
import SignInButton from "@/components/SignInButton";
import SignInButtonStudent from "@/components/SignInButtonStudent";
import WritingChatSection from "@/components/tutor/WritingChatSection";
import GeneralChatSection from "@/components/tutor/GeneralChatSection";
import HWChat from "@/components/homeworkHelp/HWChat";

type Props = {
    params: {
        tutorID: string;
    };
};
const HWHelper = async ({ params: { tutorID } }: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        signIn("google", { callbackUrl: `/hw-help/${tutorID}` }).catch(
            console.error
        );
    }

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
        return redirect("/dashboard-teacher");
    }

    if (!tutor.isHomework) {
        return redirect(`/tutor/${tutor.id}`);
    }

    if (!session?.user.id) {
        return (
            <div className="w-full mt-10 flex flex-col items-center justify-center ">
                {" "}
                <div className="font-outfit mb-2">
                    Sign in with Google to start chatting with{" "}
                    {tutor.tutorDisplayName}!
                </div>
                <SignInButtonStudent
                    callback={
                        !tutor.isHomework
                            ? `/tutor/${tutor.id}`
                            : `/hw-help/${tutor.id}`
                    }
                    text={"Sign In"}
                    tutorId={tutor.id}
                />
            </div>
        );
    } else if (tutor.tutorType === "General" || tutor.tutorType === "Figure") {
        return (
            <HWChat
                tutorName={tutor.tutorName}
                ownerName={tutor.ownerName}
                tutorDisplayName={tutor.tutorDisplayName}
                tutorDescription={tutor.tutorDescription}
                tutorId={tutor.id}
                admins={tutor.admins}
                userId={session.user.id}
                studentName={session.user.name!}
                studentId={session.user.id}
                defaultPrompt={tutor.basePrompt}
                tutorType={tutor.tutorType}
                tutorGrade={tutor.grade}
            />
        );
    }
};
export default HWHelper;
