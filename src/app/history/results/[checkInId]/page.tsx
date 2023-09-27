import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

import AllResultsTable from "@/components/AllResultsTable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type Props = {
    params: {
        checkInId: string;
    };
};
const ResultsPage = async ({ params: { checkInId } }: Props) => {
    // const session = await getAuthSession();

    const checkIn = await prisma.checkIn.findUnique({
        where: { id: checkInId },
    });
    if (!checkIn) {
        return redirect("/new-check-in");
    }

    const mostMissed = checkIn.mostMissed?.split(",");
    const notes = checkIn.notes?.split(",");

    return (
        <>
            <div className="p-8 mx-auto max-w-7xl">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex flex-col gap-1">
                        <h2 className="mr-2 text-[28px] font-medium tracking-tight">
                            Results of: {checkIn.title}
                        </h2>
                        <h2 className=" text-[18px] font-semibold text-zinc-500 tracking-tight">
                            Topic: {checkIn.topic}
                        </h2>
                    </div>
                </div>

                {checkIn.reportCreated && (
                    <div>
                        <div className="grid gap-4 mt-4 md:grid-cols-1">
                            <Card className=" hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                                <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                                    <CardTitle className="text-[19px] font-bold tracking-tight">
                                        Most Missed Questions (# missed)
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col justify-between p-0">
                                    {mostMissed!.map((question) => {
                                        return (
                                            <p
                                                key={question}
                                                className="  leading-6 w-[98%]"
                                            >
                                                {question}
                                            </p>
                                        );
                                    })}
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 mt-4 md:grid-cols-2">
                            <Card className=" hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                                <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                                    <CardTitle className="text-[19px] font-bold tracking-tight">
                                        Students who got 0% this time
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col justify-between p-0">
                                    <p className="  leading-6 w-[98%]">
                                        {checkIn.zeroStudents}
                                    </p>
                                </CardContent>
                            </Card>
                            <Card className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                                <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                                    <CardTitle className="text-[19px] font-bold tracking-tight">
                                        Average
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col justify-between p-0">
                                    <p className="  leading-6 w-[98%]">
                                        {checkIn.average}%
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                        <div className="grid gap-4 mt-4 md:grid-cols-1">
                            <Card className=" hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-4 px-7">
                                <CardHeader className="flex flex-col gap-2 mb-2 p-0">
                                    <CardTitle className="text-[19px] font-bold tracking-tight">
                                        Notes
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="flex flex-col justify-between p-0">
                                    {notes ? (
                                        notes!.map((note, index) => {
                                            return (
                                                <p
                                                    key={index}
                                                    className="  leading-6 w-[98%]"
                                                >
                                                    -{note}
                                                </p>
                                            );
                                        })
                                    ) : (
                                        <>No Notes</>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                <AllResultsTable checkInId={checkInId} />
            </div>
        </>
    );
};
export default ResultsPage;
