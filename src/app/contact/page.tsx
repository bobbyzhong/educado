import React from "react";
import Image from "next/image";

import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import { Mail, Phone, AlarmCheck } from "lucide-react";
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
export default function Page() {
  return (
    <div className="font-outfit text-center flex items-center justify-center gap-7 mt-20">
      <div className="flex items-center flex-col">
        <h1 className="text-4xl font-bold mb-7">Contact Us</h1>
        <div className="w-full md:w-full rounded-2xl mb-7 shadow-lg p-7 flex items-center">
          <Mail
            className="rounded-md mr-4"
            size={30}
            strokeWidth={2}
            color="#86D20A"
          />
          <h1 className="md:text-2xl text-md">3bobbyzhong3@gmail.com</h1>
          {/* 3bobbyzhong3@gmail.com */}
        </div>

        <div className="w-full md:w-full rounded-2xl mb-7 shadow-lg p-7 flex items-center ">
          <Phone
            className="rounded-md mr-4"
            size={30}
            strokeWidth={2}
            color="#86D20A"
          />
          <h1 className="md:text-2xl text-md">(714) 330-9387</h1>
        </div>

        <div className="w-full md:w-full">
          <Link className="flex items-center text-xl" href="/demo">
            <div className="bg-[#72AA17] rounded-2xl mb-5 shadow-lg p-7 flex items-center w-full hover:bg-[#86C71C] transition-colors duration-300">
              <AlarmCheck
                className="rounded-md mr-4"
                size={30}
                strokeWidth={2}
                color="#FFFFFF"
              />
              <h1 className="md:text-2xl text-lg text-[#FFFFFF]">
                Book a Demo!
              </h1>
            </div>
          </Link>
        </div>
      </div>

      <Image
        src="/contactpage.png"
        alt="Contact Image"
        className="md:block hidden"
        width={500}
        height={500}
      />
    </div>
  );
}
