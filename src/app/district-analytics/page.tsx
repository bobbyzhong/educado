import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

import { Library } from "lucide-react";
import Link from "next/link";

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

    const tutors = await prisma.tutor.findMany({
        where: {
            userId: session.user.id,
            tutorType: "Figure",
        },
        orderBy: {
            dateCreated: "desc",
        },
    });

    return (
        <main className="p-8  md:pt-8 xl:p-5 mx-auto max-w-7xl lg:max-w-[80rem] mt-3">
            <div className=" flex flex-col w-full items-center justify-center gap-1 ">
                <h2 className="mr-2 text-[26px] font-bold tracking-tight ">
                    District Analytics
                </h2>
                <h1 className="text-zinc-500 text-[15px] text-center w-12/12 md:w-5/12 dark:text-zinc-300 mb-2 ">
                    Below are figures and data to analyze your district's performance.
                    Take a look to see how your students are doing!
                </h1>

                <div className="">
                    
                </div>
            </div>
        </main>
    );
};
export default DistrictAnalytics;
