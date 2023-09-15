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
    // const checkIns = null;

    if (!checkIns) {
        return (
            <div>
                <Table className="mt-4">
                    <TableCaption className="">
                        No Check-Ins made yet.{" "}
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[10px]">No.</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="">Topic</TableHead>
                            <TableHead className="">Share Check-In</TableHead>
                            <TableHead className="text-end">
                                View Results
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                </Table>
            </div>
        );
    } else {
        return (
            <div>
                <Table className="mt-4">
                    <TableCaption>End of list.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[10px]">No.</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead className="">Topic</TableHead>
                            <TableHead className="">Share Check-In</TableHead>
                            <TableHead className="text-end">
                                View Results
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <>
                            {checkIns.map((checkIn: any, index: any) => {
                                const date = new Date(
                                    checkIn.timeStarted
                                ).toLocaleDateString();

                                return (
                                    <TableRow key={index} className="h-[55px]">
                                        <TableCell className="font-medium w-[10px]">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell>{date}</TableCell>
                                        <TableCell>{checkIn.title}</TableCell>
                                        <TableCell>
                                            <span className="font-semibold">
                                                {checkIn.topic}
                                            </span>
                                        </TableCell>
                                        <TableCell className="">
                                            <Link
                                                className="text-green underline font-semibold"
                                                href={`/share/mcq/${checkIn.id}`}
                                                target="_blank"
                                            >
                                                Share
                                            </Link>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <Link
                                                className="px-5 py-2 bg-green rounded-sm text-white"
                                                href={`/history/results/${checkIn.id}`}
                                                target="_blank"
                                            >
                                                Results
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
    }
};
export default HistoryTable;
