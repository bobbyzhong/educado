import DistrictQuestions from "@/components/analytics/DistrictQuestions";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

type Props = {
    tutorIds: string[];
};

const ChatLogs = async (tutorIds : Props) => {
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

    const adminDistrict = user?.email?.split("@")[1];
    // const adminDistrict = "tryeducado.com";

    const districtTutors = await prisma.tutor.findMany({
        where: {
            district: adminDistrict,
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    const districtTutorIds = districtTutors.map((tutor) => tutor.id);

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

                <DistrictQuestions limit={100} tutorIds={districtTutorIds} />
            </div>
        </>
    );
};
export default ChatLogs;
