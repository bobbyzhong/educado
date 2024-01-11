"use client";
import React from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";

type Props = {
    icon: any;
    title: string;
    description: string;
};

const WhyUsCard = ({ icon, title, description }: Props) => {
    return (
        <>
            <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px]">
                <CardHeader className="md:pb-5 pb-0">
                    <CardTitle className="font-bold w-full flex flex-row text-2xl md:text-4xl gap-2 md:gap-3 ">
                        <div>{icon}</div>
                        <div>{title}</div>
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-left text-lg md:text-2xl w-[95%]">
                        {description}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default WhyUsCard;
