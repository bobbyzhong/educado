"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
    ClipboardSignature,
    Clock,
    ContactIcon,
    HelpCircle,
} from "lucide-react";
import { QuizModal } from "./QuizModal";
import Image from "next/image";

type Props = {};

const ResourcesCard = (props: Props) => {
    const router = useRouter();
    return (
        <>
            <Card
                className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-6"
                onClick={() => {
                    router.push("/resources");
                }}
            >
                <div>
                    <CardHeader className="flex flex-col gap-2 mb-3 p-0">
                        <HelpCircle
                            className="rounded-md"
                            size={30}
                            strokeWidth={2}
                            color="#86D20A"
                        />
                        <CardTitle className="text-[19px] font-bold ">
                            Resources/Help Center
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between p-0">
                        <p className="text-[14.5px] text-muted-foreground leading-6 w-[98%]">
                            Not sure how to use Educado? Go to our help center
                            to watch some videos and see some guides on how to
                            get started!
                        </p>
                    </CardContent>
                </div>
                <div className="w-full flex items-center mt-4">
                    <p className="text-[16px] text-green font-[550] mr-2">
                        Continue
                    </p>
                    <Image
                        src={"icons/greenarrow.svg"}
                        height={20}
                        width={20}
                        alt={""}
                    />
                </div>
            </Card>
        </>
    );
};

export default ResourcesCard;
