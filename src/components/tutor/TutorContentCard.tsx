"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { UploadCloud } from "lucide-react";
import { UploadContentModal } from "./UploadContentModal";

type Props = { teacherName: string; tutorName: string };
const TutorContentCard = ({ teacherName, tutorName }: Props) => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div>
            <Card
                onClick={() => {
                    setShowModal(true);
                }}
                className="hover:cursor-pointer hover:-translate-y-[2px] transition-all hover:opacity-75 flex rounded-md shadow-sm p-3 "
            >
                <CardHeader className="flex flex-row items-center justify-between w-full space-y-0 mb-0">
                    <CardTitle className="text-[19px] font-bold tracking-tight">
                        Upload Content
                    </CardTitle>
                    <UploadCloud size={26} />
                </CardHeader>
            </Card>
            <UploadContentModal
                isVisible={showModal}
                teacherName={teacherName}
                tutorName={tutorName}
                onClose={() => {
                    setShowModal(false);
                }}
            />
        </div>
    );
};
export default TutorContentCard;
