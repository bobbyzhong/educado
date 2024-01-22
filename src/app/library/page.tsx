import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

import { TutorCard } from "@/components/tutor/TutorCard";
import CreateTutorCard from "@/components/tutor/CreateTutorCard";
import CreateFigureCard from "@/components/tutor/CreateFigureCard";
import FiguresList from "@/components/library/FiguresList";

type Props = {};

export const metadata = {
    title: "Dashboard | Pear",
};

const Library = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user?.isTeacher) {
        redirect("/dashboard-student");
    }

    const tutors = await prisma.tutor.findMany({
        where: {
            tutorType: "Figure",
            visibility: "public",
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    return <FiguresList tutors={tutors} />;
};
export default Library;
