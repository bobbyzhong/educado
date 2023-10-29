import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
    Bell,
    BellOff,
    ClipboardSignature,
    Clock,
    ContactIcon,
} from "lucide-react";
import { QuizModal } from "./QuizModal";
import Image from "next/image";
import { prisma } from "@/lib/db";

type Props = { userId: string };

const notifs = [
    "Hello I aam the first notification",
    "THis student asked this question recently",
    "23 students asked questions about this topic questions ",
    "23 students asked questions about this topic questions ",
    "23 students asked questions about this topic questions ",
    "23 students asked questions about this topic questions ",
    "23 students asked questions about this topic questions ",
    "23 students asked questions about this topic questions ",
    "23 students asked questions about this topic questions ",
];

const NotifCard = async ({ userId }: Props) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    const notifs = user?.notifs;

    let notifList: any = [];
    if (notifs === undefined || notifs === null) {
        notifList = [];
    } else {
        notifList = notifs?.split(",");
        notifList = notifList.slice(1, notifList.length);
    }

    return (
        <>
            <Card className=" flex flex-col justify-between h-[20.4rem] rounded-xl shadow-sm pt-4 pl-5">
                {notifList.length > 0 ? (
                    <div className="flex flex-col gap-3 overflow-y-scroll ">
                        {notifList.map((notif: any, index: any) => (
                            <div
                                className="flex flex-row items-center gap-2 border-b border-zinc-200 pb-2"
                                key={index}
                            >
                                <div>
                                    <Bell
                                        className=" rounded-md"
                                        size={22.5}
                                        strokeWidth={1.8}
                                        color="#86D20A"
                                    />
                                </div>
                                <p className="text-[15px]">{notif}</p>
                            </div>
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
