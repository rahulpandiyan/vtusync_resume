"use server";

import Razorpay from "razorpay";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type PaymentPurpose = "pro" | "watermark";

const PAYMENT_AMOUNTS: Record<PaymentPurpose, number> = {
  pro: 19900,
  watermark: 4900,
};

function getRazorpayClient() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new Error("Razorpay keys are not configured.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

export async function getBillingStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const { data } = await supabase
    .from("subscriptions")
    .select("subscription_plan, subscription_status, watermark_unlocked")
    .eq("user_id", user.id)
    .maybeSingle();

  const hasProAccess = data?.subscription_plan === "pro" && data?.subscription_status === "active";
  const hasWatermarkAccess = hasProAccess || Boolean(data?.watermark_unlocked);

  return {
    hasProAccess,
    hasWatermarkAccess,
    plan: data?.subscription_plan ?? "free",
  };
}

export async function createRazorpayOrder(purpose: PaymentPurpose, resumeId?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const amount = PAYMENT_AMOUNTS[purpose];
  const client = getRazorpayClient();

  const order = await client.orders.create({
    amount,
    currency: "INR",
    receipt: `${purpose}-${user.id.slice(0, 12)}-${Date.now()}`,
    notes: {
      purpose,
      user_id: user.id,
      resume_id: resumeId || "",
    },
  });

  return {
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID as string,
  };
}

export async function verifyRazorpayPayment(payload: {
  purpose: PaymentPurpose;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  resumeId?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not authenticated");

  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) throw new Error("Razorpay secret missing");

  const generatedSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${payload.razorpay_order_id}|${payload.razorpay_payment_id}`)
    .digest("hex");

  if (generatedSignature !== payload.razorpay_signature) {
    throw new Error("Invalid payment signature");
  }

  const isPro = payload.purpose === "pro";
  
  if (payload.purpose === "watermark" && payload.resumeId) {
    // Per-resume watermark removal
    const { error } = await supabase
      .from("resumes")
      .update({ watermark_removed: true })
      .eq("id", payload.resumeId)
      .eq("user_id", user.id);
      
    if (error) throw error;
  } else {
    // Global subscription update (Pro or legacy watermark)
    const updateData = {
      user_id: user.id,
      subscription_plan: isPro ? "pro" : "free",
      subscription_status: "active",
      watermark_unlocked: !isPro, // Only for legacy global watermark
      current_period_end: null,
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("subscriptions").upsert(updateData, {
      onConflict: "user_id",
    });

    if (error) throw error;
  }

  revalidatePath("/subscription");
  revalidatePath(`/resumes/${payload.resumeId || ""}`);
  revalidatePath("/resumes");

  return { success: true };
}
