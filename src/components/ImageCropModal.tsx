import React, { useState, useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import Image from "next/image";
import ReactCrop, {
    centerCrop,
    makeAspectCrop,
    Crop,
    PixelCrop,
    convertToPixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { set } from "date-fns";

type Props = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedImage: any;
    setSelectedImage: (image: any) => void;
    setCroppedImage: (image: any) => void;
    setBase64: any;
};
export const ImageCropModal = ({
    open,
    setOpen,
    selectedImage,
    setSelectedImage,
    setCroppedImage,
    setBase64,
}: Props) => {
    const [crop, setCrop] = useState<Crop>({
        unit: "%",
        x: 0,
        y: 0,
        width: 75,
        height: 75,
    });

    const imgRef = useRef(null);

    const getCroppedImg = async (image: any, crop: any) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = crop.width * scaleX;
        canvas.height = crop.height * scaleY;
        const ctx: any = canvas.getContext("2d");

        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            canvas.width,
            canvas.height
        );

        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                resolve(blob);
            }, "image/jpeg");
        });
    };

    const toBase64 = (blob: Blob) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return new Promise((resolve) => {
            reader.onloadend = () => {
                resolve(reader.result);
            };
        });
    };

    const onSubmitCrop = async () => {
        if (crop?.width && crop?.height && imgRef.current) {
            const croppedBlob: any = await getCroppedImg(imgRef.current, crop);

            const base64 = await toBase64(croppedBlob);
            setBase64(base64);
            setCroppedImage(URL.createObjectURL(croppedBlob));
            setOpen(false);
        }
    };

    const handleAbort = () => {
        setOpen(false);
        setSelectedImage(null);
    };

    return (
        <Drawer dismissible={false} open={open} onClose={handleAbort}>
            <DrawerContent>
                <div className="relative p-4 w-full max-w-screen h-[90vh] flex flex-col items-center">
                    <DrawerHeader className="flex flex-col justify-center items-center">
                        <DrawerTitle>Crop Image</DrawerTitle>
                        <DrawerDescription>
                            Select the question you would like to solve
                            together.
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="flex flex-col justify-center items-center overflow-auto border-2">
                        {selectedImage && (
                            <div className="relative p-4 h-full max-h-[80vh] sm:max-h-[70vh]">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) =>
                                        setCrop(percentCrop)
                                    }
                                    onComplete={(c) => setCrop(c)}
                                    minHeight={10}
                                >
                                    <Image
                                        src={selectedImage}
                                        ref={imgRef}
                                        width={800}
                                        height={800}
                                        alt="Homework Image"
                                    />
                                </ReactCrop>
                            </div>
                        )}
                    </div>
                    <DrawerFooter className="fixed bottom-4">
                        <Button variant={"green"} onClick={onSubmitCrop}>
                            Submit
                        </Button>
                        <DrawerClose asChild>
                            <Button
                                variant="greenOutline"
                                onClick={handleAbort}
                            >
                                Cancel
                            </Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    );
};
