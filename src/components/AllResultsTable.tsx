import React from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAuthSession } from "@/lib/nextauth";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Link from "next/link";

type Props = { checkInId: string };

const AllResultsTable = async ({ checkInId }: Props) => {
    // const session = await getAuthSession();
    // if (!session?.user) {
    //     return redirect("/");
    // }

    const results = await prisma.result.findMany({
        where: {
            checkInId,
        },
        orderBy: {
            timeSubmitted: "desc",
        },
    });

    return (
        <div>
            <Table className="mt-4">
                <TableCaption>End of list.</TableCaption>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="w-[35%]">Student Name</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Percentage</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {results.map((result: any, index: any) => {
                            return (
                                <TableRow key={index} className="h-[50px]">
                                    <TableCell>{result.studentName}</TableCell>
                                    <TableCell>
                                        {result.totalCorrect}/
                                        {result.totalQuestions}
                                    </TableCell>
                                    <TableCell>{result.score}%</TableCell>

                                    <TableCell className="text-right">
                                        <Link
                                            className="text-green underline font-semibold"
                                            href={`/result/${result.id}`}
                                            target="_blank"
                                        >
                                            View Details
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </>
                </TableBody>
            </Table>
        </div>
    );
};
export default AllResultsTable;
