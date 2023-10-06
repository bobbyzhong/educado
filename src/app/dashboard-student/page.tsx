import HistoryCard from "@/components/dashboard/HistoryCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import CheckInCard from "@/components/dashboard/CheckInCard";
import ContactCard from "@/components/dashboard/ContactCard";
import ContentRequestCard from "@/components/dashboard/ContentRequestCard";
import EducadoTutorCard from "@/components/dashboard/EducadoTutorCard";
import StudentEnterCode from "@/components/StudentEnterCode";
import ChatHistoryTable from "@/components/ChatHistoryTable";

import { prisma } from "@/lib/db";
import HistoryTable from "@/components/HistoryTable";
import Link from "next/link";
import StudDashCopy from "@/components/tutor/StudDashCopyCode";

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
    }

    const checkIns = await prisma.checkIn.findMany({
        where: {
            userId: session.user.id,
        },
    });

    const recentCodes = user?.recentCodes;
    let codesList: any = [];
    if (recentCodes === undefined || recentCodes === null) {
        codesList = [];
    } else {
        codesList = recentCodes?.split(",");
        codesList = codesList.slice(1, codesList.length);
        codesList = codesList.filter(
            (value: any, index: any) => codesList.indexOf(value) === index
        );
    }

    const clear = user?.subscribed || checkIns.length < 10;

    return (
        <main className="p-8 mx-auto max-w-7xl">
            <div className="flex items-center mb-5">
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
            </div>

            <div className="flex flex-col md:flex-row gap-0 md:gap-8 justify-center items-center ">
                <StudentEnterCode
                    title="EDUCADO TUTOR"
                    description="Ask for help"
                    link="tutor"
                    bgRed={false}
                    isSignedIn={session?.user}
                    userId={session?.user?.id}
                />
                <StudentEnterCode
                    title="CHECK-IN"
                    description="Enter Code Here"
                    link="check-in"
                    bgRed={true}
                    isSignedIn={session?.user}
                    userId={session?.user?.id}
                />
            </div>

            <div className="flex items-center justify-between space-y-2">
                <div className="flex flex-col gap-1">
                    <h2 className="mt-10 text-[28px] font-bold tracking-tight">
                        Recent Codes
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
                        Here are the recent codes you've entered. Click on one
                        to copy it!
                    </h1>
                </div>
            </div>

            {codesList.length > 0 ? (
                <div className="flex flex-row gap-3 flex-wrap mt-5">
                    {codesList.map((code: any, i: any) => {
                        return <StudDashCopy code={code} key={i} />;
                    })}
                </div>
            ) : (
                <h1 className="text-zinc-500 text-[15px] mt-5 w-10/12 dark:text-zinc-300 mb-5 ">
                    No codes saved yet! Ask your teacher for the codes for your
                    class.
                </h1>
            )}

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
