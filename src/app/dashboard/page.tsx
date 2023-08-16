import HistoryCard from "@/components/dashboard/HistoryCard";
import QuizMeCard from "@/components/dashboard/QuizMeCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import HotTopicsCard from "./HotTopicsCard";
import RecentActivityCard from "./RecentAcitivities";
import CheckInCard from "@/components/dashboard/CheckInCard";
import ContactCard from "@/components/dashboard/ContactCard";

type Props = {};

export const metadata = {
    title: "Dashboard | Pear",
};

const Dashboard = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }

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
                <CheckInCard />
                <HistoryCard />
                <ContactCard />

                {/* <CheckInCard /> */}
                {/* <QuizMeCard /> */}
            </div>
        </main>
    );
};
export default Dashboard;
