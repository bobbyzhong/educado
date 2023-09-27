import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { EyeIcon, LucideLayoutDashboard, QrCodeIcon } from "lucide-react";
import { getAuthSession } from "@/lib/nextauth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import CopyCard from "@/components/share/CopyCard";
import QrCodeCard from "@/components/share/QrCodeCard";
import CodeDisplay from "@/components/CodeDisplay";
import TutorCodeDisplay from "@/components/educadoTutor/TutorCodeDisplay";

type Props = {
  params: {
    tutorId: string;
  };
};
const educadoTutor = async ({ params: { tutorId } }: Props) => {
  const session = await getAuthSession();

  if (!session?.user) {
    return redirect("/");
  }

  const link = `${process.env.API_URL}tutor/${tutorId}`;
  console.log(link);

  return (
    <>
      <div className="p-8 mx-auto max-w-5xl">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex flex-col gap-1">
            <TutorCodeDisplay code={"123"} />
            <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300 ">
              Here, you’ll have other options to share the check-in
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "green" })}
            >
              <LucideLayoutDashboard className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </div>

        <div className="grid gap-4 mt-4 md:grid-cols-3">
          <CopyCard link={link} />
          <QrCodeCard link={link} />
        </div>
      </div>
    </>
  );
};
export default educadoTutor;
