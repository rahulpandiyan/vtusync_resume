import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AuthDialog } from "@/components/auth/auth-dialog";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingTier {
  name: string;
  price: string;
  description: string;
  features: PricingFeature[];
  buttonText: string;
  gradient: string;
  popular?: boolean;
}

const tiers: PricingTier[] = [
  {
    name: "Free",
    price: "$0",
    description: "Self-host or use with your own API keys",
    gradient: "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border-zinc-200 dark:border-zinc-800",
    features: [
      { text: "Use your own API keys", included: true },
      { text: "2 base resumes", included: true },
      { text: "5 tailored resumes", included: true },
      { text: "Self-host option available", included: true },
    ],
    buttonText: "Get Started",
  },
  {
    name: "Pro",
    price: "$20",
    description: "Enhanced features for serious job seekers",
    gradient: "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 border-zinc-900 dark:border-zinc-50",
    popular: true,
    features: [
      { text: "Access to all premium AI models", included: true },
      { text: "Unlimited base resumes", included: true },
      { text: "Unlimited tailored resumes", included: true },
      { text: "Support an independent student developer ❤️", included: true },
    ],
    buttonText: "Get Started",
  },
];

export function PricingSection() {
  return (
    <section className="pb-16 px-4 sm:px-6 lg:px-8 relative ">
      {/* Background gradient orbs removed for cleaner UI */}
      <div className="absolute inset-0 w-full h-full -z-10" />

      <div className="max-w-7xl mx-auto relative">
        {/* Section Header */}
        <div className="text-center mb-24">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-zinc-900 dark:text-zinc-50 pb-3">
            Pricing
          </h2>
          <div className="flex flex-col items-center gap-3 mb-12">
            <div className="flex flex-col items-center px-6 py-2.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                ⭐ Free to use with your own API keys
              </span>
            </div>
            <p className="text-sm text-zinc-500 transition-colors duration-300">
              ResuSync is open source and free to use. Pro version with managed API keys coming soon!
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative rounded-2xl h-full transition-all duration-500",
                tier.popular && "scale-105 md:-mt-8 z-10"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-6 left-0 right-0 mx-auto w-36 rounded-full bg-zinc-900 dark:bg-zinc-50 px-4 py-1.5 text-sm text-zinc-50 dark:text-zinc-900 text-center font-medium shadow-sm">
                  Coming Soon
                </div>
              )}

              <div className="h-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-10 relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-500">
                {/* Background gradient effect removed */}

                <div className="mb-10">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{tier.name}</h3>
                  <div className="mt-5 flex items-baseline">
                    <span className="text-6xl font-bold text-zinc-900 dark:text-zinc-50">
                      {tier.price}
                    </span>
                    {tier.price !== "$0" && (
                      <span className="ml-2 text-muted-foreground">/month</span>
                    )}
                  </div>
                  <p className="mt-3 text-muted-foreground">{tier.description}</p>
                </div>

                <ul className="space-y-5 mb-10">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-4">
                      <div className={cn(
                        "rounded-full p-1",
                        feature.included ? "bg-zinc-900 dark:bg-zinc-50" : "bg-zinc-200 dark:bg-zinc-800"
                      )}>
                        <Check className={cn(
                          "h-4 w-4",
                          feature.included ? "text-zinc-50 dark:text-zinc-900" : "text-zinc-400 dark:text-zinc-500"
                        )} />
                      </div>
                      <span className={cn(
                        "text-sm font-medium",
                        feature.included ? "text-zinc-900 dark:text-zinc-300" : "text-zinc-500"
                      )}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <AuthDialog>
                  <Button
                    className={cn(
                      "w-full h-12 text-base shadow-sm hover:shadow-md transition-all duration-500",
                      tier.popular ? "bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200" : "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    )}
                  >
                    {tier.buttonText}
                  </Button>
                </AuthDialog>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 