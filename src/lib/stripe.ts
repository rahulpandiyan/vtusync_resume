import Stripe from "stripe";

// Lazy-initialize Stripe only when needed (allows running without Stripe for local dev)
let _stripe: Stripe | null = null;

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY is not configured. Stripe features are disabled.');
    }
    _stripe = new Stripe(key, {
      apiVersion: '2025-04-30.basil'
    });
  }
  return _stripe;
}
