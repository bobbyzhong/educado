import React from "react";
import { ClipboardCopy } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Button } from "../ui/button";

function truncateAfterTenWords(inputString: string) {
    // Split the input string into words
    const words = inputString.split(" ");

    // Check if the input has more than 10 words
    if (words.length <= 10) {
        return inputString; // Return the original string if it has 10 or fewer words
    } else {
        // Take the first 10 words, join them back into a string, and append '...'
        const truncatedString = words.slice(0, 11).join(" ") + " ...";
        return truncatedString;
    }
}

type Props = { tutorId: string; key: string };
const StudDashCopy = async ({ tutorId }: Props) => {
    const tutor = await prisma.tutor.findUnique({
        where: {
            id: tutorId!,
        },
    });

    const notifications = [
        {
            title: "Teacher Name",
            description: truncateAfterTenWords(tutor?.ownerName!),
        },
        {
            title: "Join Code",
            description: tutor?.joinCode,
        },
        {
            title: "Status",
            description: "Active",
        },
    ];

    return (
        <Card className="w-[300px] shrink-0">
            <CardHeader className="py-4">
                <CardTitle className="text-[17px] font-bold tracking-tight text-green">
                    <span className="text-sm text-zinc-400 font-semibold tracking-tight mr-[2px]">
                        Name:{" "}
                    </span>
                    {tutor?.tutorDisplayName}
                </CardTitle>
                {/* <CardDescription></CardDescription> */}
            </CardHeader>
            <CardContent className=" pb-3">
                <div>
                    {notifications.map((notification, index) => (
                        <div
                            key={index}
                            className="mb-2 grid grid-cols-[22px_1fr] items-start pb-2 last:mb-0 last:pb-0"
                        >
                            <span className="flex h-2 w-2 translate-y-2 rounded-full bg-green2 " />
                            <div className="space-y-1">
                                <p className="text-sm font-medium ">
                                    {notification.title}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {notification.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="pt-3 pb-5  ">
                <Link
                    className="w-full"
                    href={`/tutor/${tutorId}`}
                    target="_blank"
                >
                    <Button variant={"green"} className="w-full">
                        Join Chat
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
};
export default StudDashCopy;
