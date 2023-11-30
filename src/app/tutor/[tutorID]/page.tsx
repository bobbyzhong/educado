import { prisma } from "@/lib/db";
import { redirect } from "next/navigation";
import React from "react";
import ChatSection from "@/components/tutor/ChatSection";
import { getAuthSession } from "@/lib/nextauth";
import { signIn } from "next-auth/react";
import SignInButton from "@/components/SignInButton";
import SignInButtonStudent from "@/components/SignInButtonStudent";

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

    return (
        <>
            {session?.user.id ? (
                <ChatSection
                    tutorName={tutor.tutorName}
                    ownerName={tutor.ownerName}
                    tutorDisplayName={tutor.tutorDisplayName}
                    tutorId={tutor.id}
                    teacherId={tutor.userId}
                    userId={session.user.id}
                    studentName={session.user.name!}
                    placeholderQs={tutor.placeholderQs}
                    defaultPrompt={tutor.basePrompt}
                />
            ) : (
                <div className="w-full mt-10 flex flex-col items-center justify-center ">
                    {" "}
                    <div className="font-outfit mb-2">
                        Sign in with Google to start chatting with{" "}
                        {tutor.tutorDisplayName}!
                    </div>
                    <SignInButtonStudent text={"Sign In"} tutorId={tutor.id} />
                </div>
            )}
        </>
    );
};
export default TutorPage;
