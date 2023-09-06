import { prisma } from "@/lib/db";
import { subscribeRequest } from "@/schemas/form/quiz";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
    maxNetworkRetries: 2,
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log(body);

        const subscriptionId = body.subscriptionId;
        const userId = body.userId;

        // Delete Subscription
        const subscription = await stripe.subscriptions.cancel(subscriptionId);

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                subscribed: false,
                subscriptionId: null,
            },
        });

        // Send back client secret
        return NextResponse.json({
            message: "deleted",
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Stripe.errors.StripeError) {
            const { message } = error;
            return NextResponse.json({ message }, { status: error.statusCode });
        }
    }
}
