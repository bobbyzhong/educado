// app/api/stripe-webhook/route.ts
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { Stripe } from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2023-08-16",
});

// Stripe will give you a webhook secret when setting up webhooks.
// well get this later and add it to the .env.local file when testing
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
    const payload = await req.text();
    const signature = headers().get("stripe-signature");

    let event: Stripe.Event | null = null;
    try {
        event = stripe.webhooks.constructEvent(
            payload,
            signature!,
            webhookSecret
        );
        const session = event.data.object as Stripe.Checkout.Session;
        if (!session?.metadata?.userId) {
            return new Response(null, { status: 200 });
        }
        if (event.type === "checkout.session.completed") {
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
            );

            await prisma.user.update({
                where: {
                    id: session.metadata.userId,
                },
                data: {
                    subscribed: true,
                    subscriptionId: subscription.id,
                },
            });
        }
        if (event.type === "invoice.payment_succeeded") {
            const subscription = await stripe.subscriptions.retrieve(
                session.subscription as string
            );

            await prisma.user.update({
                where: {
                    id: session.metadata.userId,
                },
                data: {
                    subscribed: true,
                    subscriptionId: subscription.id,
                },
            });
        }
        if (event.type === "invoice.payment_failed") {
            return new Response(null, { status: 200 });
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            return NextResponse.json({ message: err.message }, { status: 400 });
        }
    }
    return NextResponse.json({ received: true });
}
