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
    owner: string;
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
        const truncatedString = words.slice(0, 10).join(" ") + " ...";
        return truncatedString;
    }
}

export function FigureCard({ name, description, joinCode, owner, id }: Props) {
    const notifications = [
        {
            title: "Description",
            description: truncateAfterTenWords(description),
        },
        {
            title: "Owner Name",
            description: owner,
        },
    ];
    return (
        <Card className="w-[300px] min-h-[20rem] shrink-0 flex justify-between flex-col">
            <div>
                <CardHeader className="py-4 w-full flex items-center">
                    <CardTitle className="text-[16px] font-bold tracking-tight text-center text-green">
                        ~ {name} ~
                    </CardTitle>
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
            </div>
            <CardFooter className="pt-3 pb-5  ">
                <Link className="w-full" href={`/tutor/${id}`} target="_blank">
                    <Button
                        variant={"green"}
                        className="w-full font-bold tracking-normal "
                    >
                        {description != "Coming Soon!"
                            ? `JOIN CHAT`
                            : "Under Construction"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
