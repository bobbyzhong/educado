import HistoryCard from "@/components/dashboard/HistoryCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import CheckInCard from "@/components/dashboard/CheckInCard";
import ContactCard from "@/components/dashboard/ContactCard";
import ContentRequestCard from "@/components/dashboard/ContentRequestCard";
import EducadoTutorCard from "@/components/dashboard/EducadoTutorCard";
import { prisma } from "@/lib/db";
import HistoryTable from "@/components/HistoryTable";
import Link from "next/link";
import { TutorCard } from "@/components/tutor/TutorCard";
import CreateTutorCard from "@/components/tutor/CreateTutorCard";

type Props = {};

export const metadata = {
    title: "Dashboard | Pear",
};

const ManageTutor = async (props: Props) => {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }

    const tutors = await prisma.tutor.findMany({
        where: {
            userId: session.user.id,
        },
    });

    return (
        <main className="p-8  md:pt-8 xl:p-5 mx-auto max-w-7xl lg:max-w-[80rem] mt-3">
            <div className=" flex flex-col w-full items-center justify-center gap-1 ">
                <h2 className="mr-2 text-[26px] font-bold tracking-tight ">
                    Your Tutors
                </h2>
                <h1 className="text-zinc-500 text-[15px] text-center w-5/12 dark:text-zinc-300 mb-2 ">
                    Below are the tutors you've made or have access to. Click on
                    one to manage or share that specific tutor!
                </h1>
                <div className="mb-5">
                    <CreateTutorCard userId={session.user.id} />
                </div>
                <div className="">
                    {tutors.length > 0 ? (
                        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
                            {tutors.map((tutor, i) => {
                                return (
                                    <div key={i}>
                                        <TutorCard
                                            name={tutor.tutorDisplayName}
                                            id={tutor.id}
                                            description={
                                                tutor.tutorDescription!
                                            }
                                            joinCode={tutor.joinCode!}
                                            status={"Active"}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div></div>
                    )}
                </div>
            </div>

            {/* <div className="flex items-center mb-5 mt-10">
                <div className=" flex flex-col gap-1">
                    <h2 className="mr-2 text-[26px] font-semibold tracking-tight ">
                        Student Data
                    </h2>
                    <h1 className="text-zinc-500 text-[15px] w-10/12 dark:text-zinc-300 mb-5 ">
                        Coming soon! Here you'll be able to see things like
                        commonly asked questions, most active students, and
                        more!
                    </h1>
                </div>
            </div> */}
        </main>
    );
};
export default ManageTutor;
