import HistoryComponent from "@/components/HistoryComponent";
import HistoryTable from "@/components/HistoryTable";
import ResultsTable from "@/components/ResultsTable";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextauth";
import { LucideLayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Props = {};
const HistoryPage = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    return (
        <>
            <div className="p-8 mx-auto max-w-7xl">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="mr-2 text-[28px] font-medium tracking-tight">
                            Your Past Check-Ins
                        </h2>
                    </div>
                    {/* <div className="flex items-center space-x-2">
                        <div className="font-light text-sm mr-3">
                            Finished Reviewing?
                        </div>
                        <Link
                            className={`"mt-8 mr-0 bg-green inline-block text-center max-w-fit text-sm 
                    box-content hover:scale-[1.01] rounded-[5px] px-[20px] my-0 py-[10px] `}
                            href={`/`}
                        >
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-white1 font-semibold">
                                    Share Check-In
                                </div>

                                <Image
                                    src={"/icons/whitearrow.svg"}
                                    height={20}
                                    width={20}
                                    alt={""}
                                />
                            </div>
                        </Link>
                    </div> */}
                </div>

                <HistoryTable limit={100} userId={session.user.id} />
            </div>
        </>
    );
};
export default HistoryPage;
