"use client";

import { set } from "date-fns";
import React from "react";
import { useEffect, useState } from "react";
import useSpeechRecognition from "../../../customHooks/SpeechHook";

type Props = {};

const SpeechTest = (props: Props) => {
    const {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport,
    } = useSpeechRecognition();

    return (
        <div className="mt-20 flex flex-row w-full justify-between px-20">
            <div className="flex flex-row">
                <h2 className="mr-10">Current Note</h2>
                {hasRecognitionSupport ? (
                    <>
                        <div className="mr-5">
                            <button onClick={startListening}>
                                Start listening
                            </button>
                        </div>
                        <div className="mr-5">
                            <button onClick={stopListening}>
                                Stop listening
                            </button>
                        </div>
                        {isListening ? <div>Listening...</div> : null}
                        {text}
                    </>
                ) : (
                    <h1>Sorry browser has no speech recognition support</h1>
                )}
            </div>
            <div>
                <h1>Trancript</h1>
            </div>
            <div>
                <h2>Notes</h2>
            </div>
        </div>
    );
};
export default SpeechTest;
