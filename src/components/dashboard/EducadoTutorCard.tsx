"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BookUp, ClipboardSignature, Clock, UserCircle } from "lucide-react";
import Image from "next/image";

type Props = {};

const EducadoTutorCard = (props: Props) => {
    const router = useRouter();
    return (
        <>
            <Card
                className="hover:cursor-pointer hover:opacity-75 flex flex-col justify-between rounded-md shadow-sm p-6"
                onClick={() => {
                    router.push("/manage-tutors");
                }}
            >
                <div>
                    <CardHeader className="flex flex-col gap-2 mb-3 p-0">
                        <UserCircle
                            className="rounded-md"
                            size={30}
                            strokeWidth={2}
                            color="#86D20A"
                        />
                        <CardTitle className="text-[19px] font-bold ">
                            Educado Tutor
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col justify-between p-0">
                        <p className="text-[14.5px] text-muted-foreground leading-6 w-[98%]">
                            Create and manage tutors for your students. See what
                            questions they've been asking and add content for
                            your tutor to use.
                        </p>
                    </CardContent>
                </div>
                <div className="w-full flex items-center mt-4">
                    <p className="text-[16px] text-green font-[550] mr-2">
                        Manage Tutors
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

export default EducadoTutorCard;
