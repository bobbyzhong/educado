import ContentRequest from "@/components/ContentRequest";
import TopicCheckIn from "@/components/TopicCheckIn";
import { getAuthSession } from "@/lib/nextauth";

import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Content Request | Educado",
};

const ContentRequestPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }

    return <ContentRequest name={session.user.name!} />;
};
export default ContentRequestPage;
// name={session.user.name!}
