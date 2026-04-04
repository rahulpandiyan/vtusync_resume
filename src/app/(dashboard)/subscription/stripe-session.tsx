"use server";

import { createOrRetrieveCustomer } from "@/utils/actions/stripe/actions";
import { getStripe } from "@/lib/stripe";
import { checkAuth } from "@/app/auth/login/actions";

interface NewSessionOptions {
    priceId: string;
    includeTrial?: boolean;
}

// Function to create a Stripe Checkout Session
export const postStripeSession = async ({ priceId, includeTrial = false }: NewSessionOptions) => {
    const stripe = getStripe();
    // Check if user is authenticated
    const { authenticated, user } = await checkAuth();
    
    if (!authenticated || !user?.id || !user?.email) {
        throw new Error('User must be authenticated to create a checkout session');
    }

    try {
      const customerId = await createOrRetrieveCustomer({
        uuid: user.id,
        email: user.email
      });

      const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/subscription/checkout-return?session_id={CHECKOUT_SESSION_ID}`;

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        ui_mode: "embedded",
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        allow_promotion_codes: true,
        return_url: returnUrl,
        payment_method_collection: 'always',
        ...(includeTrial && {
          subscription_data: {
            trial_period_days: 7,
          },
        }),
      });

      if (!session.client_secret) {
        throw new Error('Failed to create Stripe session');
      }

      return {
        clientSecret: session.client_secret
      };
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create checkout session');
    }
}

// Function to create a Stripe Portal Session
export const createPortalSession = async () => {
    const stripe = getStripe();
    // Check if user is authenticated
    const { authenticated, user } = await checkAuth();
    
    if (!authenticated || !user?.id || !user?.email) {
        throw new Error('User must be authenticated to access the billing portal');
    }

    try {
        // Get or create Stripe customer
        const customerId = await createOrRetrieveCustomer({
            uuid: user.id,
            email: user.email
        });

        const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/subscription`;

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });

        return {
            url: portalSession.url
        };
    } catch (error) {
        console.error('Error creating portal session:', error);
        throw new Error(error instanceof Error ? error.message : 'Failed to create portal session');
    }
}
