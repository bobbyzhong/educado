import CustomCheckIn from "@/components/CustomCheckIn";
import TextbookCheckIn from "@/components/TextbookCheckIn";
import TopicCheckIn from "@/components/TopicCheckIn";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Custom Check In | Pear",
};

const NewCustomCheckInPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }

    return <CustomCheckIn />;
};
export default NewCustomCheckInPage;
