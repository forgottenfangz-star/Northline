import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret || !webhookSecret) return NextResponse.json({error:"Stripe webhook is not configured."},{status:503});

  const stripe = new Stripe(secret);
  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({error:"Missing Stripe signature."},{status:400});

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log("NORTHLINE paid order", {
        sessionId: session.id,
        serviceId: session.metadata?.serviceId,
        amountTotal: session.amount_total,
        currency: session.currency
      });
      // Database order creation belongs here once the production database is connected.
    }

    return NextResponse.json({received:true});
  } catch (error) {
    console.error("Stripe webhook verification failed", error);
    return NextResponse.json({error:"Invalid webhook signature."},{status:400});
  }
}