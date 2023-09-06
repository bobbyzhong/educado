import React from "react";
import Image from "next/image";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CancelSubCard from "@/components/CancelSubCard";
import { getAuthSession } from "@/lib/nextauth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function Page() {
    const session = await getAuthSession();
    if (!session?.user) {
        return redirect("/");
    }
    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
    });
    return (
        <div className="text-center absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 flex items-center flex-col">
            <CancelSubCard
                userId={session.user.id}
                subscriptionId={user?.subscriptionId!}
            />
        </div>
    );
}
