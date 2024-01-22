"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, PlusCircle, PlusIcon, UploadCloud } from "lucide-react";
import { UploadContentModal } from "./UploadContentModal";
import { CreateTutorModal } from "./CreateTutorModal";
import { Button } from "../ui/button";
import { CreateFigureModal } from "./CreateFigureModal";

type Props = { userId: string };
const CreateFigureCard = ({ userId }: Props) => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div>
            <div>
                <Button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    className="hover:cursor-pointer flex flex-row text-sm items-center gap-1"
                    variant={"green"}
                >
                    <Plus size={20} /> Create Figure!
                </Button>
            </div>

            <CreateFigureModal
                isVisible={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                userId={userId}
            />
        </div>
    );
};
export default CreateFigureCard;
