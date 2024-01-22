"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = { tutor: any; userId: any; userName: any };
const CopyFigure = ({ tutor, userId, userName }: Props) => {
    const router = useRouter();

    const copyTutor = async () => {
        const res: any = await axios.post("/api/copyFigure", {
            tutorDisplayName: tutor.tutorDisplayName,
            tutorName: tutor.tutorName,
            tutorDescription: tutor.tutorDescription,
            tutorType: tutor.tutorType,
            placeholderQs: tutor.placeholderQs,
            basePrompt: tutor.basePrompt,
            uploadedContent: tutor.uploadedContent,
            userId: userId,
            userName: userName,
        });
        if (res.status === 200) {
            router.push(`/manage-tutors/tutor/${res.data.tutorId}`);
        } else {
            console.log("error", res.error);
        }
    };

    return (
        <div>
            {" "}
            <Card
                onClick={copyTutor}
                className="hover:cursor-pointer hover:-translate-y-[2px] transition-all hover:opacity-75 flex rounded-md shadow-sm p-3 "
            >
                <CardHeader className="flex flex-row items-center justify-between w-full space-y-0 mb-0">
                    <CardTitle className="text-[19px] font-bold tracking-tight">
                        Copy to Collection
                    </CardTitle>
                    <Copy size={26} />
                </CardHeader>
            </Card>
        </div>
    );
};
export default CopyFigure;
