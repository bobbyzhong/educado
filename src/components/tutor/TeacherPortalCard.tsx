"use client";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { useForm } from "react-hook-form";
import { contentRequestSchema } from "@/schemas/form/quiz";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";

import { useToast } from "@/components/ui/use-toast";
import React from "react";
import { useRouter } from "next/navigation";

type Props = { userId: string };

type Input = z.infer<typeof contentRequestSchema>;

const TeacherPortalCard = ({ userId }: Props) => {
    const router = useRouter();
    const [code, setCode] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const { toast } = useToast();

    const handleSubmit = async () => {
        setLoading(true);
        if (code === "") return;
        if (code === "CCU7W") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "CCUSD",
                    district: false,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "OP210") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Oak Park Unified School District",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "MSD38") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Moreland School District",
                    district: false,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "AU123") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Anaheim Union HS District",
                    district: false,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "RV921") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Rincon Valley Unified School District",
                    district: false,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "RSC38") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "River Springs Charter School",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "VM927") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Vibrant Minds",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "VVU30") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Victor Valley Unified School District",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "WS921") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Windward School",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "LB291") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Long Beach Schools",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "PY9K1") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Placentia Yorba Linda Unified School District",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "EQA92") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Equitas Academy",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "NTS10") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "Natomas Unified",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else if (code === "XL202") {
            const res = await fetch("/api/updateTeacherStatus", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: userId,
                    school: "ACS Independant",
                    district: true,
                }),
            });
            const data = await res.json();
            console.log(data);
            setLoading(false);
            if (data.message === "updated") {
                router.push("/dashboard-teacher");
            }
        } else {
            setLoading(false);
            toast({
                title: "Sorry code not recognized",
                description: "Get the code from your district or contact us!",
            });
        }
    };

    const form = useForm<Input>({
        resolver: zodResolver(contentRequestSchema),
        defaultValues: {
            content: "",
        },
    });

    form.watch();

    return (
        <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <Card className="max-w-[22rem]">
                <CardHeader>
                    <CardTitle className="font-bold text-2xl">
                        District Code
                    </CardTitle>
                    <CardDescription>
                        Once you enter the code given to your district you're
                        all set!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2 mb-5">
                        <h1 className="tracking-tight">Enter code</h1>
                        <Input
                            value={code}
                            className="shadown-none border-b"
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="District code"
                        />
                        <CardDescription>
                            Don't have or know the code? <br />
                            Contact{" "}
                            <a
                                className="underline text-green"
                                href="mailto:bobbby@tryeducado.com"
                            >
                                bobby@tryeducado.com
                            </a>
                            <br />
                            Or get access by going{" "}
                            <a
                                className="underline text-green"
                                href="https://forms.gle/5uthS28zvXVB6Rxq6"
                            >
                                here
                            </a>
                            !
                        </CardDescription>
                    </div>

                    <Button
                        disabled={loading}
                        variant={"green"}
                        onClick={handleSubmit}
                    >
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default TeacherPortalCard;
