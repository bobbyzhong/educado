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

export default async function Home() {
  const session = await getAuthSession();

  if (session?.user) {
    // User is signed in
    return redirect("/dashboard");
  }

  return (
    <div className="flex flex-col font-outfit">
      <div className="flex  flex-col justify-center items-center">
        <div className="TEXT-SECTION font-outfit flex flex-col text-center items-center mt-[4%]">
          <h1 className="text-7xl font-[600] md:font-[650] w-6/12 mb-5">
            Check-ins made quick and easy
          </h1>
          <p className="text-[19px] leading-snug my-7 w-7/12 text-[#6F6060]">
            Effortlessly generate insightful check-ins in seconds. Pinpoint
            crucial topics for the next class and identify which students
            require additional attention.
          </p>
        </div>
        <div className="flex flex-row gap-3 lg:justify-start justify-center ">
          <Link href={"/getAccess"}>
            <Button variant={"green"} className="" size={"xl"}>
              Get Started
            </Button>
          </Link>
          <Link href={"/demo"}>
            <Button className="" size={"xl"} variant={"greenOutline"}>
              Book Demo
            </Button>
          </Link>
        </div>
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

      {/* WHY PEAR */}
      <div className="flex justify-center text-center items-center mt-[7%] flex-col">
        <h1 className="text-5xl font-[600] md:font-[650] w-6/12 mb-[7%] text-[#725D5D]">
          WHY PEAR
        </h1>
        <div className="flex flex-wrap w-[90%] justify-center gap-10">
          <WhyUsCard
            icon="⚡"
            title="️Instant Results"
            description="Quickly identify which students are falling behind or which topics you might want to go over again next class."
          />
          <WhyUsCard
            icon="👩‍🏫"
            title="️Easy To Use"
            description="Create a check-in in just a few steps. Pear empowers teachers with the power of AI in an easy to use way."
          />
          <WhyUsCard
            icon="📑"
            title="️Data Driven"
            description="Pear creates a custom report based on each check-in’s results to help you evaluate what to make of it."
          />
          <WhyUsCard
            icon="📚"
            title="️Relevant Content"
            description="Upload your own content (slides, docs, textbooks) to create check-ins based on the content you use in your class."
          />
        </div>
      </div>

      {/* HOW PEAR WORKS */}
      <div className="flex justify-center text-center items-center mt-[7%] flex-col">
        <h1 className="text-5xl font-[600] md:font-[650] w-6/12 mb-[2%] text-[#725D5D]">
          HOW PEAR WORKS
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
          <h1 className=" text-center text-7xl font-[600] md:font-[650] w-4/12 mb-5">
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
            <Button className="" size={"xl"} variant={"greenOutline"}>
              Book Demo
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full flex-col flex items-center justify-center mt-20 mb-10">
        <h1 className="text-4xl font-semibold mb-5">See how it works</h1>
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
