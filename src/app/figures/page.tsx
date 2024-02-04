import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import TutorsList from "@/components/tutorsList/TutorList";
import FigureList from "@/components/figureList/FigureList";

type Props = {};

export const metadata = {
    title: "Tutors | Educado",
};

const Figures = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    const district = user?.email?.split("@")[1];

    const tutors = await prisma.tutor.findMany({
        where: {
            tutorType: "Figure",
            // district: district,
            visibility: "public",
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    return <FigureList tutors={tutors} district={district!} />;
};
export default Figures;
