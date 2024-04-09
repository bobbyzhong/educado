import { Button } from "@/components/ui/button";

import { getAuthSession } from "@/lib/nextauth";

import SignInButtonLg from "@/components/SignInButtonLg";

import Link from "next/link";
import Image from "next/image";
import StudentEnterCode from "@/components/StudentEnterCode";
import { prisma } from "@/lib/db";
import HomePageJoinCode from "@/components/HomePageJoinCode";
import { ExternalLink } from "lucide-react";
import HowStep from "@/components/landing/HowStep";
import FeatureCard from "@/components/landing/FeatureCard";
import { Card, CardContent } from "@/components/ui/card";

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
                    <h1 className="md:text-[45px] md:leading-[53px] font-outfit text-3xl font-semibold w-11/12 md:w-8/12 lg:w-7/12 ">
                        Giving every student instant & personalized homework
                        help
                    </h1>
                    <p className="md:text-[21px] text-[16px] leading-snug md:my-5 my-4 md:w-8/12 lg:w-6/12 w-11/12 text-zinc-700">
                        Our tutors guide students through math problems{" "}
                        <b className="text-green">step by step</b> and help them
                        actually understand math
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
                    <HomePageJoinCode isSignedIn={session?.user} />{" "}
                </div>
            </div>
            <div className="flex flex-col md:flex-rowjustify-center items-center mt-5">
                <StudentEnterCode
                    title="Join Tutor Session"
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

            {/* LANDING IMAGES */}
            <div className="flex justify-between items-center mt-[5%]">
                <Image
                    className="w-[49%] lg:block hidden max-h-[70vh] object-cover"
                    src={"/landing/landing1.png"}
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

            {/* Testimonials */}
            <div className="flex justify-center text-center items-center mt-[5%] flex-col">
                <h1 className="md:text-4xl text-3xl font-[600] md:font-[650] w-10/12 mt-[5rem] md:w-6/12 mb-[1rem] text-zinc-600">
                    Hear it from students
                </h1>
                <h1 className="md:text-lg text-base md:w-5/12 text-center w-10/12  mb-[5rem] text-zinc-600">
                    These are real quotes from students we got feedback from!
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-3 w-[90%] justify-center gap-5">
                    <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px] py-7 px-5">
                        <div className="text-left text-base md:text-[18px] w-[95%]">
                            "Using educado was awesome, because we broke down
                            the question together and solved them"
                        </div>
                    </Card>
                    <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px] py-7 px-5">
                        <div className="text-left text-base md:text-[18px] w-[95%]">
                            "It was a good resource and helped me walk through
                            and understand the problems."
                        </div>
                    </Card>
                    <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px] py-7 px-5">
                        <div className="text-left text-base md:text-[18px] w-[95%]">
                            "It was good using Educado because it is very
                            informative and specific while explaining how to
                            solve the question."
                        </div>
                    </Card>
                    <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px] py-7 px-5">
                        <div className="text-left text-base md:text-[18px] w-[95%]">
                            "I found it very helpful to use Educado cause it
                            explained the questions i got wrong as well as how
                            to do it correctly"
                        </div>
                    </Card>
                    <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px] py-7 px-5">
                        <div className="text-left text-base md:text-[18px] w-[95%]">
                            "It was cool to use him. I think it's awesome that
                            instead of giving us the actual answer, he walks us
                            through it. "
                        </div>
                    </Card>
                    <Card className="bg-[#8BB83F]/[0.15] border-4 border-[#8BB83F] w-full rounded-[30px] py-7 px-5">
                        <div className="text-left text-base md:text-[18px] w-[95%]">
                            "Educado was helpful because it didn't give you the
                            answer automatically which I find better because it
                            helps you learn."
                        </div>
                    </Card>

                    {/* <FeatureCard
                        icon="🤖"
                        title="Reliable Help"
                        description="All tutors are trained on the content you want such as your curriculum/standards, ensuring the help students get is reliable!"
                    />
                    <FeatureCard
                        icon="🧑‍🏫"
                        title="Monitored Conversations"
                        description="All conversations are monitored + logged so you can view them whenever you want. We'll also alert you if any unusual activity comes up!"
                    />
                    <FeatureCard
                        icon="📊"
                        title="Data Driven Insights"
                        description="Get insights on things like topics students are struggling with and student performance so you can make data driven decisions!"
                    />

                    <FeatureCard
                        icon="⭐️"
                        title="10 Star Support"
                        description={`One of our core values is to provide the best support and experience possible. We'll be there every step of the way to help you!`}
                    />
                    <FeatureCard
                        icon="⚡️"
                        title="Chrome Extension"
                        description="With our Chrome Extension, students can get help from their tutors in just one click. We'll be there for those late night study sessions!"
                    />
                    <FeatureCard
                        icon="🏫"
                        title="Educado Collection"
                        description="We have a library of pre-built historical figures and tutors that you can use and modify so you can get started right away!"
                    /> */}
                </div>
            </div>

            {/* HOW Educado WORKS */}
            <div className="flex justify-center text-center items-center mt-[7%] flex-col w-full">
                <h1 className="md:text-4xl text-3xl font-[600] md:font-[650] w-10/12 mt-[5rem] md:w-6/12 mb-[1rem] text-zinc-600">
                    How it works
                </h1>
                <h1 className="md:text-lg text-base md:w-4/12 text-center w-10/12  mb-[1rem] text-zinc-600">
                    We make it super easy for you to use Educado!
                </h1>
                <HowStep
                    step="1"
                    title="Set Up"
                    description="We know that every district is unique so we’ll work closely with you to see the best way we can help and make sure we align with your values and needs."
                    image="/landing/how_1.png"
                />
                <HowStep
                    step="2"
                    title="Share"
                    description="Once your district is registered, all your students need to do is sign up with their school email and they'll have access to your district's homework helpers!"
                    image="/landing/how_2.png"
                />
                <HowStep
                    step="3"
                    title="Monitor"
                    description="All conversations are logged and can be monitored by select admins. We also provide data analytics on things like commonly asked questions and student performance."
                    image="/landing/how_4.png"
                />
            </div>
            {/* WHY US */}
            <div className="flex justify-center text-center items-center mt-[5%] flex-col">
                <h1 className="md:text-4xl text-3xl font-[600] md:font-[650] w-10/12 mt-[5rem] md:w-6/12 mb-[1rem] text-zinc-600">
                    Why Us
                </h1>
                <h1 className="md:text-lg text-base md:w-5/12 text-center w-10/12  mb-[5rem] text-zinc-600">
                    Here's why your district/school needs Educado!
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] justify-center gap-5">
                    <FeatureCard
                        icon="🤖"
                        title="Reliable Help"
                        description="Our tutors help students work through, step by step, how to solve a specific problem as opposed to just giving them the answers. We value helping students actually learn!"
                    />
                    <FeatureCard
                        icon="🧑‍🏫"
                        title="Monitored Conversations"
                        description="All conversations are monitored + logged so registered admins can view them whenever they want. We'll also alert you if any unusual activity comes up!"
                    />
                    <FeatureCard
                        icon="📊"
                        title="Data Driven Insights"
                        description="Get insights on things like topics students are struggling with and student performance so you can make data driven decisions!"
                    />

                    <FeatureCard
                        icon="🏫"
                        title="Easy Set Up"
                        description={`We make it super easy for districts and schools to use. Once you get set up, students can get instant, personalized homework help with just one click!`}
                    />
                </div>
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
