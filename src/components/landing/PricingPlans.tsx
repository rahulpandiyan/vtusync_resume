"use client"

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useMemo, useRef } from "react";
import { Check, Sparkles } from "lucide-react";
import { useInView } from "framer-motion";
import { AuthDialog } from "@/components/auth/auth-dialog";

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
  ctaLink: string;
  ctaSecondary?: boolean;
}

export function PricingPlans() {
  const plans = useMemo<PricingPlan[]>(() => [
    {
      name: "FREE",
      price: "$0",
      description: "Ideal for trying out the platform",
      features: [
        { text: "Use your own API keys" },
        { text: "2 base resumes" },
        { text: "5 tailored resumes" },
        { text: "Smart formatting" },
      ],
      ctaText: "Get Started",
      ctaLink: "/auth/register",
      ctaSecondary: true,
    },
    {
      name: "PRO",
      price: "$20",
      period: "/month",
      description: "Everything you need to get hired",
      badge: "MOST POPULAR",
      popular: true,
      features: [
        { text: "Access to all premium AI models", highlight: true },
        { text: "Unlimited base resumes", highlight: true },
        { text: "Unlimited tailored resumes", highlight: true },
        { text: "Support student developers ❤️", highlight: true },
      ],
      ctaText: "Upgrade Now",
      ctaLink: "/auth/register",
    }
  ], []);

  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 px-4 relative bg-white dark:bg-zinc-950 scroll-mt-10" 
      id="pricing"
    >
      {/* Heading */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-16">
        <div className="flex justify-center mb-8">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
            Simple Pricing
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
          Ready to get hired?
        </h2>
        
        <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Choose the plan that fits your career stage. Upgrade or downgrade anytime.
        </p>
      </div>
      
      {/* Pricing Cards Grid */}
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative p-8 flex flex-col rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all duration-300",
              plan.popular 
                ? "ring-1 ring-zinc-900 dark:ring-zinc-100 shadow-xl" 
                : "hover:border-zinc-300 dark:hover:border-zinc-700"
            )}
          >
            {/* Badge for Popular Plan */}
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-[10px] font-bold uppercase tracking-widest z-10 whitespace-nowrap">
                <div className="flex items-center gap-1.5 ">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="flex-1 flex flex-col">
              <div className="mb-8">
                <p className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest mb-1">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">{plan.price}</span>
                  {plan.period && <span className="text-sm font-medium text-zinc-400">{plan.period}</span>}
                </div>
              </div>
              
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 leading-relaxed">
                {plan.description}
              </p>
              
              <div className="space-y-4 mb-10">
                {plan.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className={cn(
                      "mt-1 h-4 w-4 rounded-full flex items-center justify-center flex-shrink-0",
                      plan.popular ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950" : "bg-zinc-100 dark:bg-zinc-900 text-zinc-400"
                    )}>
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                    <span className={cn(
                      "text-sm",
                      feature.highlight ? "text-zinc-900 dark:text-zinc-100 font-medium" : "text-zinc-500 dark:text-zinc-400"
                    )}>
                      {feature.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <AuthDialog>
              <Button 
                variant={plan.popular ? "default" : "outline"}
                className={cn(
                  "w-full h-11 text-sm font-semibold transition-all",
                  !plan.popular && "border-zinc-200 dark:border-zinc-800"
                )}
              >
                {plan.ctaText}
              </Button>
            </AuthDialog>
          </div>
        ))}
      </div>
    </section>
  );
}

export default PricingPlans;