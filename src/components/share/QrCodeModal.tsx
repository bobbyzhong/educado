import Link from "next/link";

import Image from "next/image";
import { X } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const QrCodeModal = ({
    isVisible,
    onClose,
    link,
}: {
    isVisible: any;
    onClose: any;
    link: string;
}) => {
    if (!isVisible) return null;

    const handleClose = (e: any) => {
        if (e.target.id === "wrapper") onClose();
    };

    return (
        <div
            className="z-[60] fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm
        flex justify-center items-center"
            id="wrapper"
            onClick={handleClose}
        >
            <div className="w-[500px] flex flex-col bg-white1 py-6 px-8 mb-5">
                <div className="flex flex-row justify-between mb-3">
                    <div></div>
                    <X onClick={onClose} cursor={"pointer"} />
                </div>
                <div className="w-full flex items-center justify-center my-3">
                    <QRCodeSVG size={330} value={link} />
                </div>
            </div>
        </div>
    );
};
