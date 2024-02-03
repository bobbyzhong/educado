"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { Textarea } from "../ui/textarea";
import TutorSearchList from "./TutorSearchList";

type Props = { tutors: any };
const TutorsList = ({ tutors }: Props) => {
    const [searchField, setSearchField] = useState("");
    const [gradeFilter, setGradeFilter] = useState("");

    const handleChange = (e: any) => {
        setSearchField(e.target.value);
    };

    const filteredFigures = tutors.filter((tutor: any) => {
        const nameMatch = tutor.tutorDisplayName
            .toLowerCase()
            .includes(searchField.toLowerCase());
        const gradeMatch = gradeFilter ? tutor.grade === gradeFilter : true;
        return nameMatch && gradeMatch;
    });

    return (
        <main className="p-8  md:pt-8 xl:p-5 mx-auto max-w-7xl lg:max-w-[80rem] mt-3">
            <div className=" flex flex-col w-full items-center justify-center gap-1 ">
                <h2 className="mr-2 text-[26px] font-bold tracking-tight ">
                    Your Tutors
                </h2>
                <h1 className="text-zinc-500 text-[15px] text-center w-12/12 md:w-5/12 dark:text-zinc-300 mb-2 ">
                    Click on any one of them to join a tutoring session with
                    them
                </h1>
                <div className="mb-5 ">
                    <div
                        className="flex flex-row justify-center items-center pl-2 pr-5 w-full py-[7px] flex-grow relative 
                             bg-white bg-gradient-to-b dark:border-gray-900/50 rounded-md border-['#D3D3D3'] border-[1.5px]
                       "
                    >
                        <Search
                            className="cursor-pointer"
                            color={"#D3D3D3"}
                            size={24}
                        />

                        <Textarea
                            tabIndex={0}
                            style={{
                                height: "18.5px",
                                overflowY: "hidden",
                            }}
                            placeholder="Search Figure"
                            className="m-0 w-full min-h-0 shadow-none  resize-none  border-0 bg-transparent p-0
                                  focus:ring focus:ring-green text-[14px] rounded-none focus-visible:ring-0  dark:text-black
                                pl-2"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                {/* FILTERING SECTION */}
                <div className="mb-5"></div>

                <div className="">
                    {tutors.length > 0 ? (
                        <div className=" flex flex-col w-full items-center justify-center gap-1 ">
                            <TutorSearchList filterdFigures={filteredFigures} />
                        </div>
                    ) : (
                        <div className="w-full mt-6">
                            <h1 className="text-zinc-500 text-[15px] text-center dark:text-zinc-300 mb-2 ">
                                No historical figures here yet. Create one or
                                explore our library to get your first one!
                            </h1>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};
export default TutorsList;
