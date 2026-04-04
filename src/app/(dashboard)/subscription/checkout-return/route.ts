// src/app/checkout-return/route.ts

import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";

export const GET = async (request: NextRequest) => {
  const stripe = getStripe();
  const { searchParams } = new URL(request.url);

  const stripeSessionId = searchParams.get("session_id");


  if (!stripeSessionId?.length)
    return redirect("/home");

  const session = await stripe.checkout.sessions.retrieve(stripeSessionId);

  if (session.status === "complete") {
    return redirect(`/subscription/checkout/success?session_id=${stripeSessionId}`);
  }

  if (session.status === "open") {
    return redirect(
      `/subscription/checkout?price_id=${session.metadata?.price_id}`,
    );
  }

  return redirect("/home");
};
