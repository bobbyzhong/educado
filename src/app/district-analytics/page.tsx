import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import AnalyticsDashboard from "@/components/analytics/AnalyticsDashboard";
import CoreAnalyticsCard from "@/components/analytics/CoreAnalyticsCard";

type Props = {};

export const metadata = {
    title: "District Analytics | Educado",
};

const DistrictAnalytics = async (props: Props) => {
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

    return (
        <main className="p-8 md:pt-8 xl:p-5 mx-auto  mt-3">
            <div className=" flex flex-col w-full items-center justify-center gap-1 ">
                <div className="max-w-7xl lg:max-w-[80rem] mb-8">
                    <h2 className="mr-2 text-2xl font-semibold tracking-tight ">
                        District Analytics
                    </h2>
                </div>

                <CoreAnalyticsCard />
                <AnalyticsDashboard />
            </div>
        </main>
    );
};
export default DistrictAnalytics;
