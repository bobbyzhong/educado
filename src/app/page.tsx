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

export default async function Home() {
    const session = await getAuthSession();

    if (session?.user) {
        // User is signed in
        return redirect("/dashboard");
    }

    return (
        <div className="absolute -translate-x-1/2 -translate-y-[85%] top-1/2 left-1/2 flex flex-col items-center w-full">
            <div className="TEXT-SECTION font-outfit text-center flex flex-col items-center">
                <h1 className="text-5xl font-[650] mb-5 w-6/12">
                    Easily check-in with your students in seconds
                </h1>
                <p className="w-[55%] text-[19px] leading-snug mb-5">
                    See how well your students are grasping a certain topic and
                    receive data driven insights to see who needs help with what
                    and prevent any students from falling behind.
                </p>
            </div>
            <div className="flex flex-row gap-5">
                <Button size={"xl"} variant={"greenOutline"}>
                    View Demo
                </Button>

                <SignInButtonLg text="Get Started" />
            </div>
        </div>
    );
}
