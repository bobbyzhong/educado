import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";

import { TutorCard } from "@/components/tutor/TutorCard";
import CreateTutorCard from "@/components/tutor/CreateTutorCard";
import CreateFigureCard from "@/components/tutor/CreateFigureCard";
import { Button } from "@/components/ui/button";
import { Library } from "lucide-react";
import Link from "next/link";

type Props = {};

export const metadata = {
    title: "Dashboard | Pear",
};

const ManageTutor = async (props: Props) => {
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
                    Famous Figures
                </h2>
                <h1 className="text-zinc-500 text-[15px] text-center w-12/12 md:w-5/12 dark:text-zinc-300 mb-2 ">
                    Below are the AI historical figures you've created or have
                    access to. Click on one to update or share it!
                </h1>
                <div className="mb-5 flex flex-row gap-3">
                    <CreateFigureCard userId={session.user.id} />
                    <Link href={"/library"}>
                        <Button
                            className="hover:cursor-pointer flex flex-row text-sm items-center gap-1"
                            variant={"greenOutline"}
                        >
                            <Library size={20} /> Explore Library
                        </Button>
                    </Link>
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
                                            type={tutor.tutorType!}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="w-full mt-6">
                            <h1 className="text-zinc-500 text-[15px] text-center dark:text-zinc-300 mb-2 ">
                                No historical figures here yet. Create one or
                                explore our library to get your first one!
                            </h1>
                        </div>
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
