import DistrictQuestions from "@/components/analytics/DistrictQuestions";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

type Props = {
    params: {
        tutorIds: string[];
    };
};
const ChatLogs = async ({ params: { tutorIds } }: Props) => {
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
                            District Chat History
                        </h2>
                    </div>
                </div>

                <DistrictQuestions limit={100} tutorIds={tutorIds} />
            </div>
        </>
    );
};
export default ChatLogs;
