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
import WhyCard from "@/components/landing/WhyCard";
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

          {/* <SignInButtonLg text="Get Started" /> */}
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

      <div className="flex justify-center text-center items-center mt-[5%] flex-col">
        <h1 className="text-5xl font-[600] md:font-[650] w-6/12 mb-[4%] text-[#725D5D]">
          WHY PEAR
        </h1>
        <div className="flex flex-wrap w-[90%] justify-center gap-10">
          <WhyCard />
          <WhyCard />
          <WhyCard />
          <WhyCard />
        </div>
      </div>

      <div className="flex justify-center text-center items-center mt-[5%] flex-col">
        <h1 className="text-5xl font-[600] md:font-[650] w-6/12 mb-[4%] text-[#725D5D]">
          HOW PEAR WORKS
        </h1>
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
