import TextbookCheckIn from "@/components/TextbookCheckIn";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Textbook Check In | Pear",
};

const NewTextbookCheckInPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }

    return <TextbookCheckIn />;
};
export default NewTextbookCheckInPage;
