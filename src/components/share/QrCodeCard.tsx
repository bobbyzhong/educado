"use client";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { QrCodeIcon } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { QrCodeModal } from "./QrCodeModal";

type Props = { link: string };
const QrCodeCard = ({ link }: Props) => {
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
                        Open QR Code
                    </CardTitle>
                    <QrCodeIcon />
                </CardHeader>
            </Card>
            <QrCodeModal
                isVisible={showModal}
                link={link}
                onClose={() => {
                    setShowModal(false);
                }}
            />
        </div>
    );
};
export default QrCodeCard;
