"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
    BarChart3,
    BookKey,
    ContactIcon,
    Library,
    Loader2,
    MessagesSquare,
} from "lucide-react";
import Image from "next/image";

type Props = {
    icon: any;
    title: string;
    description: string;
    pageLink: string;
};

const DashboardCard = ({ icon, title, description, pageLink }: Props) => {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    return (
        <>
            <Card
                className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-6"
                onClick={() => {
                    setIsLoading(true);
                    router.push(`${pageLink}`);
                }}
            >
                <div>
                    <CardHeader className="flex flex-col gap-2 mb-3 p-0">
                        {icon == "tutor" ? (
                            <BookKey
                                className="rounded-md"
                                size={30}
                                strokeWidth={2}
                                color="#86D20A"
                            />
                        ) : icon == "library" ? (
                            <Library
                                className="rounded-md"
                                size={30}
                                strokeWidth={2}
                                color="#86D20A"
                            />
                        ) : icon == "figure" ? (
                            <ContactIcon
                                className="rounded-md"
                                size={30}
                                strokeWidth={2}
                                color="#86D20A"
                            />
                        ) : icon == "contact" ? (
                            <MessagesSquare
                                className="rounded-md"
                                size={30}
                                strokeWidth={2}
                                color="#86D20A"
                            />
                        ) : icon == "analytics" ? (
                            <BarChart3
                                className="rounded-md"
                                size={30}
                                strokeWidth={2}
                                color="#86D20A"
                            />
                        ) : (
                            <></>
                        )}

                        <CardTitle className="text-[19px] font-bold ">
                            {title}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between p-0">
                        <p className="text-[14.5px] text-muted-foreground leading-6 w-[98%]">
                            {description}
                        </p>
                    </CardContent>
                </div>
                <div className="w-full flex items-center mt-4">
                    <p className="text-[16px] text-green font-[550] mr-2">
                        Continue
                    </p>
                    {isLoading ? (
                        <Loader2
                            color="#86D20A"
                            className="animate-spin"
                            size={22}
                        />
                    ) : (
                        <Image
                            src={"icons/greenarrow.svg"}
                            height={20}
                            width={20}
                            alt={""}
                        />
                    )}
                </div>
            </Card>
        </>
    );
};

export default DashboardCard;
