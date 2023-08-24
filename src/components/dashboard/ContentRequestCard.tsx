"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BookUp, ClipboardSignature, Clock } from "lucide-react";
import { QuizModal } from "./QuizModal";
import Image from "next/image";

type Props = {};

const ContentRequestCard = (props: Props) => {
    const router = useRouter();
    return (
        <>
            <Card
                className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-6"
                onClick={() => {
                    router.push("/contentRequest");
                }}
            >
                <div>
                    <CardHeader className="flex flex-col gap-2 mb-3 p-0">
                        <BookUp
                            className="rounded-md"
                            size={30}
                            strokeWidth={2}
                            color="#86D20A"
                        />
                        <CardTitle className="text-[19px] font-bold ">
                            Content Request
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between p-0">
                        <p className="text-[14.5px] text-muted-foreground leading-6 w-[98%]">
                            Request for your classroom's textbook or the slides
                            you made in class to be added so you can create
                            check-ins based on your own content
                        </p>
                    </CardContent>
                </div>
                <div className="w-full flex items-center mt-4">
                    <p className="text-[16px] text-green font-[550] mr-2">
                        Add Content
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

export default ContentRequestCard;
