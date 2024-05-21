import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ChatSection from "@/components/tutor/ChatSection";
import HWChatImageText from "@/components/homeworkHelp/HWChatImageText";
import { getAuthSession } from "@/lib/nextauth";
import { signIn } from "next-auth/react";
import SignInButtonStudent from "@/components/SignInButtonStudent";


const TutorPage = async () => {
    const session = await getAuthSession();
    if (!session?.user) {
        signIn("google").catch(
            console.error
        );
    }

    let tutor: any = await prisma.tutor.findUnique({
        where: {
            id: "clw9llht90001ecmqr1knxwr1",
        },
    });
    if (!tutor) {
        const tutorList = await prisma.tutor.findMany({
            where: {
                joinCode: "km900",
            },
        });
        tutor = tutorList[0];
    }

    if (!tutor) {
        return redirect("/dashboard-teacher");
    }
/*
    if (tutor.isHomework) {
        return redirect(`/hw-help/${tutor.id}`);
    }
*/
    const tutorType = tutor.tutorType;

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
            <HWChatImageText
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
                isPremium={tutor.premium}
            />
        );
    }
};
export default TutorPage;
