// import { getAuthSession } from "@/lib/nextauth";

// import React from "react";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/db";
// import MCQ from "@/components/MCQ";

// type Props = {
//     params: {
//         checkInId: string;
//     };
// };
// const MCQPage = async ({ params: { checkInId } }: Props) => {
//     const session = await getAuthSession();
//     if (!session?.user) {
//         return redirect("/");
//     }
//     const checkIn = await prisma.checkIn.findUnique({
//         where: {
//             id: checkInId,
//         },
//         include: {
//             questions: {
//                 select: {
//                     id: true,
//                     question: true,
//                     options: true,
//                 },
//             },
//         },
//     });

//     if (!checkIn || checkIn.checkInType !== "mcq") {
//         return redirect("/quiz");
//     }

//     return <MCQ game={checkIn} />;
// };
// export default MCQPage;
