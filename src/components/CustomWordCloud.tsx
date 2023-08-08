"use client";

import { useTheme } from "next-themes";
import React from "react";
import D3WordCloud from "react-d3-cloud";

const data = [
    {
        text: "hey",
        value: 3,
    },
    {
        text: "Computer",
        value: 8,
    },
    {
        text: "nextjs",
        value: 10,
    },
    {
        text: "live",
        value: 7,
    },
];

const fontSizeMapper = (word: { value: number }) =>
    Math.log2(word.value) * 5 + 16;

type Props = {};
const CustomWordCloud = (props: Props) => {
    const theme = useTheme();

    return (
        <>
            <D3WordCloud
                height={550}
                font={"Times"}
                fontSize={fontSizeMapper}
                fill={theme.theme == "dark" ? "white" : "black"}
                padding={10}
                data={data}
            />
        </>
    );
};
export default CustomWordCloud;
