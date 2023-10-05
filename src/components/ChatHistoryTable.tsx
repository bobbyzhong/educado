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

// I want to change TutorQuestion instead of chats
const ChatHistoryTable = async ({ limit, userId }: Props) => {
  const chats = await prisma.tutorQuestions.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      date: "desc",
    },
  });

  if (!chats) {
    return (
      <div>
        <Table className="mt-4">
          <TableCaption className="">No Check-Ins made yet. </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10px]">No.</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="">Topic</TableHead>
              <TableHead className="">Share Check-In</TableHead>
              <TableHead className="text-end">View Results</TableHead>
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
              <TableHead>Question</TableHead>
              <TableHead className="">Answer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <>
              {chats.map((chat: any, index: any) => {
                const date = new Date(chat.date).toLocaleDateString();

                return (
                  <TableRow key={index} className="h-[55px]">
                    <TableCell className="font-semibold">{index + 1}</TableCell>
                    <TableCell>{date}</TableCell>
                    <TableCell className="font-semibold">
                      {chat.question}
                    </TableCell>
                    <TableCell className="w-[50%]">
                      <span>{chat.answer}</span>
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
export default ChatHistoryTable;
