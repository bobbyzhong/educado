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

const FeatureCard = ({ icon, title, description }: Props) => {
    return (
        <>
            <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px] ">
                <CardHeader className="md:pb-1 pb-0">
                    <CardTitle className="font-bold w-full flex text-start flex-row text-lg md:text-[23px] gap-2 md:gap-5 mb-1 ">
                        <div>{icon}</div>
                        <div>{title}</div>
                    </CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-left text-base md:text-[17px] w-[95%]">
                        {description}
                    </div>
                </CardContent>
            </Card>
        </>
    );
};

export default FeatureCard;
