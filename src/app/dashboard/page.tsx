import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {};

export const metadata = {
    title: "Dashboard | Pear",
};

const Dashboard = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (user?.isTeacher) {
        redirect("/dashboard-teacher");
    } else {
        redirect("/dashboard-student");
    }

    // const checkIns = await prisma.checkIn.findMany({
    //     where: {
    //         userId: session.user.id,
    //     },
    // });

    // const clear = user?.subscribed || checkIns.length < 10;

    return <main className="p-8 mx-auto max-w-7xl">hi</main>;
};
export default Dashboard;
