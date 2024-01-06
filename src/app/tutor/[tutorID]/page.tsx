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

type Props = {
    params: {
        tutorID: string;
    };
};
const TutorPage = async ({ params: { tutorID } }: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        signIn("google", { callbackUrl: `/tutor/${tutorID}` }).catch(
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

    const tutorType = tutor.tutorType;

    if (!session?.user.id) {
        return (
            <div className="w-full mt-10 flex flex-col items-center justify-center ">
                {" "}
                <div className="font-outfit mb-2">
                    Sign in with Google to start chatting with{" "}
                    {tutor.tutorDisplayName}!
                </div>
                <SignInButtonStudent text={"Sign In"} tutorId={tutor.id} />
            </div>
        );
    } else if (tutor.tutorType === "General") {
        return (
            <GeneralChatSection
                tutorName={tutor.tutorName}
                ownerName={tutor.ownerName}
                tutorDisplayName={tutor.tutorDisplayName}
                tutorId={tutor.id}
                teacherId={tutor.userId}
                userId={session.user.id}
                studentName={session.user.name!}
                placeholderQs={tutor.placeholderQs}
                defaultPrompt={tutor.basePrompt}
                tutorType={tutor.tutorType}
                assistantId={tutor.assistantId}
            />
        );
    } else if (tutor.tutorType === "Writing") {
        return (
            <WritingChatSection
                tutorName={tutor.tutorName}
                ownerName={tutor.ownerName}
                tutorDisplayName={tutor.tutorDisplayName}
                tutorId={tutor.id}
                teacherId={tutor.userId}
                userId={session.user.id}
                studentName={session.user.name!}
                placeholderQs={tutor.placeholderQs}
                defaultPrompt={tutor.basePrompt}
                tutorType={tutor.tutorType}
                essayPrompt={tutor.essayPrompt}
                assistantId={tutor.assistantId}
            />
        );
    }
};
export default TutorPage;
