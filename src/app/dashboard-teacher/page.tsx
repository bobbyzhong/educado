import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import HistoryTable from "@/components/HistoryTable";
import Link from "next/link";
import ChatHistoryTable from "@/components/ChatHistoryTable";
import { TutorCard } from "@/components/tutor/TutorCard";
import ResourcesCard from "@/components/dashboard/ResourcesCard";
import NotifCard from "@/components/dashboard/NotifCard";
import DashboardCard from "@/components/dashboard/DashboardCard";

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

    // const checkIns = await prisma.checkIn.findMany({
    //     where: {
    //         userId: session.user.id,
    //     },
    // });
    const tutors = await prisma.tutor.findMany({
        where: {
            userId: session.user.id,
        },
    });

    // const clear = user?.subscribed || checkIns.length < 10;

    return (
        <main className="p-8 mx-auto max-w-7xl">
            <div className="flex items-center">
                <div className="flex flex-col gap-1">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Your Dashboard
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll be able to create, explore, and manage your
                        historical figures and tutors
                    </h1>
                </div>
            </div>

            <div className="grid gap-5 mt-4 md:grid-cols-3">
                <DashboardCard
                    icon={"figure"}
                    title="Famous Figure"
                    description="Create and manage historical figures for your students. Have students engage in free flowing or directed conversations with historical figures."
                    pageLink="/manage-figures"
                />
                <DashboardCard
                    icon={"library"}
                    title="Explore Library"
                    description="Explore our library of pre-made historical figures and use or modify them for your needs! Great for getting started instantly or inspiration!"
                    pageLink="/library"
                />
                <DashboardCard
                    icon={"contact"}
                    title="Contact Us"
                    description="Feel free to reach out to us at Educado for any questions, concerns, or feedback. We're here to help anytime you need!"
                    pageLink="/contact"
                />
                <DashboardCard
                    icon={"tutor"}
                    title="Educado Tutor"
                    description="Create and manage tutors for your students. See what
                            questions they've been asking and add content for
                            your tutor to use."
                    pageLink="/manage-tutors"
                />
                <ResourcesCard />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5 max-h-[30rem] ">
                <div>
                    <div className="flex items-center justify-between space-y-2 mb-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                                Notifications
                            </h2>
                            <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 ">
                                Any notifications or updates will appear here
                            </h1>
                        </div>
                    </div>
                    <NotifCard userId={session.user.id} />
                </div>
                <div className="md:pb-0 pb-10">
                    <div className="flex items-center justify-between space-y-2 mb-5">
                        <div className="flex flex-col gap-1">
                            <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                                Your Tutors
                            </h2>
                            <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 ">
                                Below you’ll see some of the tutors you've made
                                or have access to
                            </h1>
                        </div>
                    </div>
                    <div className="max-w-[92vw] ">
                        {tutors.length > 0 ? (
                            <div className="relative flex items-center  overflow-x-auto  gap-5">
                                {tutors.map((tutor, i) => {
                                    return (
                                        <div key={i}>
                                            <TutorCard
                                                name={tutor.tutorDisplayName}
                                                id={tutor.id}
                                                description={
                                                    tutor.tutorDescription!
                                                }
                                                joinCode={tutor.joinCode!}
                                                type={tutor.tutorType!}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="font-outfit">
                                No tutors made yet{" "}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* <div className="flex items-center justify-between space-y-2">
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

            <HistoryTable limit={5} userId={session.user.id} /> */}
        </main>
    );
};
export default DashboardTeacher;
