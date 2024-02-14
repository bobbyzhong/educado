"use client";
import { useCallback, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { createWorker } from "tesseract.js";
import { Button } from "@/components/ui/button";
import { useChat } from "ai/react";
import axios from "axios";
import { set } from "date-fns";

type Props = {};

const OCR = (props: Props) => {
    const [selectedImage, setSelectedImage] = useState<any>(null);
    const [textResult, setTextResult] = useState<any>("");
    const [steps, setSteps] = useState<any>([]);
    const [knowns, setKnowns] = useState<any>("");
    const [unknowns, setUnknowns] = useState<any>("");

    const handleChangeImage = (e: any) => {
        // console.log(e.target.files[0]);
        setSelectedImage(URL.createObjectURL(e.target.files[0]));
    };

    const convertImageToText = useCallback(async () => {
        if (!selectedImage) return;
        setTextResult("");
        const worker = await createWorker("eng");
        const { data } = await worker.recognize(selectedImage);
        setTextResult(data.text);
        await worker.terminate();
    }, [selectedImage]);

    // const convertImageToText = async () => {
    //     const worker = await createWorker("eng");
    //     const { data } = await worker.recognize(selectedImage);
    //     setTextResult(data.text);
    //     await worker.terminate();
    // };

    useEffect(() => {
        convertImageToText();
    }, [selectedImage, convertImageToText]);

    const handleStartProblem = async () => {
        console.log("Problem: ", textResult);
        const res = await axios.post("/api/ocrTest", {
            textResult,
        });
        //         const res = `{
        //     "steps": [
        //         "Calculate the total length of the border by multiplying the number of bricks by the length of each brick: Total border length = 553 inches",
        //         "Determine the number of bricks needed by dividing the total border length by the length of each brick: Number of bricks = Total border length / Length of each brick",
        //         "Number of bricks = 553 inches / 8 inches = 69.125 bricks",
        //         "Round up to the nearest whole number since Barb cannot use a fraction of a brick: Barb will need 70 bricks to make the border."
        //     ]
        // }`;
        console.log("RES DATA: ", res);
        // const resObj = JSON.parse(res);
        const resObj = JSON.parse(res.data.data);
        const steps = resObj.steps;
        // const knowns = resObj.knowns;
        // const unknowns = resObj.unknowns;
        setSteps(steps);
        // setKnowns(knowns);
        // setUnknowns(unknowns);
    };

    return (
        <main className="p-8 md:pt-8 xl:p-5 mx-auto max-w-7xl lg:max-w-[80rem] mt-3">
            <div className=" flex flex-col w-full items-center justify-center gap-1 ">
                <h2 className="mr-2 text-[26px] font-bold tracking-tight ">
                    OCR Test
                </h2>
                <div className="flex flex-col w-9/12">
                    <Input
                        className="cursor-pointer"
                        type="file"
                        accept="image/*"
                        onChange={handleChangeImage}
                    />

                    <div className="mt-10 p-5 border-2">
                        {selectedImage && (
                            <div>
                                <Image
                                    src={selectedImage}
                                    height={800}
                                    width={800}
                                    alt=""
                                />
                            </div>
                        )}
                    </div>
                    <div className="mt-10 p-5 border-2">
                        {textResult && (
                            <div className="">
                                <p>{textResult}</p>
                            </div>
                        )}
                    </div>
                    <Button
                        onClick={handleStartProblem}
                        disabled={!textResult ? true : false}
                    >
                        Start
                    </Button>
                </div>

                <div className="mt-10 p-5 border-2 w-9/12">
                    <div>Knowns: {knowns && <div>{knowns}</div>}</div>
                    <div>Unknowns: {knowns && <div>{unknowns}</div>}</div>
                    <div>
                        STEPS:
                        {steps && (
                            <div>
                                {steps.map((step: any, index: number) => (
                                    <div key={index}>
                                        <p>
                                            Step {index + 1}. {step}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};
export default OCR;
