import Stripe from "stripe";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2023-08-16",
});

export async function POST(req: Request) {
    try {
        const body = await req.json();

        const priceId = body.priceId;
        const userId = body.userId;

        if (!priceId) {
            throw new Error("Missing priceId");
        }

        const params: Stripe.Checkout.SessionCreateParams = {
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            metadata: {
                userId: userId,
            },

            success_url: `${process.env.API_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.API_URL}/`,
        };

        const checkoutSession: Stripe.Checkout.Session =
            await stripe.checkout.sessions.create(params);

        return NextResponse.json({ result: checkoutSession, ok: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "something went wrong", ok: false },
            { status: 500 }
        );
    }
}
