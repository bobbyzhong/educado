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
import ChatHistoryTable from "@/components/ChatHistoryTable";
import { TutorCard } from "@/components/tutor/TutorCard";

type Props = {};

export const metadata = {
    title: "Dashboard | Pear",
};

const DashboardTeacher = async (props: Props) => {
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

    const checkIns = await prisma.checkIn.findMany({
        where: {
            userId: session.user.id,
        },
    });
    const tutors = await prisma.tutor.findMany({
        where: {
            userId: session.user.id,
        },
    });

    const clear = user?.subscribed || checkIns.length < 10;

    return (
        <main className="p-8 mx-auto max-w-7xl">
            <div className="flex items-center mb-5">
                <div className="flex flex-col gap-1">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Your Dashboard
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll be able to create a check-in as well as
                        view past check-ins
                    </h1>
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

            <div className="flex items-center justify-between space-y-2 mb-5">
                <div className="flex flex-col gap-1">
                    <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                        Your Tutors
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll see some of the tutors you've made or have
                        access to. Make one by going{" "}
                        <Link
                            className="text-green underline "
                            href={"/manage-tutors"}
                        >
                            here
                        </Link>
                    </h1>
                </div>
            </div>

            <div className="max-w-[92vw]">
                {tutors.length > 0 ? (
                    <div className="relative flex items-center  overflow-x-auto  gap-5">
                        {tutors.map((tutor, i) => {
                            return (
                                <div key={i}>
                                    <TutorCard
                                        name={tutor.tutorDisplayName}
                                        id={tutor.id}
                                        description={tutor.tutorDescription!}
                                        joinCode={tutor.joinCode!}
                                        status={"Active"}
                                    />
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>No tutors made yet </div>
                )}
            </div>

            <div className="flex items-center justify-between space-y-2">
                <div className="flex flex-col gap-1">
                    <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                        Past Check-Ins
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll see the past 5 check-ins you've made. View
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

            <HistoryTable limit={5} userId={session.user.id} />
        </main>
    );
};
export default DashboardTeacher;
