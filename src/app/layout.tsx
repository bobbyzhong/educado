import { cn } from "@/lib/utils";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Providers from "@/components/Providers";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: any = {
    title: "Teach with Educado",
    description: "Giving every student realtime, personalized help!",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <link rel="icon" href="/avocado.png" />
            <body
                className={cn(
                    inter.className,
                    "antialiased min-h-screen pt-16"
                )}
            >
                <GoogleAnalytics />

                <Providers>
                    <Navbar />
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    );
}
