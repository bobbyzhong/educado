import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const QuizModalLink = ({
    title,
    icon,
    link,
    children,
}: {
    title: any;
    children: any;
    icon: any;
    link: any;
}) => {
    return (
        <Link
            href={link}
            className="flex flex-row justify-between items-center hover:border-green hover:scale-[1.02]
             border-[1.5px] px-4 py-3 rounded-[4.55px] border-gray2"
        >
            <Image
                src={icon}
                height={50}
                width={50}
                alt="raw"
                className="w-[14.5%]"
            />
            <div className="flex flex-col ml-4 pr-2">
                <h1 className="text-base font-[560]">{title}</h1>
                <p className="text-[13px] text-zinc-500">{children}</p>
            </div>
            <ChevronRight className="w-8 h-8" />
        </Link>
    );
};
