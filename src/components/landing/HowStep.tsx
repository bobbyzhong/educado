"use client";
import React from "react";

import Image from "next/image";

type Props = {
  step: string;
  title: string;
  description: string;
  image: string;
};

const HowStep = ({ step, title, description, image }: Props) => {
  return (
    <>
      <div className="flex justify-between items-center mx-[17%] mt-[5%]">
        <div className="w-[47%] flex-col justify-center flex">
          <div className="flex items-center gap-5">
            <h1 className="text-[11rem] text-[#8bb83f]/[0.4] font-bold leading-[1.1]">
              {step}
            </h1>
            <h1 className="text-6xl font-bold ">{title}</h1>
          </div>
          <p className=" text-2xl text-left text-[#634848] w-[80%]">
            {description}
          </p>
        </div>

        <Image
          className="w-[50%] lg:block hidden object-cover"
          src={image}
          height={800}
          width={800}
          alt=""
        />
      </div>
    </>
  );
};

export default HowStep;
