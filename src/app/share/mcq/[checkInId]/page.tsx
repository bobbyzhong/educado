import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { EyeIcon, LucideLayoutDashboard, QrCodeIcon } from "lucide-react";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CopyCard from "@/components/share/CopyCard";
import QrCodeCard from "@/components/share/QrCodeCard";
import CodeDisplay from "@/components/CodeDisplay";

type Props = {
    params: {
        checkInId: string;
    };
};
const SharePage = async ({ params: { checkInId } }: Props) => {
    const session = await getAuthSession();

    if (!session?.user) {
        return redirect("/");
    }

    const checkIn = await prisma.checkIn.findUnique({
        where: { id: checkInId },
        include: { questions: true },
    });
    if (!checkIn) {
        return redirect("/quiz");
    }

    const link = `${process.env.API_URL}/check-in/${checkInId}`;
    console.log(link);

    return (
        <>
            <div className="p-8 mx-auto max-w-5xl">
                <div className="flex items-center justify-between space-y-2">
                    <div className="flex flex-col gap-1">
                        <CodeDisplay code={checkIn.code!} />
                        <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 ">
                            Here, you’ll have other options to share the
                            check-in
                        </h1>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href="/dashboard-teacher"
                            className={buttonVariants({ variant: "green" })}
                        >
                            <LucideLayoutDashboard className="mr-2" />
                            Back to Dashboard
                        </Link>
                    </div>
                </div>

                <div className="grid gap-4 mt-4 md:grid-cols-3">
                    <CopyCard link={link} />
                    <QrCodeCard link={link} />

                    <Link target="_blank" href={`/preview/mcq/${checkInId}`}>
                        <Card className="hover:cursor-pointer hover:-translate-y-[2px] transition-all hover:opacity-75 flex rounded-md shadow-sm p-3 ">
                            <CardHeader className="flex flex-row items-center justify-between w-full space-y-0 mb-0">
                                <CardTitle className="text-[19px] font-bold tracking-tight">
                                    Try Preview
                                </CardTitle>
                                <EyeIcon />
                            </CardHeader>
                        </Card>
                    </Link>
                </div>
            </div>
        </>
    );
};
export default SharePage;
