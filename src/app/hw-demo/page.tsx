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
import HWDemo from "@/components/HWDemo";

const HWDemoPage = async () => {
    const session = await getAuthSession();
    if (!session?.user) {
        signIn("google", {
            callbackUrl: `/hw-help/edf0e5d0-5fde-11ee-8c99-9232ac129345`,
        }).catch(console.error);
    }

    let tutor: any = await prisma.tutor.findUnique({
        where: {
            id: "edf0e5d0-5fde-11ee-8c99-9232ac129345",
        },
    });

    if (!tutor) {
        return redirect("/dashboard-teacher");
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
                    callback={"/hw-demo"}
                    text={"Sign In"}
                    tutorId={tutor.id}
                />
            </div>
        );
    } else if (tutor.tutorType === "General") {
        return (
            <HWDemo
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
            />
        );
    }
};
export default HWDemoPage;
