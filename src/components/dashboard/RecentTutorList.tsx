"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import { ChevronDown, Globe, Search } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { sub } from "date-fns";
import { TutorCard } from "../tutorsList/TutorCard";

type Props = { tutorList: any; userId: string };
const RecentTutorList = ({ tutorList, userId }: Props) => {
    console.log(tutorList);
    return (
        <main className="p-8 pt-5  md:pt-5 xl:p-5 mx-auto max-w-7xl lg:max-w-[80rem] ">
            <div className="">
                {tutorList.length > 0 ? (
                    <div className="relative flex items-center  overflow-x-auto  gap-5 mt-5">
                        {tutorList.map((tutor: any, i: any) => {
                            return (
                                <TutorCard
                                    name={tutor.tutorDisplayName}
                                    id={tutor.id}
                                    description={tutor.tutorDescription!}
                                    joinCode={tutor.joinCode!}
                                    grade={
                                        tutor.grade ? tutor.grade : "Not Set"
                                    }
                                    subject={
                                        tutor.subject
                                            ? tutor.subject
                                            : "Not Set"
                                    }
                                    userId={userId}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <h1 className="text-zinc-500 text-[15px] mt-5 w-10/12 dark:text-zinc-300 mb-5 ">
                        No recent tutors yet! Start a chat with a tutor to see
                        them here
                    </h1>
                )}
            </div>
        </main>
    );
};
export default RecentTutorList;
