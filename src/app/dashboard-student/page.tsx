import HistoryCard from "@/components/dashboard/HistoryCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import CheckInCard from "@/components/dashboard/CheckInCard";
import ContactCard from "@/components/dashboard/ContactCard";
import ContentRequestCard from "@/components/dashboard/ContentRequestCard";
import EducadoTutorCard from "@/components/dashboard/EducadoTutorCard";
import StudentEnterCode from "@/components/StudentEnterCode";
import ChatHistoryTable from "@/components/ChatHistoryTable";

import { prisma } from "@/lib/db";
import HistoryTable from "@/components/HistoryTable";
import Link from "next/link";

type Props = {};

export const metadata = {
  title: "Dashboard | Pear",
};

const Dashboard = async (props: Props) => {
  const session = await getAuthSession();
  if (!session?.user) {
    return redirect("/");
  }
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });

  const checkIns = await prisma.checkIn.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const clear = user?.subscribed || checkIns.length < 10;

  return (
    <main className="p-8 mx-auto max-w-7xl">
      <div className="flex items-center mb-5">
        <div className="flex flex-col gap-1">
          <h2 className="mr-2 text-[28px] font-bold tracking-tight">
            Your Dashboard
          </h2>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-0 md:gap-8 justify-center items-center ">
        <StudentEnterCode
          title="EDUCADO TUTOR"
          description="Ask for help"
          link="tutor"
          bgRed={false}
        />
        <StudentEnterCode
          title="CHECK-IN"
          description="Enter Code Here"
          link="check-in"
          bgRed={true}
        />
      </div>

      <div className="flex items-center justify-between space-y-2">
        <div className="flex flex-col gap-1">
          <h2 className="mt-10 text-[28px] font-bold tracking-tight">
            Chat History
          </h2>
          <h1 className="text-zinc-500 text-[15px] dark:text-zinc-300">
            Below you’ll see the past 10 chat history you've made. View the full
            history{" "}
            <Link className="text-green underline " href={"/pastConvos"}>
              here
            </Link>
          </h1>
        </div>
      </div>

      <ChatHistoryTable limit={10} userId={session.user.id} />
    </main>
  );
};
export default Dashboard;
