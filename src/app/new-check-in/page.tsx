import TopicCheckIn from "@/components/TopicCheckIn";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Quiz | Pear",
};

const NewCheckInPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }

    return <TopicCheckIn />;
};
export default NewCheckInPage;
