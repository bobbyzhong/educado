import GetAccess from "@/components/GetAccess";
import TopicCheckIn from "@/components/TopicCheckIn";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Check In | Educado",
};

const GetAccessPage = async (props: Props) => {
    const session = await getAuthSession();
    if (session?.user) {
        redirect("/dashboard-student");
    }

    return <GetAccess />;
};
export default GetAccessPage;
