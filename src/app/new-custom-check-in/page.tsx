import CustomCheckIn from "@/components/CustomCheckIn";
import TextbookCheckIn from "@/components/TextbookCheckIn";
import TopicCheckIn from "@/components/TopicCheckIn";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Custom Check In | Educado",
};

const NewCustomCheckInPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    return <CustomCheckIn uploadedContent={user?.uploadedContent!} />;
};
export default NewCustomCheckInPage;
