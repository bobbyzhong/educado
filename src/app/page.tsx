import { Button } from "@/components/ui/button";

import { getAuthSession } from "@/lib/nextauth";

import SignInButtonLg from "@/components/SignInButtonLg";
import WhyUsCard from "@/components/landing/WhyUsCard";
import Link from "next/link";
import Image from "next/image";
import StudentEnterCode from "@/components/StudentEnterCode";
import { prisma } from "@/lib/db";
import HomePageJoinCode from "@/components/HomePageJoinCode";

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
                <div className="TEXT-SECTION font-outfit flex flex-col text-center items-center mt-[12%] md:mt-[4%]">
                    <h1 className="md:text-6xl text-3xl font-semibold tracking-tight w-11/12 md:w-9/12 lg:w-7/12 ">
                        Giving every student a one on one learning experience
                    </h1>
                    <p className="md:text-[21px] text-[18px] leading-snug md:my-6 my-4 md:w-9/12 lg:w-7/12 w-11/12 text-zinc-700">
                        We make it super easy for educators to create their own
                        AI tutors trained on the content they want. Give your
                        students the help they need outside the classroom while
                        letting them use AI to enhance their learning in a safe
                        and monitored way.
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
                    src={"/landingpage.png"}
                    height={800}
                    width={800}
                    alt=""
                />
                <Image
                    className="w-[49%] lg:block hidden max-h-[70vh] object-cover"
                    src={"/landingpage2.png"}
                    height={800}
                    width={800}
                    alt=""
                />
            </div>

            {/* WHY EDUCADO */}
            <div className="flex justify-center text-center items-center mt-[7%] flex-col">
                <h1 className="md:text-5xl text-4xl font-[600] md:font-[650] w-10/12 md:w-6/12 mb-[7%] text-[#725D5D]">
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
                        icon="📈"
                        title="️Data-Driven Insights"
                        description="We help you identify which topics your students are struggling on. Get real time insights on how your students are doing and make adjustments to your teaching accordingly."
                    />
                    <WhyUsCard
                        icon="📑"
                        title="️Monitored AI"
                        description="Yes, AI can be scary but that doesn't mean it can't be used for good! All the conversations your students have with the tutor 
                        can be viewed by the teacher or school admin. "
                    />
                    <WhyUsCard
                        icon="📚"
                        title="Easy Set Up"
                        description={`It takes less than 5 minutes to create a tutor. All tutors also come trained on the standards or curriculum that your district follows!`}
                    />
                </div>
            </div>

            <div className="flex justify-center text-center items-center mt-[7%] flex-col">
                <h1 className="md:text-5xl text-4xl font-[600] md:font-[650] w-10/12 md:w-6/12 mb-[7%] text-[#725D5D]">
                    INTEGRATED STANDARDS
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
            </div>

            {/* HOW Educado WORKS */}
            {/* <div className="flex justify-center text-center items-center mt-[7%] flex-col w-full">
                <h1 className="text-4xl md:text-5xl font-[600] md:font-[650] w-10/12 md:w-6/12 mt-5 mb-[2%] text-[#725D5D]">
                    HOW EDUCADO WORKS
                </h1>
                <HowStep
                    step="1"
                    title="Check-in Type"
                    description="Select the type of check-in you want to make. Currently, you can make a check-in based on plain content, textbook, or classroom material. More to come soon!"
                    image="/how_checkin_type.png"
                />
                <HowStep
                    step="2"
                    title="Review"
                    description="Review the generated check-in and make changes as needed. You can edit, delete, or add your own question if you want!"
                    image="/how_review.png"
                />
                <HowStep
                    step="3"
                    title="Share"
                    description="Next you’ll be able to share the check-in with your students. Have your students scan the QR code or share it via link"
                    image="/how_share.png"
                />
                <HowStep
                    step="4"
                    title="Evaluate"
                    description="After each student takes it, you’ll be able to view their results. You’ll have access to all the check-ins you’ve made in the past as well."
                    image="/how_evaluate.png"
                />
                <HowStep
                    step="5"
                    title="Receive Report"
                    description="After each check-in you’ll receive a mini report detailing things like topics your students struggled on and which students you might want to check up on. "
                    image="/how_receive_report.png"
                />
            </div> */}

            {/* FOOTER */}
            <div className="flex flex-col justify-center items-center mt-[7%] gap-10">
                <div className="w-[100%] justify-center items-center flex bg-[#8bb83f]/[0.2] py-[2%] rounded-b-[20%] ">
                    <h1 className=" text-center text-4xl md:text-6xl font-[600] md:font-[650] w-10/12 md:w-7/12 lg:w-5/12 mb-5">
                        Give your students a better learning experience today!
                    </h1>
                </div>

                <div className="flex flex-row gap-3 mb-5 lg:justify-start justify-center ">
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

            <div className="w-full flex items-center justify-center mt-10 py-3 bg-green3 font-[550]">
                © 2023 Educado. All rights reserved.
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
