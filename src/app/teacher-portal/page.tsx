import TeacherPortalCard from "@/components/tutor/TeacherPortalCard";
import { getAuthSession } from "@/lib/nextauth";

import { redirect } from "next/navigation";
import React from "react";

type Props = {};

export const metadata = {
    title: "Content Request | Educado",
};

const TeacherPortalPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        redirect("/");
    }

    return <TeacherPortalCard userId={session.user.id!} />;
};
export default TeacherPortalPage;
// name={session.user.name!}
