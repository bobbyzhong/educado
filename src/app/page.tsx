import { Button } from "@/components/ui/button";

import { getAuthSession } from "@/lib/nextauth";

import SignInButtonLg from "@/components/SignInButtonLg";
import WhyUsCard from "@/components/landing/WhyUsCard";
import Link from "next/link";
import Image from "next/image";
import StudentEnterCode from "@/components/StudentEnterCode";
import { prisma } from "@/lib/db";
import HomePageJoinCode from "@/components/HomePageJoinCode";
import { ExternalLink } from "lucide-react";
import HowStep from "@/components/landing/HowStep";

export default async function Home() {
    const session = await getAuthSession();

    let isTeacher = false;
    if (session?.user) {
        // User is signed in
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id,
            },
        });
        if (user?.isTeacher) {
            isTeacher = true;
        }
    }

    return (
        <div className="flex flex-col font-outfit w-full">
            <div className="flex  flex-col justify-center items-center">
                <div className="TEXT-SECTION flex flex-col text-center items-center mt-[12%] md:mt-[4%]">
                    <h1 className="md:text-[14.5px] text-[13.5px] text-green font-semibold  mb-3">
                        AI FOR K12
                    </h1>

                    {/* <h1 className="md:text-6xl text-3xl font-semibold tracking-tight w-11/12 md:w-9/12 lg:w-7/12 ">
                        Supercharging student support and learning with AI
                    </h1> */}
                    <h1 className="md:text-[45px] md:leading-[53px] font-outfit text-3xl font-semibold w-11/12 md:w-8/12 lg:w-6/12 ">
                        Personalize student support and learning at scale with
                        Educado
                    </h1>
                    <p className="md:text-[21px] text-[16px] leading-snug md:my-5 my-4 md:w-9/12 lg:w-7/12 w-11/12 text-zinc-700">
                        We empower K12 educators to create{" "}
                        <b className="text-green">AI tutors</b> trained on their
                        own content and standards that can support students in{" "}
                        <b className="text-green">every step</b> of their
                        learning journey
                    </p>
                </div>
                <div className="flex flex-row gap-3 lg:justify-start justify-center ">
                    {session?.user ? (
                        <SignInButtonLg
                            text={"Go Dashboard"}
                            isSignedIn={session?.user}
                            link={
                                isTeacher
                                    ? "/dashboard-teacher"
                                    : "/dashboard-student"
                            }
                        />
                    ) : (
                        <SignInButtonLg
                            text={"Sign In"}
                            isSignedIn={session?.user}
                            link={"/dashboard-student"}
                        />
                    )}

                    <Link href={"/demo"}>
                        <Button
                            className=""
                            size={"xl"}
                            variant={"greenOutline"}
                        >
                            Book Demo
                        </Button>
                    </Link>
                </div>
            </div>
            <div className="flex flex-col md:flex-rowjustify-center items-center ">
                <StudentEnterCode
                    title="EDUCADO TUTOR"
                    description="Ask for help"
                    link="tutor"
                    bgRed={false}
                    isSignedIn={session?.user}
                    userId={session?.user?.id || ""}
                />
                {/* <StudentEnterCode
                    title="CHECK-IN"
                    description="Enter Code Here"
                    link="check-in"
                    bgRed={true}
                    isSignedIn={session?.user}
                    userId={session?.user?.id || ""}
                /> */}
            </div>

            <div className="w-full flex items-center justify-center mt-12 gap-1 px-3 text-center">
                <HomePageJoinCode isSignedIn={session?.user} />{" "}
            </div>

            {/* LANDING IMAGES */}
            <div className="flex justify-between items-center mt-[5%]">
                <Image
                    className="w-[49%] lg:block hidden max-h-[70vh] object-cover"
                    src={"/landing/landingpage.png"}
                    height={800}
                    width={800}
                    alt=""
                />
                <Image
                    className="w-[49%] lg:block hidden max-h-[70vh] object-cover"
                    src={"/landing/landingpage2.png"}
                    height={800}
                    width={800}
                    alt=""
                />
            </div>

            {/* WHY EDUCADO */}
            <div className="flex justify-center text-center items-center mt-[7%] flex-col">
                <h1 className="md:text-4xl text-3xl font-[600] md:font-[650] w-10/12 md:w-6/12 mb-[7%] text-zinc-600">
                    WHY EDUCADO
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] justify-center gap-10">
                    <WhyUsCard
                        icon="📚"
                        title="Reliable Help"
                        description="We let you create your own tutors, trained on the information you want whether it's a teacher's lecture slides or an online article. No need 
                        to worry about unreliable sources."
                    />
                    <WhyUsCard
                        icon="🤖"
                        title="Monitored AI"
                        description="Integrate AI into learning in a safe and monitored way with Educado. All the conversations your students have with the tutor can be viewed by the teacher and any unusual activity is flagged."
                    />
                    <WhyUsCard
                        icon="⚡️"
                        title="Realtime Support"
                        description={`Students can chat with their tutors anytime, anywhere through our Chrome Extension or website. (Our Chrome Extension's super cool!)`}
                    />
                    <WhyUsCard
                        icon="📈"
                        title="️Data-Driven Insights"
                        description="We help you identify which topics your students are struggling on. Get real time insights on how your students are doing and make adjustments to your teaching accordingly."
                    />
                    <WhyUsCard
                        icon="🧑‍🏫"
                        title="️Make Learning Fun"
                        description="The possibilities with our tutors are limitless! Some of our early teachers have created historical figures like Benjamin Franklin that their students can interview "
                    />
                    <WhyUsCard
                        icon="✅"
                        title="Easy Set Up"
                        description={`It takes less than 5 minutes to create a tutor. All tutors also come trained on the standards or curriculum that your district follows!`}
                    />
                </div>
            </div>

            {/* <div className="flex justify-center text-center items-center mt-[7%] flex-col">
                <h1 className="md:text-4xl text-3xl font-[600] md:font-[650] w-10/12 md:w-6/12 mb-[7%] text-zinc-600">
                    INTEGRATED WITH YOUR STANDARDS
                </h1>
                <div className="height-[20%] justify-center items-center flex md:flex-row flex-col gap-10">
                    <Image
                        className="md:w-[20%] w-[50%]"
                        src={"/ngss_sd.png"}
                        height={100}
                        width={250}
                        alt=""
                    />
                    <Image
                        className="md:w-[30%] w-[70%]"
                        src={"/cali_sd.png"}
                        height={50}
                        width={200}
                        alt=""
                    />
                    <Image
                        className="md:w-[20%] w-[50%]"
                        src={"/okla_sd.png"}
                        height={100}
                        width={250}
                        alt=""
                    />
                </div>
            </div> */}

            {/* HOW Educado WORKS */}
            <div className="flex justify-center text-center items-center mt-[7%] flex-col w-full">
                <h1 className="md:text-4xl text-3xl font-[600] md:font-[650] w-10/12 mt-[5rem] md:w-6/12 mb-[1rem] text-zinc-600">
                    HOW IT WORKS
                </h1>
                <h1 className="md:text-lg text-base md:w-5/12 text-center w-10/12  mb-[1rem] text-zinc-600">
                    This process is mainly for districts. If you're a teacher
                    all you need to do is{" "}
                    <a href="/contact" className="text-green">
                        reach out
                    </a>{" "}
                    for an access code and you'll be all good to go!
                </h1>
                <HowStep
                    step="1"
                    title="Set Up"
                    description="We know that every district is unique so we’ll work closely with you to see the best way we can help. Once we have everything worked out, we’ll give a private access code for your teachers to sign up with. "
                    image="/landing/how_1.png"
                />
                <HowStep
                    step="2"
                    title="Deploy"
                    description="If you want, you can add our chrome extension to your Chromebooks so your students can work with their tutor wherever they go in just one click! They can also access it through our website"
                    image="/landing/how_2.png"
                />
                <HowStep
                    step="3"
                    title="Create"
                    description="Teachers can easily create different types of tutors such as our “Famous Figure Tutor” tutor or “Writing Tutor”. The content that tutors are trained on can also be updated whenever!"
                    image="/landing/how_3.png"
                />
                <HowStep
                    step="4"
                    title="Monitor"
                    description="Teachers can view all conversations students have with tutors and are also alerted when any unusual activity such as self harm talk or cheating concerns comes up."
                    image="/how_evaluate.png"
                />
                <HowStep
                    step="5"
                    title="Support"
                    description="Our team will provide you with all the support you need to make sure you and your teachers make the most out of Educado. We’ll also be there to help you with any issues that come up!"
                    image="/landing/how_5.png"
                />
            </div>

            {/* FOOTER */}
            <div className="flex flex-col justify-center items-center mt-[7%] gap-10 bg-[#8bb83f]/[0.2]  rounded-t-[20%]">
                <div className="w-[100%] justify-center items-center flex  pt-[3%] ">
                    <h1 className=" text-center text-4xl md:text-6xl font-[600] md:font-[650] w-10/12 md:w-7/12 mt-10">
                        Give your students personalized support today!
                    </h1>
                </div>

                <div className="flex flex-row gap-3 mb-14 lg:justify-start justify-center ">
                    <Link href={"/getAccess"}>
                        <Button variant={"green"} className="" size={"xl"}>
                            Get Started
                        </Button>
                    </Link>
                    <Link href={"/demo"}>
                        <Button
                            className=""
                            size={"xl"}
                            variant={"greenOutline"}
                        >
                            Book Demo
                        </Button>
                    </Link>
                </div>
            </div>

            <div>
                <div className="flex flex-row flex-wrap px-10 md:px-32 gap-12 mt-10 md:mt-16">
                    <div>
                        <h1 className="text-lg mb-5">Resources</h1>
                        <Link
                            href={"/resources"}
                            className="flex flex-row gap-2 items-center mb-1"
                        >
                            Resources Page
                        </Link>
                        <Link
                            href={"https://youtu.be/n7wH43FNPFM?feature=shared"}
                            target="_blank"
                            className="flex flex-row gap-2 items-center mb-1"
                        >
                            Teacher Set Up <ExternalLink size={18} />
                        </Link>
                        <div className="flex flex-row gap-2 items-center">
                            Contact Us
                        </div>
                    </div>
                    <div>
                        <h1 className="text-lg mb-5">Community</h1>
                        <Link
                            href={"https://twitter.com/tryeducado"}
                            target="_blank"
                            className="flex flex-row gap-2 items-center mb-1"
                        >
                            Twitter <ExternalLink size={18} />
                        </Link>
                        <Link
                            href={
                                "https://www.facebook.com/profile.php?id=61553594636447"
                            }
                            target="_blank"
                            className="flex flex-row gap-2 items-center mb-1"
                        >
                            Facebook <ExternalLink size={18} />
                        </Link>
                        <Link
                            href={
                                "https://www.linkedin.com/company/tryeducado/"
                            }
                            target="_blank"
                            className="flex flex-row gap-2 items-center"
                        >
                            LinkedIn <ExternalLink size={18} />
                        </Link>
                    </div>
                    <div>
                        <h1 className="text-lg mb-5">Get In Touch</h1>
                        <Link
                            href={"/contact"}
                            className="flex flex-row gap-2 items-center mb-1"
                        >
                            Contact Us
                        </Link>
                        <Link
                            href={"/demo"}
                            className="flex flex-row gap-2 items-center mb-1"
                        >
                            Book a Demo
                        </Link>
                    </div>
                </div>
                <div className="w-full flex md:flex-row flex-col items-center justify-center mt-10 pb-16 pt-16  px-2 md:px-10 ">
                    <h1 className="font-[550] md:text-base text-sm ">
                        © 2023 Educado, Inc. All rights reserved
                    </h1>
                    <div className="mx-2 md:block hidden">|</div>
                    <div>
                        <Link
                            href={"/privacy"}
                            className="text-blue-500 md:text-base text-sm"
                        >
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>

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
