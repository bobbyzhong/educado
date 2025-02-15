"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

type Props = {
    name: string;
    description: string;
    joinCode: string;
    grade: string;
    subject: string;
    id: string;
    userId: string;
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

export function TutorCard({
    name,
    description,
    joinCode,
    grade,
    subject,
    id,
    userId,
}: Props) {
    const notifications = [
        {
            title: "Description",
            description: truncateAfterTenWords(description),
        },
        {
            title: "Grade Level",
            description: grade,
        },
        {
            title: "Subject",
            description: subject,
        },
    ];

    const handleClickChat = async () => {
        const res = await fetch("/api/updateRecentTutors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                userId: userId,
                code: id,
            }),
        });
    };

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
                        onClick={handleClickChat}
                    >
                        {description != "Coming Soon!"
                            ? `Join Chat`
                            : "Under Construction"}
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
