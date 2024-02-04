import { useState, useEffect } from "react";

const useSpeechRecognition = (language: any) => {
    const [text, setText] = useState("");
    const [isListening, setIsListening] = useState(false);
    // console.log(language);
    let recognition: any = null;
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
        recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.lang = "en-US";
    }

    useEffect(() => {
        if (
            typeof window !== "undefined" &&
            "webkitSpeechRecognition" in window
        ) {
            recognition = new window.webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.lang = language;
        }
        if (!recognition) return;

        recognition.onresult = (event: any) => {
            setText(event.results[0][0].transcript);
            recognition.stop();
            setIsListening(false);
        };
    }, [language]);

    const startListening = () => {
        setText("");
        setIsListening(true);
        recognition.start();
    };

    const stopListening = () => {
        setIsListening(false);
        recognition.stop();
    };

    return {
        text,
        isListening,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    };
};

export default useSpeechRecognition;

// import { useState, useEffect } from "react";

// let recognition: any = null;

// const initializeRecognition = (lang: string) => {
//     if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
//         recognition = new window.webkitSpeechRecognition();
//         recognition.continuous = true;
//         recognition.lang = lang;
//     }
// };

// const useSpeechRecognition = (language: string) => {
//     const [text, setText] = useState("");
//     const [isListening, setIsListening] = useState(false);

//     useEffect(() => {
//         initializeRecognition(language);

//         if (!recognition) return;

//         const handleResult = (event: any) => {
//             setText(event.results[0][0].transcript);
//             recognition.stop();
//             setIsListening(false);
//         };

//         recognition.onresult = handleResult;

//         return () => {
//             recognition.onresult = null;
//         };
//     }, [language]);

//     const startListening = () => {
//         setText("");
//         setIsListening(true);
//         recognition.start();
//     };

//     const stopListening = () => {
//         setIsListening(false);
//         recognition.stop();
//     };

//     return {
//         text,
//         isListening,
//         startListening,
//         stopListening,
//         hasRecognitionSupport: !!recognition,
//     };
// };

// export default useSpeechRecognition;
