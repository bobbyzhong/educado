import ChatHistoryTable from "@/components/ChatHistoryTable";
import HistoryComponent from "@/components/HistoryComponent";
import HistoryTable from "@/components/HistoryTable";
import ResultsTable from "@/components/ResultsTable";
import RecentQuestions from "@/components/tutor/RecentQuestions";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {
    params: {
        tutorId: string;
    };
};
const ChatLogs = async ({ params: { tutorId } }: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }

    return (
        <>
            <div className="py-8 px-4 mx-auto max-w-full">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="mr-2 text-[28px] font-medium tracking-tight">
                            Your Chat History
                        </h2>
                    </div>
                </div>

                <RecentQuestions limit={100} tutorId={tutorId} />
            </div>
        </>
    );
};
export default ChatLogs;
