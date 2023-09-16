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

        const name = body.name;
        const email = body.email;
        const paymentMethod = body.payment_method;
        const userId = body.userId;
        // const { name, email, paymentMethod } = subscribeRequest.parse(body);
        // Create a new customer object
        const customer = await stripe.customers.create({
            email,
            name,
            payment_method: paymentMethod,
            invoice_settings: { default_payment_method: paymentMethod },
        });

        // Create a product
        const product = await stripe.products.create({
            name: "Educado Monthly Subscription",
        });
        // Create Subscription
        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [
                {
                    price_data: {
                        currency: "usd",
                        product: product.id,
                        unit_amount: 500,
                        recurring: { interval: "month" },
                    },
                },
            ],
            payment_settings: {
                payment_method_types: ["card"],
            },
            expand: ["latest_invoice.payment_intent"],
        });

        const invoice = subscription.latest_invoice as Stripe.Invoice;
        const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

        await prisma.user.update({
            where: {
                id: userId,
            },
            data: {
                subscribed: true,
                subscriptionId: subscription.id,
            },
        });

        // Send back client secret
        return NextResponse.json({
            message: "Subscription Successful",
            clientSecret: paymentIntent.client_secret,
            subscriptionId: subscription.id,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Stripe.errors.StripeError) {
            const { message } = error;
            return NextResponse.json({ message }, { status: error.statusCode });
        }
    }
}
