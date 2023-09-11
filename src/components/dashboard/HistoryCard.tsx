"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { ClipboardSignature, Clock } from "lucide-react";
import { QuizModal } from "./QuizModal";
import Image from "next/image";

type Props = {};

const CheckInCard = (props: Props) => {
    const [showModal, setShowModal] = React.useState(false);
    const router = useRouter();
    return (
        <>
            <Card
                className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-6"
                onClick={() => {
                    router.push("/history");
                }}
            >
                <div>
                    <CardHeader className="flex flex-col gap-2 mb-3 p-0">
                        <Clock
                            className="rounded-md"
                            size={30}
                            strokeWidth={2}
                            color="#86D20A"
                        />
                        <CardTitle className="text-[19px] font-bold ">
                            View Check-In History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between p-0">
                        <p className="text-[14.5px] text-muted-foreground leading-6 w-[98%]">
                            View all the results of all the check-ins you’ve
                            given your students
                        </p>
                    </CardContent>
                </div>
                <div className="w-full flex items-center mt-4">
                    <p className="text-[16px] text-green font-[550] mr-2">
                        Get Started
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

export default CheckInCard;
