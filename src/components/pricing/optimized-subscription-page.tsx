'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Check, 
  Clock, 
  Users, 
  Shield, 
  Star,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { getSubscriptionAccessState, type SubscriptionSnapshot } from '@/lib/subscription-access';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/utils/actions/payments/actions';

interface Profile extends SubscriptionSnapshot {
  subscription_plan: string | null;
  subscription_status: string | null;
  current_period_end: string | null;
  trial_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

interface OptimizedSubscriptionPageProps {
  initialProfile: Profile | null;
}

export function OptimizedSubscriptionPage({ initialProfile }: OptimizedSubscriptionPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const subscriptionAccessState = getSubscriptionAccessState(initialProfile);
  const { hasProAccess, isCanceling, isExpiredProAccess, currentPeriodEndLabel } =
    subscriptionAccessState;

  const loadRazorpayScript = async () => {
    if (typeof window === 'undefined') return false;
    if ((window as Window & { Razorpay?: unknown }).Razorpay) return true;
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const startPayment = async () => {
    if (hasProAccess) return;

    setIsLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Failed to load Razorpay checkout');

      const order = await createRazorpayOrder('pro');
      const RazorpayCtor = (window as Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } })
        .Razorpay;
      if (!RazorpayCtor) throw new Error('Razorpay unavailable');

      const paymentInstance = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'ResuSync',
        description: 'ResuSync Pro Plan (Rs 199)',
        theme: { color: '#18181b' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verifyRazorpayPayment({ purpose: 'pro', ...response });
          window.location.reload();
        },
      });

      paymentInstance.open();
    } catch {
      // keep UX simple; page remains usable for retry
    } finally {
      setIsLoading(false);
    }
  };

  const endDate = currentPeriodEndLabel;
  const isPro = hasProAccess;

  const FreePlan = (
    <div className="v-card flex flex-col p-8 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
      <div className="mb-8">
        <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">FREE</p>
        <h3 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Free</h3>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
        Ideal for trying out the platform and basic job applications.
      </p>
      <div className="space-y-4 mb-10 flex-1">
        {[
          "Use your own API keys",
          "2 base resumes",
          "5 tailored resumes",
          "Watermarked PDF exports",
          "Smart formatting"
        ].map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className="h-4 w-4 text-zinc-400 mt-0.5" />
            <span className="text-sm text-zinc-600 dark:text-zinc-400">{feature}</span>
          </div>
        ))}
      </div>
      <Button variant="outline" disabled className="w-full h-11 border-zinc-200 dark:border-zinc-800 text-zinc-400">
        {isPro ? "Previous Plan" : "Current Plan"}
      </Button>
    </div>
  );

  const ProPlan = (
    <div className="relative v-card flex flex-col p-8 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-xl ring-1 ring-zinc-900/5 dark:ring-zinc-100/5">
      {!isPro && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-[10px] font-bold uppercase tracking-widest z-10 whitespace-nowrap">
          <div className="flex items-center gap-1.5 ">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Most Popular
          </div>
        </div>
      )}
      <div className="mb-8">
        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 uppercase tracking-widest mb-1">PRO</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Rs 199</span>
          <span className="text-sm font-medium text-zinc-400">/one-time</span>
        </div>
      </div>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
        Everything you need to land your dream job with premium AI assistance.
      </p>
      <div className="space-y-4 mb-10 flex-1">
        {[
          { text: "Unlimited base resumes", bold: true },
          { text: "Unlimited AI-tailored resumes", bold: true },
          { text: "Advanced AI assistance", bold: true },
          { text: "Premium ATS templates", bold: true },
          { text: "No watermark on exports", bold: true },
          { text: "Priority support", bold: true }
        ].map((feature, i) => (
          <div key={i} className="flex items-start gap-3">
            <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-50 mt-0.5" />
            <span className={cn("text-sm", feature.bold ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-600 dark:text-zinc-400")}>
              {feature.text}
            </span>
          </div>
        ))}
      </div>
      <Button
        onClick={() => startPayment()}
        disabled={Boolean(isLoading) || isPro}
        className={cn(
          "w-full h-11 text-sm font-bold transition-all",
          isPro 
            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700" 
            : "v-button-primary"
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isPro ? (
          "Pro Activated"
        ) : (
          "Upgrade Now"
        )}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950/50 relative pb-16 lg:pb-0">
      <div className="relative z-10 container mx-auto px-4 py-20 max-w-5xl pb-32">
        {/* Simplified Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
              Subscription
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
            {isPro ? "Your Pro Membership" : "Upgrade to Pro"}
          </h1>
          
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            {isPro 
              ? "You have full access to all premium features. Keep building your career."
              : "Unlock advanced AI features and remove watermarks to stand out from the competition."}
          </p>
        </div>

        {/* Status Alerts (Only if relevant state) */}
        {(isCanceling || isExpiredProAccess) && (
          <div className="max-w-2xl mx-auto mb-12">
            {isCanceling ? (
              <div className="v-card p-4 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 flex items-center gap-4">
                <Clock className="h-5 w-5 text-amber-600" />
                <p className="text-sm text-amber-800 dark:text-amber-400 font-medium">
                  Your Pro access ends on {endDate}. Reactivate to keep your edge.
                </p>
              </div>
            ) : (
              <div className="v-card p-4 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 flex items-center gap-4">
                <Shield className="h-5 w-5 text-rose-600" />
                <p className="text-sm text-rose-800 dark:text-rose-400 font-medium">
                  Your Pro access expired on {endDate}. Upgrade to regain your features.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
          {FreePlan}
          {ProPlan}
        </div>


        {/* Social Proof (Subtle) */}
        <div className="mt-20 flex flex-col items-center gap-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
           <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm text-zinc-500 font-medium text-center">
             <Users className="h-4 w-4" />
             <span>Trusted by 12,000+ professionals</span>
             <span className="w-px h-4 bg-zinc-300 dark:bg-zinc-800" />
             <div className="flex gap-0.5">
               {[...Array(5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-zinc-400 text-zinc-400" />)}
             </div>
             <span>4.9/5</span>
           </div>
        </div>
      </div>
    </div>
  );
}
