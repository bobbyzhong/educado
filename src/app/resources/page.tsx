import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

export default async function Resources() {
    return (
        <div className="flex flex-col font-outfit w-full">
            <div className="flex  flex-col justify-center items-center">
                <div className="TEXT-SECTION font-outfit flex flex-col text-center items-center mt-[12%] md:mt-[4%]">
                    <h1 className="md:text-5xl text-3xl font-[650] md:font-[650] tracking-tight w-11/12 md:w-9/12 lg:w-7/12 ">
                        Welcome to the resources page!
                    </h1>
                    <p className="md:text-[21px] text-[18px] leading-snug md:my-6 my-4 md:w-9/12 lg:w-7/12 w-11/12 text-zinc-700">
                        Our resources page is under construction. Feel free to
                        reach out to us for help anything you need. We're more
                        than happy to help and have a chat!
                    </p>
                </div>
            </div>

            <div className="w-full  flex flex-row gap-3 mb-5  justify-center ">
                <Link href={"/contact"}>
                    <Button variant={"green"} className="" size={"xl"}>
                        Contact Us
                    </Button>
                </Link>
                <Link href={"/demo"}>
                    <Button className="" size={"xl"} variant={"greenOutline"}>
                        Book Demo
                    </Button>
                </Link>
            </div>

            {/* <div className="w-full flex items-center justify-center ">
                <div className="w-11/12 md:w-8/12">
                    <Table className="mt-4 text-lg">
                        <TableCaption>End of list.</TableCaption>
                        <TableHeader>
                            <TableRow>
                                <TableHead className=" w-[50%]">
                                    Resource Title
                                </TableHead>
                                <TableHead>Link</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    Getting started with Educado
                                </TableCell>
                                <TableCell className="font-medium">
                                    <Link
                                        href={
                                            "https://docs.google.com/presentation/d/1WAXm0FO83rspXVmqctB1Zfr0YPejru6sgyS31s7-xGs/edit?usp=sharing"
                                        }
                                        target={"_blank"}
                                        className="text-green underline"
                                    >
                                        Google Slides Link
                                    </Link>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            </div> */}

            {/* FOOTER */}
            {/* <div className="flex flex-col justify-center items-center mt-[7%] gap-10">
                <div className="w-[100%] justify-center items-center flex bg-[#8bb83f]/[0.2] py-[2%] rounded-b-[20%] ">
                    <h1 className=" text-center text-3xl md:text-5xl font-[600] md:font-[650] w-10/12 md:w-7/12   mb-5">
                        Couldn't find what you're looking for? Contact us for
                        help!
                    </h1>
                </div>
            </div> */}

            {/* <div className="w-full flex-col flex items-center justify-center mt-20 mb-10">
                <h1 className="text-4xl font-semibold mb-5">
                    See how it works
                </h1>
                <iframe
                    className="md:w-[60rem] md:h-[33rem] w-[20rem] h-[12rem]"
                    src="https://www.youtube.com/embed/UWvj2qVlvsM"
                    title="YouTube video player"
                ></iframe>
            </div> */}
        </div>
    );
}
