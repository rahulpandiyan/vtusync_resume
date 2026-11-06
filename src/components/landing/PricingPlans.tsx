"use client";

import { useMemo } from "react";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { cn } from "@/lib/utils";
import ShinyText from "@/components/ShinyText";
import Magnet from "@/components/Magnet";

interface PlanFeature {
  text: string;
  highlight?: boolean;
}

interface PricingPlan {
  name: string;
  price: string;
  period?: string;
  description: string;
  badge?: string;
  popular?: boolean;
  features: PlanFeature[];
  ctaText: string;
}

export function PricingPlans() {
  const plans = useMemo<PricingPlan[]>(() => [
    {
      name: "Free Forever",
      price: "₹0",
      description: "Everything you need to build, calibrate, and export your resume using your own API keys.",
      features: [
        { text: "Bring your own API keys (OpenAI, Claude, Gemini)" },
        { text: "2 master profile resumes" },
        { text: "5 tailored branches for specific job requisitions" },
        { text: "Single-column ATS-optimized PDF export" },
        { text: "STAR framework bullet suggestions" },
        { text: "Zero platform fees, zero watermarks" },
      ],
      ctaText: "Start Building Free",
    },
    {
      name: "Pro Lifetime",
      price: "₹199",
      period: "/ one-time pay",
      description: "Full access to hosted Claude 3.5 Sonnet & GPT\u20114o with unlimited tailored resumes.",
      badge: "MOST POPULAR",
      popular: true,
      features: [
        { text: "Hosted Claude 3.5 & GPT\u20114o (no keys needed)", highlight: true },
        { text: "Unlimited master career profiles", highlight: true },
        { text: "Unlimited tailored job branches", highlight: true },
        { text: "Instant single-column PDF generation", highlight: true },
        { text: "Direct support & student community updates", highlight: true },
        { text: "Lifetime access with zero recurring fees", highlight: true },
      ],
      ctaText: "Get Pro Lifetime Access",
    }
  ], []);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="pricing">
      
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center space-y-3.5 mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
          <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
          <span>TRANSPARENT PRICING</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.12]">
          Simple, honest pricing. No monthly traps.
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal max-w-2xl mx-auto">
          Free forever for developers who supply their own API keys. One-time student-friendly fee for hosted models.
        </p>
      </div>

      {/* Pricing Cards Container */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative p-7 sm:p-9 flex flex-col rounded-2xl transition-all duration-200",
              plan.popular
                ? "border-2 border-blue-600/70 dark:border-blue-500 bg-white dark:bg-zinc-900 shadow-md"
                : "border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/40 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-sm"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10 whitespace-nowrap">
                <span className="px-4 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-[#3861fb] text-white shadow-sm border border-white/20 whitespace-nowrap inline-flex items-center">
                  <ShinyText text={plan.badge} speed={2.5} color="#ffffff" shineColor="rgba(255,255,255,0.7)" />
                </span>
              </div>
            )}

            <div className="flex-1 flex flex-col">
              <div className="mb-5 pt-1">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1.5 mt-1.5">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-950 dark:text-zinc-50">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-zinc-500 font-medium">
                      {plan.period}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                {plan.description}
              </p>

              <div className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className={cn(
                      "mt-0.5 rounded-full p-0.5 flex-shrink-0",
                      plan.popular ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"
                    )}>
                      <Check className="h-4 w-4 stroke-[2.5]" />
                    </div>
                    <span className={cn(
                      "text-sm leading-snug",
                      feature.highlight
                        ? "text-zinc-950 dark:text-zinc-50 font-semibold"
                        : "text-zinc-600 dark:text-zinc-400"
                    )}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <AuthDialog>
              {plan.popular ? (
                <Magnet magnetStrength={2} padding={20} wrapperClassName="w-full">
                  <Button
                    variant="default"
                    className="w-full h-11 text-sm font-semibold"
                  >
                    {plan.ctaText}
                  </Button>
                </Magnet>
              ) : (
                <Button
                  variant="outline"
                  className="w-full h-11 text-sm font-semibold"
                >
                  {plan.ctaText}
                </Button>
              )}
            </AuthDialog>
          </div>
        ))}
      </div>

    </section>
  );
}
