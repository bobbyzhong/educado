import { prisma } from "@/lib/db";
import React from "react";
import { getAuthSession } from "@/lib/nextauth";
import { signIn } from "next-auth/react";
import ConvoLogDisplay from "@/components/analytics/ConvoLogDisplay";

type Props = {
    params: {
        studentId: string;
    };
};
const ConvoLog = async ({ params: { studentId } }: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        signIn("google", { callbackUrl: `/convoLog/${studentId}` }).catch(
            console.error
        );
    }

    const student = await prisma.user.findUnique({
        where: {
            id: studentId,
        },
    });

    return (
        <div className="mt-10 ">
            <ConvoLogDisplay
                studentId={student?.id!}
                studentName={student?.name!}
            />
        </div>
    );
};
export default ConvoLog;
