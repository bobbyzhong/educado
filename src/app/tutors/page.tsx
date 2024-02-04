import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import TutorsList from "@/components/tutorsList/TutorList";

type Props = {};

export const metadata = {
    title: "Tutors | Educado",
};

const Tutors = async (props: Props) => {
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
            tutorType: "General",
            district: district,
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    return <TutorsList tutors={tutors} userId={user?.id!} />;
};
export default Tutors;
