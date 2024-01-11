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
            <div className="flex md:flex-row flex-col justify-between items-center mx-[10%] md:mx-[15%] mt-[5%]">
                <div className="md:w-[47%] w-full flex-col md:justify-center flex md:mb-0 mb-10">
                    <div className="flex items-center gap-5 ">
                        <h1 className="md:text-[11rem] text-[8rem] text-[#8bb83f]/[0.4] font-bold leading-[1.1]">
                            {step}
                        </h1>
                        <h1 className="md:text-6xl text-3xl font-bold text-left ">
                            {title}
                        </h1>
                    </div>
                    <p className=" text-2xl text-left text-[#634848] w-full md:w-[80%]">
                        {description}
                    </p>
                </div>

                <Image
                    className="md:w-[50%] w-[90%] object-cover"
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
