"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

import { Plus, PlusCircle, PlusIcon, UploadCloud } from "lucide-react";
import { UploadContentModal } from "./UploadContentModal";
import { CreateTutorModal } from "./CreateTutorModal";
import { Button } from "../ui/button";
import { CreateHelperModal } from "./CreateHelperModal";

type Props = { userId: string };
const CreateHelperCard = ({ userId }: Props) => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <div>
            <div>
                <Button
                    onClick={() => {
                        setShowModal(true);
                    }}
                    className="hover:cursor-pointer flex flex-row text-sm items-center gap-1"
                    variant={"greenOutline"}
                >
                    <Plus size={20} /> Create Helper!
                </Button>
            </div>

            <CreateHelperModal
                isVisible={showModal}
                onClose={() => {
                    setShowModal(false);
                }}
                userId={userId}
            />
        </div>
    );
};
export default CreateHelperCard;
