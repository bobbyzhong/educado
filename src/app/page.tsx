import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import SignInButton from "@/components/SignInButton";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import SignInButtonLg from "@/components/SignInButtonLg";
import Link from "next/link";
import Image from "next/image";
import { ChevronsDown } from "lucide-react";

export default async function Home() {
    const session = await getAuthSession();

    if (session?.user) {
        // User is signed in
        return redirect("/dashboard");
    }

    return (
        <div className="flex flex-col font-outfit">
            <div className="flex flex-row items-center">
                <div className="lg:w-1/2 lg:pl-10 lg:h-auto h-[93vh] lg:pt-0 pt-36  lg:text-black text-white1 lg:text-left text-center lg:-translate-y-10 lg:bg-none bg-[url('/landing2.png')] bg-cover">
                    <div className="TEXT-SECTION font-outfit flex flex-col lg:items-start items-center">
                        <h1 className="md:text-5xl text-4xl font-[600] md:font-[650] w-11/12 mb-5">
                            Easily check-in with your students in seconds
                        </h1>
                        <p className="text-[19px] leading-snug mb-5 w-10/12">
                            See how well your students are grasping a certain
                            topic and receive data driven insights to see who
                            needs help with what and prevent any students from
                            falling behind.
                        </p>
                    </div>
                    <div className="flex flex-row gap-3 lg:justify-start justify-center ">
                        <Link href={"/demo"}>
                            <Button
                                className=""
                                size={"xl"}
                                variant={"greenOutline"}
                            >
                                Book Demo
                            </Button>
                        </Link>
                        <Link href={"/getAccess"}>
                            <Button variant={"green"} className="" size={"xl"}>
                                Get Started
                            </Button>
                        </Link>

                        {/* <SignInButtonLg text="Get Started" /> */}
                    </div>
                    <div className="translate-y-64 flex flex-row">
                        <ChevronsDown width={20} />
                        <h1 className="ml-1">Scroll down to watch a demo!</h1>
                    </div>
                </div>
                <Image
                    className="w-6/12 lg:block hidden max-h-[93vh] object-cover"
                    src={"/landing.png"}
                    height={900}
                    width={900}
                    alt=""
                />
            </div>
            <div className="w-full flex-col flex items-center justify-center mt-20 mb-10">
                <h1 className="text-4xl font-semibold mb-5">
                    See how it works
                </h1>
                <iframe
                    width="900"
                    height="510"
                    src="https://www.youtube.com/embed/UWvj2qVlvsM"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}
