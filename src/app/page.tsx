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
import WhyUsCard from "@/components/landing/WhyUsCard";
import Link from "next/link";
import Image from "next/image";
import HowStep from "@/components/landing/HowStep";
import StudentEnterCode from "@/components/StudentEnterCode";

export default async function Home() {
    const session = await getAuthSession();

    //   if (session?.user) {
    //     // User is signed in
    //     return redirect("/dashboard");
    //   }

    return (
        <div className="flex flex-col font-outfit w-full">
            <div className="flex  flex-col justify-center items-center">
                <div className="TEXT-SECTION font-outfit flex flex-col text-center items-center mt-[12%] md:mt-[4%]">
                    <h1 className="md:text-7xl text-5xl font-[600] md:font-[650] w-11/12 md:w-8/12 lg:w-6/12 mb-2 md:mb-4">
                        Check-ins made quick and easy
                    </h1>
                    <p className="text-[19px] leading-snug md:my-6 my-4 md:w-9/12 lg:w-7/12 w-11/12 text-[#6F6060]">
                        Effortlessly generate insightful check-ins in seconds.
                        Pinpoint crucial topics for the next class and identify
                        which students require additional attention.
                    </p>
                </div>
                <div className="flex flex-row gap-3 lg:justify-start justify-center ">
                    {session?.user ? (
                        <SignInButtonLg
                            text={"Go To Dashboard"}
                            isSignedIn={session?.user}
                        />
                    ) : (
                        <SignInButtonLg
                            text={"Try It Out"}
                            isSignedIn={session?.user}
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
            <StudentEnterCode />

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

            {/* WHY EDUCADO */}
            <div className="flex justify-center text-center items-center mt-[7%] flex-col">
                <h1 className="md:text-5xl text-4xl font-[600] md:font-[650] w-10/12 md:w-6/12 mb-[7%] text-[#725D5D]">
                    WHY EDUCADO
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 w-[90%] justify-center gap-10">
                    <WhyUsCard
                        icon="⚡"
                        title="️Instant Results"
                        description="Quickly identify which students are falling behind or which topics you might want to go over again next class."
                    />
                    <WhyUsCard
                        icon="👩‍🏫"
                        title="️Easy To Use"
                        description="Create a check-in in just a few steps. Educado empowers teachers with the power of AI in an easy to use way."
                    />
                    <WhyUsCard
                        icon="📑"
                        title="️Data Driven"
                        description="Educado creates a custom report based on each check-in’s results to help you evaluate what to make of it."
                    />
                    <WhyUsCard
                        icon="📚"
                        title="️Relevant Content"
                        description="Upload your own content (slides, docs, textbooks) to create check-ins based on the content you use in your class."
                    />
                </div>
            </div>

            {/* HOW Educado WORKS */}
            <div className="flex justify-center text-center items-center mt-[7%] flex-col w-full">
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
            </div>

            {/* FOOTER */}
            <div className="flex flex-col justify-center items-center mt-[7%] gap-10">
                <div className="w-[100%] justify-center items-center flex bg-[#8bb83f]/[0.2] py-[2%] rounded-b-[20%] ">
                    <h1 className=" text-center text-5xl md:text-7xl font-[600] md:font-[650] w-10/12 md:w-4/12 mb-5">
                        Check-ins made quick and easy
                    </h1>
                </div>

                <div className="flex flex-row gap-3 lg:justify-start justify-center ">
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

            <div className="w-full flex-col flex items-center justify-center mt-20 mb-10">
                <h1 className="text-4xl font-semibold mb-5">
                    See how it works
                </h1>
                <iframe
                    className="md:w-[60rem] md:h-[33rem] w-[20rem] h-[12rem]"
                    src="https://www.youtube.com/embed/UWvj2qVlvsM"
                    title="YouTube video player"
                ></iframe>
            </div>
        </div>
    );
}
