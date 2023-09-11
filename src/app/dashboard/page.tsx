import HistoryCard from "@/components/dashboard/HistoryCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import CheckInCard from "@/components/dashboard/CheckInCard";
import ContactCard from "@/components/dashboard/ContactCard";
import ContentRequestCard from "@/components/dashboard/ContentRequestCard";
import { prisma } from "@/lib/db";
import HistoryTable from "@/components/HistoryTable";
import Link from "next/link";

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
                <CheckInCard
                    subscribed={user?.subscribed!}
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

            <HistoryTable limit={10} userId={session.user.id} />
        </main>
    );
};
export default Dashboard;
