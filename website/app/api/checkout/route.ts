import { NextResponse } from "next/server";
import Stripe from "stripe";

const services: Record<string, { title: string; price: number }> = {
  "landing-page": { title: "Modern Landing Page", price: 75 },
  "discord-setup": { title: "Premium Discord Server Setup", price: 35 },
  "brand-graphics": { title: "Custom Brand Graphics", price: 45 },
  "roblox-ui": { title: "Roblox UI Development", price: 60 }
};

export async function POST(request: Request) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY to Vercel." },
        { status: 503 }
      );
    }

    const { serviceId } = await request.json();
    const service = services[serviceId];
    if (!service) return NextResponse.json({ error: "Service not found." }, { status: 404 });

    const stripe = new Stripe(secret);
    const origin =
      request.headers.get("origin") ||
      process.env.NEXT_PUBLIC_SITE_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: { name: service.title, description: "NORTHLINE marketplace order" },
          unit_amount: Math.round(service.price * 100)
        },
        quantity: 1
      }],
      success_url: origin + "/orders/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/service/" + serviceId,
      metadata: { serviceId, platform: "NORTHLINE" }
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error", error);
    return NextResponse.json({ error: "Unable to create checkout session." }, { status: 500 });
  }
}