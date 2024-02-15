import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import StudentEnterCode from "@/components/StudentEnterCode";
import ChatHistoryTable from "@/components/ChatHistoryTable";
import { prisma } from "@/lib/db";
import Link from "next/link";
import StudDashCopy from "@/components/tutor/StudDashCopyCode";
import DashboardCard from "@/components/dashboard/DashboardCard";
import { TutorCard } from "@/components/tutorsList/TutorCard";
import RecentTutorList from "@/components/dashboard/RecentTutorList";

type Props = {};

export const metadata = {
    title: "Dashboard | Educado",
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
    }

    const checkIns = await prisma.checkIn.findMany({
        where: {
            userId: session.user.id,
        },
    });

    const recentCodes = user?.recentTutors;
    let tutorList: any = [];
    if (recentCodes === undefined || recentCodes === null) {
        tutorList = [];
    } else {
        tutorList = recentCodes?.split(",");
        tutorList = tutorList.slice(1, 8);
        tutorList = tutorList.filter(
            (value: any, index: any) => tutorList.indexOf(value) === index
        );
    }
    let tutorObjList: any = [];

    for (let i = 0; i < tutorList.length && i < 8; i++) {
        const tutor = await prisma.tutor.findUnique({
            where: {
                id: tutorList[i],
            },
        });

        if (tutor) {
            const tutorObject = {
                id: tutor.id,
                tutorDisplayName: tutor.tutorDisplayName,
                tutorDescription: tutor.tutorDescription,
                joinCode: tutor.joinCode,
                grade: tutor.grade,
                subject: tutor.subject,
            };

            tutorObjList.push(tutorObject);
        }
    }

    return (
        <main className="p-8 mx-auto max-w-7xl">
            {/* <div className="flex items-center mb-5">
                <div className="flex flex-row justify-between w-full">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Your Dashboard
                    </h2>
                    <h1 className="flex flex-row items-center justify-center gap-1 text-[15px] font-outfit">
                        Are you a teacher? Click{" "}
                        <Link
                            href="/teacher-portal"
                            className="text-green underline"
                        >
                            here
                        </Link>
                    </h1>
                </div>
            </div> */}

            <div className="flex flex-col md:flex-row gap-0 md:gap-8 justify-center items-center ">
                <StudentEnterCode
                    title="Join Tutor Session"
                    description="Ask for help"
                    link="tutor"
                    bgRed={false}
                    isSignedIn={session?.user}
                    userId={session?.user?.id}
                    recentCodes={user?.recentTutors!}
                    email={user?.email!}
                    tutorObjList={tutorObjList}
                    studentName={session?.user?.name!}
                />
            </div>

            <div className="flex items-center mt-8">
                <div className="flex flex-col gap-1">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Homework Help{" "}
                        <span className="text-green font-medium text-xl">
                            beta
                        </span>
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Upload a picture of a problem and get step by step help
                        on it! Still in early stages of development though
                    </h1>
                </div>
            </div>

            <div className="grid gap-5 mt-4 md:grid-cols-3">
                <DashboardCard
                    icon={"hw-math"}
                    title="Math HW Help"
                    description="Upload a picture of the math problem you are stuck on and get a step by step explanation on how to solve it!"
                    pageLink="/hw-math/eeeee"
                />
            </div>

            <div className="flex items-center mt-8">
                <div className="flex flex-col gap-1">
                    <h2 className="mr-2 text-[28px] font-bold tracking-tight">
                        Tutors and Figures!
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll be able to find different tutors and
                        historical figures to work with!
                    </h1>
                </div>
            </div>

            <div className="grid gap-5 mt-4 md:grid-cols-3">
                <DashboardCard
                    icon={"figure"}
                    title="Historical + Famous Figures"
                    description="Explore different historical and famous figures to learn about their lives or just have a conversation with them!"
                    pageLink="/figures"
                />
                <DashboardCard
                    icon={"tutor"}
                    title="Personal Tutors"
                    description="Find tutors for your grade level and topics to get instant help. Work with the tutors your school district made!"
                    pageLink="/tutors"
                />
                <DashboardCard
                    icon={"contact"}
                    title="Contact Us"
                    description="Feel free to reach out to us at Educado for any questions, concerns, or feedback. We're here to help anytime you need!"
                    pageLink="/contact"
                />
            </div>

            <div className="flex items-center justify-between space-y-2">
                <div className="flex flex-col gap-1">
                    <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                        Recent Tutors
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Here are the tutors you've recently chatted with!
                    </h1>
                </div>
            </div>

            <RecentTutorList
                tutorList={tutorObjList}
                userId={session.user.id}
            />

            <div className="flex items-center justify-between space-y-2">
                <div className="flex flex-col gap-1">
                    <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                        Chat History
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Below you’ll see the past 10 chat history you've made.
                        View the full history{" "}
                        <Link
                            className="text-green underline "
                            href={"/pastConvos"}
                        >
                            here
                        </Link>
                    </h1>
                </div>
            </div>

            <ChatHistoryTable limit={10} userId={session.user.id} />
        </main>
    );
};
export default Dashboard;
