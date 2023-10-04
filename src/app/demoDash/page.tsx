import HistoryCard from "@/components/dashboard/HistoryCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import CheckInCard from "@/components/dashboard/CheckInCard";
import ContactCard from "@/components/dashboard/ContactCard";
import ContentRequestCard from "@/components/dashboard/ContentRequestCard";
import EducadoTutorCard from "@/components/dashboard/EducadoTutorCard";
import { prisma } from "@/lib/db";
import HistoryTable from "@/components/HistoryTable";
import Link from "next/link";
import TeacherCodeInput from "@/components/TeacherCodeInput";

type Props = {};

export const metadata = {
    title: "Dashboard | Pear",
};
const StudentDashboardDemo = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    const checkIns = await prisma.checkIn.findMany({
        where: {
            userId: session.user.id,
        },
    });

    const clear = user?.subscribed || checkIns.length < 10;

    return (
        <main className="p-8 mx-auto max-w-7xl">
            <div className="flex items-center mb-5">
                <div className="flex flex-row justify-between w-full">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Student Dashboard *DEMO*
                    </h2>
                    <TeacherCodeInput userId={session.user.id} />
                </div>
            </div>

            <div className="grid gap-5 mt-4 md:grid-cols-3">
                <EducadoTutorCard />

                <CheckInCard
                    clear={clear}
                    // subscribed={user?.subscribed!}
                    userId={session.user.id}
                />
                {/* <HistoryCard /> */}
                {/* <ContactCard /> */}
                <ContentRequestCard />
            </div>
            <div className="flex items-center justify-between space-y-2">
                <div className="flex flex-col gap-1">
                    <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                        Past Check-Ins
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll see the past 10 check-ins you've made. View
                        the full history{" "}
                        <Link
                            className="text-green underline "
                            href={"/history"}
                        >
                            here
                        </Link>
                    </h1>
                </div>
            </div>
        </main>
    );
};
export default StudentDashboardDemo;
