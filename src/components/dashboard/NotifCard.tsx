import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    Bell,
    BellOff,
    ClipboardSignature,
    Clock,
    ContactIcon,
    ExternalLink,
} from "lucide-react";
import { QuizModal } from "./QuizModal";
import Image from "next/image";
import { prisma } from "@/lib/db";
import Link from "next/link";

type Props = { userId: string };

const NotifCard = async ({ userId }: Props) => {
    const notifList = await prisma.notifications.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            date: "desc",
        },
    });

    return (
        <>
            <Card className=" flex flex-col justify-between h-[20.4rem] rounded-xl shadow-sm pt-4 pl-5 w-[50%]">
                {notifList.length > 0 ? (
                    <div className="flex flex-col gap-3 overflow-y-scroll ">
                        {notifList.map((notif: any, index: any) => (
                            <Link href={`/convoLog/${notif.studentId}`}>
                                <div
                                    className="flex flex-row items-center justify-between pr-6 gap-2 border-b border-zinc-200 pb-2"
                                    key={index}
                                >
                                    <div className="flex flex-row items-center gap-2 w-full">
                                        <div>
                                            <Bell
                                                className=" rounded-md"
                                                size={20}
                                                strokeWidth={1.8}
                                                color="#86D20A"
                                            />
                                        </div>
                                        <div className="flex flex-row items-center w-full justify-between  ">
                                            <p className="text-[15px]">
                                                {notif.content}
                                            </p>
                                            <p className="text-[12px] text-zinc-500">
                                                {notif.date}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <ExternalLink
                                            className=" rounded-md "
                                            size={18}
                                            strokeWidth={1.8}
                                            color="#86D20A"
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col gap-1 items-center justify-center mt-20 w-full ">
                        <BellOff size={50} strokeWidth={1.8} color="#86D20A" />
                        <div className="text-zinc-500 font-medium ">
                            No Notifcations
                        </div>
                        <div className="text-zinc-400 text-[13px] text-center   ">
                            Any notifications you get from Educado will show up
                            here
                        </div>
                    </div>
                )}
            </Card>
        </>
    );
};

export default NotifCard;
