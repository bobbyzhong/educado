"use client";
import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

const WhyCard = () => {
  return (
    <>
      <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-[35%] h-[25vh] rounded-[30px]">
        <CardHeader>
          <CardTitle className="font-bold w-full flex flex-row text-4xl gap-3">
            <div>⚡</div>
            <div>Instant Result</div>
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-left text-2xl w-[90%]">
            Quickly identify which students are falling behind or which topics
            you might want to go over again next class
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default WhyCard;
