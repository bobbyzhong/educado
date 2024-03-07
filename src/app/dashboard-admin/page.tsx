import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import ChatHistoryTable from "@/components/ChatHistoryTable";
import { TutorCard } from "@/components/tutor/TutorCard";
import ResourcesCard from "@/components/dashboard/ResourcesCard";
import NotifCard from "@/components/dashboard/NotifCard";
import DashboardCard from "@/components/dashboard/DashboardCard";

type Props = {};

export const metadata = {
    title: "Dashboard | Educado",
};

const DashboardAdmin = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });

    if (!user?.isAdmin && !user?.isTeacher) {
        redirect("/dashboard-student");
    } else if (user?.isTeacher && !user?.isAdmin) {
        redirect("/dashboard-teacher");
    }

    // const checkIns = await prisma.checkIn.findMany({
    //     where: {
    //         userId: session.user.id,
    //     },
    // });
    // const tutors = await prisma.tutor.findMany({
    //     where: {
    //         userId: session.user.id,
    //     },
    // });

    // const clear = user?.subscribed || checkIns.length < 10;

    return (
        <main className="p-8 mx-auto max-w-7xl">
            {/* <div className="flex items-center mt-5">
                <div className="flex flex-col gap-1">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Homework Helpers{" "}
                        <span className="text-green font-medium text-xl">
                            beta
                        </span>
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Manage your district's homework helpers here. See what
                        students have been asking their tutors!
                    </h1>
                </div>
            </div>
            <div className="grid gap-5 md:grid-cols-3 mt-4">
                <DashboardCard
                    icon={"hw-math"}
                    title="Manage Helpers"
                    description="Manage all your homework helpers here. See what questions students have been asking and share tutors with your students!"
                    pageLink="/manage-helpers"
                />
            </div> */}
            <div className="flex items-center mt-8">
                <div className="flex flex-col gap-1">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Your Dashboard
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll be able to manage your district's resources
                        and data
                    </h1>
                </div>
            </div>

            <div className="grid gap-5 mt-4 md:grid-cols-3">
                {/* <DashboardCard
                    icon={"tutor"}
                    title="Educado Tutor"
                    description="Create and manage tutors for your students. See what
                            questions they've been asking and add content for
                            your tutor to use."
                    pageLink="/manage-tutors"
                /> */}
                <DashboardCard
                    icon={"analytics"}
                    title="Educado Analytics"
                    description="View analytics for your tutors and make data driven decisions. Identify trends and patterns such as topics students are struggling with."
                    pageLink="/district-analytics"
                />
                <DashboardCard
                    icon={"hw-math"}
                    title="Manage Helpers"
                    description="Manage all your homework helpers here. See what questions students have been asking and share tutors with your students!"
                    pageLink="/manage-helpers"
                />

                <DashboardCard
                    icon={"contact"}
                    title="Contact Us"
                    description="Feel free to reach out to us at Educado for any questions, concerns, or feedback. We're here to help anytime you need!"
                    pageLink="/contact"
                />

                <DashboardCard
                    icon={"library"}
                    title="Explore Library"
                    description="Explore our library of pre-made historical figures and use or modify them for your needs! Great for getting started instantly or inspiration!"
                    pageLink="/library"
                />

                <DashboardCard
                    icon={"figure"}
                    title="Famous Figure"
                    description="Create and manage historical figures for your students. Have students engage in free flowing or directed conversations with historical figures."
                    pageLink="/manage-figures"
                />
            </div>

            <div className="flex  flex-col w-full items-start justify-center max-h-[30rem] mt-10">
                <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                    Notifications
                </h2>
                <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 mb-5">
                    Any notifications will appear here. Click on one to view the
                    conversation.
                </h1>
                <NotifCard userId={session.user.id} />
            </div>
        </main>
    );
};
export default DashboardAdmin;
