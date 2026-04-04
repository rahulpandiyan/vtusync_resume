// src/app/api/webhooks/stripe/route.ts

import { headers } from 'next/headers'
import Stripe from 'stripe'
import { manageSubscriptionStatusChange } from '@/utils/actions/stripe/actions'
import { getStripe } from '@/lib/stripe'
import { createServiceClient } from '@/utils/supabase/server'


const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

const relevantEvents = new Set([
  'checkout.session.completed',
  'invoice.paid',
  'customer.subscription.created',
  'customer.subscription.updated',
  'customer.subscription.deleted',
  'customer.deleted'
]);

type ServiceSupabaseClient = Awaited<ReturnType<typeof createServiceClient>>;

async function reserveWebhookEvent(
  supabase: ServiceSupabaseClient,
  event: Stripe.Event
): Promise<'process' | 'skip'> {
  const { data: existingEvent, error: existingEventError } = await supabase
    .from('stripe_webhook_events')
    .select('event_id, processed_at')
    .eq('event_id', event.id)
    .maybeSingle();

  if (existingEventError) throw existingEventError;

  if (existingEvent?.processed_at) {
    return 'skip';
  }

  if (!existingEvent) {
    const { error: insertError } = await supabase
      .from('stripe_webhook_events')
      .insert({
        event_id: event.id,
        event_type: event.type,
      });

    if (insertError) {
      const isDuplicateEvent = (insertError as { code?: string }).code === '23505';
      if (!isDuplicateEvent) throw insertError;

      const { data: duplicateEvent, error: duplicateEventError } = await supabase
        .from('stripe_webhook_events')
        .select('event_id, processed_at')
        .eq('event_id', event.id)
        .maybeSingle();

      if (duplicateEventError) throw duplicateEventError;
      if (duplicateEvent?.processed_at) {
        return 'skip';
      }
    }
  }

  return 'process';
}

async function markWebhookEventProcessed(
  supabase: ServiceSupabaseClient,
  eventId: string
): Promise<void> {
  const { error } = await supabase
    .from('stripe_webhook_events')
    .update({ processed_at: new Date().toISOString() })
    .eq('event_id', eventId);

  if (error) throw error;
}

async function handleSubscriptionChange(
  stripeCustomerId: string,
  subscriptionData: {
    subscriptionId: string | null;
    planId: string;
    status: 'active' | 'canceled';
    currentPeriodEnd: Date | null;
    trialEnd?: Date | null;
    cancelAtPeriodEnd?: boolean;
  }
) {
  try {
    // Update subscription in database
    await manageSubscriptionStatusChange(
      subscriptionData.subscriptionId ?? '',
      stripeCustomerId,
      subscriptionData.status === 'active' && !subscriptionData.cancelAtPeriodEnd
    );
  } catch (error) {
    throw error;
  }
}

export async function POST(req: Request) {
  const stripe = getStripe();
  try {
    const body = await req.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      return new Response(
        JSON.stringify({ error: 'Missing stripe-signature header' }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: unknown) {
      const error = err as Error
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    if (!relevantEvents.has(event.type)) {
      return new Response(
        JSON.stringify({ received: true, processed: false, message: `Event type ${event.type} was received but not processed` }),
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = await createServiceClient();
    const webhookEventAction = await reserveWebhookEvent(supabase, event);
    if (webhookEventAction === 'skip') {
      return new Response(
        JSON.stringify({ received: true, processed: false, duplicate: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Handle the event based on type
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          
          await handleSubscriptionChange(
            session.customer as string,
            {
              subscriptionId: subscription.id,
              planId: subscription.items.data[0].price.id,
              status: 'active',
              currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
            }
          );
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
        
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
          
          await handleSubscriptionChange(
            invoice.customer as string,
            {
              subscriptionId: subscription.id,
              planId: subscription.items.data[0].price.id,
              status: 'active',
              currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
              trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
            }
          );
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await handleSubscriptionChange(
          subscription.customer as string,
          {
            subscriptionId: subscription.id,
            planId: subscription.items.data[0].price.id,
            status: subscription.cancel_at_period_end ? 'canceled' : subscription.status === 'active' ? 'active' : 'canceled',
            currentPeriodEnd: new Date(subscription.items.data[0].current_period_end * 1000),
            trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
            cancelAtPeriodEnd: subscription.cancel_at_period_end
          }
        );
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        await handleSubscriptionChange(
          subscription.customer as string,
          {
            subscriptionId: subscription.id,
            planId: 'free',
            status: 'canceled',
            currentPeriodEnd: null,
            trialEnd: null,
            cancelAtPeriodEnd: false
          }
        );
        break;
      }

      case 'customer.deleted': {
        const customer = event.data.object as Stripe.Customer;

        try {
          await supabase
            .from('subscriptions')
            .delete()
            .eq('stripe_customer_id', customer.id);
        } catch {
          // Subscription may not exist
        }
        break;
      }

      default: {
        // Unhandled event type - no action needed
      }
    }

    await markWebhookEventProcessed(supabase, event.id);

    return new Response(
      JSON.stringify({ received: true }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch {
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
}
