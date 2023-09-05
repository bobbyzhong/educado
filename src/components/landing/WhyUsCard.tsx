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
      <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-[35%]  rounded-[30px]">
        <CardHeader>
          <CardTitle className="font-bold w-full flex flex-row text-4xl gap-3">
            <div>{icon}</div>
            <div>{title}</div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-left text-2xl w-[90%]">{description}</div>
        </CardContent>
      </Card>
    </>
  );
};

export default WhyUsCard;
