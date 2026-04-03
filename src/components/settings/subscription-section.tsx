'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Star, Clock, Zap, ArrowRight, Crown, Shield, Check, Users, TrendingUp } from "lucide-react"
import { cn } from '@/lib/utils';
import { getSubscriptionAccessState, type SubscriptionSnapshot } from '@/lib/subscription-access';
import { createRazorpayOrder, verifyRazorpayPayment } from '@/utils/actions/payments/actions';

interface SubscriptionSectionProps {
  initialProfile: SubscriptionSnapshot | null;
}

export function SubscriptionSection({ initialProfile }: SubscriptionSectionProps) {
  const [isLoading, setIsLoading] = useState(false);

  const subscriptionAccessState = getSubscriptionAccessState(initialProfile);
  const {
    hasProAccess,
    isCanceling,
    isExpiredProAccess,
    isTrialing,
    daysRemaining,
    currentPeriodEndLabel,
    trialDaysRemaining,
    trialEndLabel,
  } = subscriptionAccessState;

  const handleSubscriptionAction = async () => {
    try {
      setIsLoading(true);
      const scriptOk = await new Promise<boolean>((resolve) => {
        const hasRazorpay = Boolean((window as Window & { Razorpay?: unknown }).Razorpay);
        if (hasRazorpay) {
          resolve(true);
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      if (!scriptOk || hasProAccess) return;

      const order = await createRazorpayOrder('pro');
      const RazorpayCtor = (window as Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      if (!RazorpayCtor) return;
      const instance = new RazorpayCtor({
        key: order.keyId,
        order_id: order.orderId,
        amount: order.amount,
        currency: order.currency,
        name: 'ResuSync',
        description: 'ResuSync Pro (Rs 199)',
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verifyRazorpayPayment({ purpose: 'pro', ...response });
          window.location.reload();
        },
      });
      instance.open();
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  };

  const endDate = currentPeriodEndLabel;

  return (
    <div className="space-y-8">
            {/* Header Section - State Aware */}
      <div className="text-center space-y-4">
        {isCanceling ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-zinc-500 mr-2" />
              <Badge variant="outline" className="text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 font-bold">
                {daysRemaining} days remaining
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Pro access ending soon
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              {endDate
                ? `Your Pro access ends on ${endDate}. Reactivate to keep your premium features.`
                : "Your Pro access is ending soon. Reactivate to keep your premium features."}
            </p>
          </>
        ) : isExpiredProAccess ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-rose-500 mr-2" />
              <Badge variant="outline" className="text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 font-bold">
                Access expired
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Your Pro access has expired
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              {endDate
                ? `Your previous Pro access ended on ${endDate}. Upgrade to regain premium features.`
                : "Your previous Pro access has ended. Upgrade to regain premium features."}
            </p>
          </>
        ) : isTrialing ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <Badge variant="outline" className="text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold">
                {trialDaysRemaining > 0 ? `${trialDaysRemaining} days left in trial` : 'Trial ends today'}
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Free trial active — Pro unlocked
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              Enjoy full Pro access during your trial. After {trialEndLabel || 'the trial'}, upgrade once with Razorpay to continue on Pro.
            </p>
          </>
        ) : hasProAccess ? (
          <>
            <div className="flex items-center justify-center mb-2">
              <Crown className="h-5 w-5 text-zinc-900 dark:text-zinc-50 mr-2" />
              <Badge className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-bold">
                Pro Member
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              You&apos;re on the Pro plan
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              Enjoying unlimited access to all premium features and priority support.
            </p>
          </>
        ) : (
          <>
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 text-zinc-900 dark:text-zinc-50 mr-2" />
              <Badge variant="outline" className="text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 font-bold">
                3x Higher Interview Rate
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
              Upgrade to ResuSync Pro
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto">
              Join thousands of professionals landing more interviews with premium AI assistance.
            </p>
          </>
        )}
      </div>

      {/* Social Proof */}
      <div className="flex items-center justify-center text-sm text-zinc-500 dark:text-zinc-400">
        <Users className="h-4 w-4 mr-2" />
        <span>Trusted by 12,000+ professionals</span>
        <div className="flex ml-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="h-3 w-3 text-zinc-300 fill-zinc-300 dark:text-zinc-700 dark:fill-zinc-700" />
          ))}
        </div>
        <span className="ml-1">4.9/5</span>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Benefits */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            {hasProAccess ? "Your Pro Benefits" : "What you get with Pro"}
          </h3>
          
          <div className="space-y-3">
            {[
              {
                icon: Zap,
                title: "3x faster applications",
                description: "AI-powered tailoring saves hours",
                highlight: true
              },
              {
                icon: TrendingUp, 
                title: "Higher response rates",
                description: "300% increase in interviews",
                highlight: true
              },
              {
                icon: Crown,
                title: "Unlimited everything",
                description: "No limits on resumes or AI"
              },
              {
                icon: Sparkles,
                title: "Premium templates",
                description: "ATS-optimized designs"
              }
            ].map((benefit, index) => (
              <div 
                key={index}
                className={cn(
                  "flex items-start space-x-3 p-3 rounded-xl transition-colors",
                  benefit.highlight ? "bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700" : "hover:bg-zinc-50 dark:hover:bg-zinc-900 border border-transparent"
                )}
              >
                <div className={cn(
                  "p-2 rounded-lg flex-shrink-0",
                  benefit.highlight ? "bg-zinc-200 dark:bg-zinc-800" : "bg-zinc-100 dark:bg-zinc-800/50"
                )}>
                  <benefit.icon className={cn(
                    "h-4 w-4",
                    benefit.highlight ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"
                  )} />
                </div>
                <div>
                  <h4 className="font-medium text-zinc-900 dark:text-zinc-50 text-sm">{benefit.title}</h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Pricing */}
      <div className="space-y-6">
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm relative overflow-hidden">
            {!hasProAccess && (
              <div className="absolute top-0 left-0 right-0 h-1 bg-zinc-900 dark:bg-zinc-100" />
            )}
            
            <div className="text-center mb-6">
              <div className="flex items-center justify-center mb-2">
                <h4 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">ResuSync Pro</h4>
                {!hasProAccess && (
                  <Badge variant="secondary" className="ml-2 bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs border border-zinc-200 dark:border-zinc-800 shadow-none">Most Popular</Badge>
                )}
              </div>
              
              <div className="mb-3">
                <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Rs 199</span>
              </div>
              
              {!hasProAccess && (
                <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                  <p>💰 Pays for itself with one interview</p>
                  <p>💼 Compare: Resume writers charge $260+</p>
                </div>
              )}
            </div>

            {/* Feature List */}
            <div className="space-y-2 mb-6">
              {[
                "Unlimited base resumes",
                "Unlimited AI-tailored resumes", 
                "Advanced AI assistance",
                "Premium ATS templates",
                "Priority support"
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
                  <span className="text-sm text-zinc-700 dark:text-zinc-300">{feature}</span>
                </div>
              ))}
            </div>

            {/* Risk Reduction */}
            {!hasProAccess && (
              <div className="flex items-center justify-center space-x-2 mb-4 p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <Shield className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  30-day money-back guarantee
                </span>
              </div>
            )}

            {/* CTA Button */}
            <Button
              onClick={handleSubscriptionAction}
              disabled={isLoading}
              className={cn(
                "w-full py-3 font-semibold rounded-lg transition-all duration-300",
                hasProAccess
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:bg-zinc-700"
                  : "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
              )}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : hasProAccess ? (
                "Pro Activated"
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <span>Upgrade to Pro (Rs 199)</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            {!hasProAccess && (
              <p className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-3">
                Cancel anytime • No hidden fees
              </p>
            )}
          </div>

          {/* Additional CTA for canceling users */}
        </div>
      </div>
    </div>
  );
} 
