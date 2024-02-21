import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { TutorCard } from "@/components/tutor/TutorCard";
import CreateTutorCard from "@/components/tutor/CreateTutorCard";
import CreateHelperCard from "@/components/tutor/CreateHelperCard";
import { HelperCard } from "@/components/tutor/HelperCard";

type Props = {};

export const metadata = {
    title: "Manage Helpers | Educado",
};

const ManageHelpers = async (props: Props) => {
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

    let tutors: any = [];

    if (user?.isAdmin) {
        tutors = await prisma.tutor.findMany({
            where: {
                // userId: session.user.id,
                district: user?.email?.split("@")[1],
                isHomework: true,
                NOT: {
                    tutorType: "Figure",
                    isHomework: false,
                },
            },
            orderBy: {
                dateCreated: "desc",
            },
        });
    } else if (user?.isTeacher) {
        tutors = await prisma.tutor.findMany({
            where: {
                userId: session.user.id,
                isHomework: true,
                NOT: {
                    tutorType: "Figure",
                },
            },
            orderBy: {
                dateCreated: "desc",
            },
        });
    }

    return (
        <main className="p-8  md:pt-8 xl:p-5 mx-auto max-w-7xl lg:max-w-[80rem] mt-3">
            <div className=" flex flex-col w-full items-center justify-center gap-1 ">
                <h2 className="mr-2 text-[26px] font-bold tracking-tight ">
                    Your District's Homework Helpers
                </h2>
                <h1 className="text-zinc-500 text-[15px] text-center w-12/12 md:w-5/12 dark:text-zinc-300 mb-2 ">
                    Below are the homework helpers that your district's students
                    has access to. Click on one to see it's data!
                </h1>
                <div className="mb-5">
                    <CreateHelperCard userId={session.user.id} />
                </div>
                <div className="">
                    {tutors.length > 0 ? (
                        <div className="grid md:grid-cols-2 grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
                            {tutors.map((tutor: any, i: any) => {
                                return (
                                    <div key={i}>
                                        <HelperCard
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
                                No tutors here yet. Create one or explore our
                                library to get your first one!
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
export default ManageHelpers;
