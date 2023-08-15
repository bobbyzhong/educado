import React from "react";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Result } from "@prisma/client";
import { prisma } from "@/lib/db";
import Link from "next/link";

type Props = { limit: number; userId: string };
const HistoryTable = async ({ limit, userId }: Props) => {
    const checkIns = await prisma.checkIn.findMany({
        take: limit,
        where: {
            userId,
        },
        orderBy: {
            timeStarted: "desc",
        },
    });

    if (!checkIns) {
        return <div>No check-ins found.</div>;
    }

    return (
        <div>
            <Table className="mt-4">
                <TableCaption>End of list.</TableCaption>
                <TableHeader>
                    <TableRow className="">
                        <TableHead className="w-[10px]">No.</TableHead>
                        <TableHead className="w-[35%]">Topic</TableHead>
                        <TableHead>Date Created</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <>
                        {checkIns.map((checkIn: any, index: any) => {
                            const date = new Date(
                                checkIn.timeStarted
                            ).toLocaleDateString();

                            return (
                                <TableRow key={index}>
                                    <TableCell className="font-medium w-[10px]">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        <span className="font-semibold">
                                            {checkIn.topic}
                                        </span>
                                        <br />
                                        <br />
                                        {checkIn.checkInType}
                                    </TableCell>
                                    <TableCell>{date}</TableCell>
                                    <TableCell className="text-right">
                                        <Link
                                            className="px-8 py-2 bg-green rounded-sm text-white"
                                            href={`/history/results/${checkIn.id}`}
                                            target="_blank"
                                        >
                                            View Results
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
export default HistoryTable;
