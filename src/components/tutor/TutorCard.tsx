import { BellRing, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

type Props = {
    name: string;
    description: string;
    joinCode: string;
    status: string;
    id: string;
};

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

export function TutorCard({ name, description, joinCode, status, id }: Props) {
    const notifications = [
        {
            title: "Description",
            description: truncateAfterTenWords(description),
        },
        {
            title: "Join Code",
            description: joinCode,
        },
        {
            title: "Status",
            description: status,
        },
    ];
    return (
        <Card className="w-[300px] max-h-[25rem] shrink-0">
            <CardHeader className="py-4">
                <CardTitle className="text-[19px] font-bold tracking-tight text-green">
                    <span className="text-base text-zinc-400 font-semibold tracking-tight mr-[2px]">
                        Tutor Name:{" "}
                    </span>
                    {name}
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
                    href={`/manage-tutors/tutor/${id}`}
                    target="_blank"
                >
                    <Button variant={"green"} className="w-full">
                        {name}'s Details
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
