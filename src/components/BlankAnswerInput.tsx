import React from "react";
import keyword_extractor from "keyword-extractor";

const BLANKS = "_____";

type Props = {
    answer: string;
    setBlankAnswer: React.Dispatch<React.SetStateAction<string>>;
};
const BlankAnswerInput = ({ answer, setBlankAnswer }: Props) => {
    const keywords = React.useMemo(() => {
        const words = keyword_extractor.extract(answer, {
            language: "english",
            remove_digits: false,
            return_changed_case: false,
            remove_duplicates: false,
        });
        const shuffled = words.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, 2);
    }, [answer]);

    const answerWithBlanks = React.useMemo(() => {
        const answerWithBlanks = keywords.reduce((acc, keyword) => {
            return acc.replace(keyword, BLANKS);
        }, answer);
        setBlankAnswer(answerWithBlanks);
        return answerWithBlanks;
    }, [keywords, answer, setBlankAnswer]);

    return (
        <div className="flex justify-start w-full mt-4">
            <h1 className="text-xl font-semibold">
                {answerWithBlanks.split(BLANKS).map((part, index) => {
                    return (
                        <>
                            {part}
                            {index ===
                            answerWithBlanks.split(BLANKS).length - 1 ? null : (
                                <input
                                    id="user-blank-input"
                                    className="text-center border-b-2 border-black dark:border-white w-28 focus:border-2 focus:border-b-4 focus:outline-none"
                                    type="text"
                                />
                            )}
                        </>
                    );
                })}
            </h1>
        </div>
    );
};
export default BlankAnswerInput;
