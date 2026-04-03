'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Clock, 
  Users, 
  TrendingUp, 
  Shield, 
  Crown,
  Star,
  Zap,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { createPortalSession } from '@/app/(dashboard)/subscription/stripe-session';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getSubscriptionAccessState, type SubscriptionSnapshot } from '@/lib/subscription-access';

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

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    content: "ResuSync helped me land 3 interviews in my first week. The AI suggestions were spot-on.",
    avatar: "SC"
  },
  {
    name: "Marcus Johnson", 
    role: "Product Manager at Meta",
    content: "Went from 2% to 15% response rate. This tool paid for itself with my first interview.",
    avatar: "MJ"
  },
  {
    name: "Emily Rodriguez",
    role: "Data Scientist at Microsoft", 
    content: "The tailored resumes feature is a game-changer. Got my dream job in 3 weeks.",
    avatar: "ER"
  }
];

export function OptimizedSubscriptionPage({ initialProfile }: OptimizedSubscriptionPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const subscriptionAccessState = getSubscriptionAccessState(initialProfile);
  const {
    hasProAccess,
    isCanceling,
    isExpiredProAccess,
    daysRemaining,
    currentPeriodEndLabel,
  } = subscriptionAccessState;

  const handleUpgrade = async () => {
    if (hasProAccess) {
      // Handle portal session for existing pro users
      try {
        setIsLoading(true);
        const result = await createPortalSession();
        if (result?.url) {
          window.location.href = result.url;
        }
      } catch {
        // Handle error silently
      } finally {
        setIsLoading(false);
      }
    } else {
      // Handle checkout for free users
      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;
      if (priceId) {
        router.push(`/subscription/checkout?price_id=${priceId}`);
      }
    }
  };

  const endDate = currentPeriodEndLabel;

  return (
    <div className="min-h-screen bg-white relative">
      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl pb-24">
        {/* Header Section - State Aware */}
        <div className="text-center mb-12">
          {isCanceling ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-secondary mr-3" />
                <Badge variant="outline" className="text-secondary border-secondary/20 bg-secondary/10 font-black uppercase tracking-wider px-4 py-1">
                  {daysRemaining} days remaining
                </Badge>
              </div>
              <h1 className="text-5xl font-black text-foreground mb-6 uppercase tracking-tight">
                Don&apos;t lose your edge
              </h1>
              <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">
                {endDate
                  ? `Your Pro access ends on ${endDate}. Keep the momentum going.`
                  : "Your Pro access is ending soon. Keep the momentum going."}
              </p>
            </>
          ) : isExpiredProAccess ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <Clock className="h-10 w-10 text-destructive mr-3" />
                <Badge variant="outline" className="text-destructive border-destructive/20 bg-destructive/10 font-black uppercase tracking-wider px-4 py-1">
                  Access expired
                </Badge>
              </div>
              <h1 className="text-5xl font-black text-foreground mb-6 uppercase tracking-tight">
                Your Pro access has expired
              </h1>
              <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">
                {endDate
                  ? `Your previous Pro access ended on ${endDate}. Upgrade to unlock premium features again.`
                  : "Your previous Pro access has ended. Upgrade to unlock premium features again."}
              </p>
            </>
          ) : hasProAccess ? (
            <>
              <div className="flex items-center justify-center mb-6">
                <Crown className="h-10 w-10 text-secondary mr-3" />
                <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-black uppercase tracking-wider px-4 py-1">
                  Pro Member
                </Badge>
              </div>
              <h1 className="text-5xl font-black text-foreground mb-6 uppercase tracking-tight">
                You&apos;re a Pro member
              </h1>
              <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">
                Continue leveraging premium AI tools to stay ahead in your job search.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center mb-6">
                <TrendingUp className="h-10 w-10 text-primary mr-3" />
                <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10 font-black uppercase tracking-wider px-4 py-1">
                  3x Higher Interview Rate
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 uppercase tracking-tight">
                Ready to land your dream job?
              </h1>
              <p className="text-xl text-muted-foreground font-bold max-w-2xl mx-auto">
                Join thousands of professionals who&apos;ve upgraded their careers.
              </p>
            </>
          )}
        </div>

        {/* Social Proof Bar */}
        <div className="flex flex-wrap items-center justify-center mb-16 gap-6 text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            <span className="font-bold">12,000+ professionals</span>
          </div>
          <div className="flex items-center">
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-secondary fill-current" />
              ))}
            </div>
            <span className="font-bold">4.9/5 rating</span>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column - Value Proposition */}
          <div className="space-y-12">
            {/* Key Benefits */}
            <div className="space-y-8">
              <h2 className="text-3xl font-black text-foreground uppercase tracking-tight">
                {hasProAccess ? "Your Pro Benefits" : "What you get with Pro"}
              </h2>
              
              <div className="grid gap-6">
                {[
                  {
                    icon: Zap,
                    title: "3x faster applications",
                    description: "AI-powered tailoring saves 15+ hours per week",
                    highlight: true
                  },
                  {
                    icon: TrendingUp, 
                    title: "Higher response rates",
                    description: "Members see 300% increase in interviews",
                    highlight: true
                  },
                  {
                    icon: Crown,
                    title: "Unlimited everything",
                    description: "No limits on resumes, tailoring, or AI assistance"
                  }
                ].map((benefit, index) => (
                  <div 
                    key={index}
                    className={cn(
                      "flex items-start space-x-6 p-6 rounded-2xl border-2 transition-all duration-200",
                      benefit.highlight 
                        ? "bg-primary/5 border-primary shadow-[0_4px_0_0_hsl(var(--primary-border))]" 
                        : "bg-white border-muted shadow-[0_4px_0_0_rgba(0,0,0,0.05)]"
                    )}
                  >
                    <div className={cn(
                      "p-3 rounded-2xl",
                      benefit.highlight ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                    )}>
                      <benefit.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-wider text-foreground mb-1">{benefit.title}</h3>
                      <p className="text-muted-foreground font-bold">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">Success Stories</h3>
              <div className="grid gap-6">
                {testimonials.slice(0, 2).map((testimonial, index) => (
                  <div key={index} className="p-6 bg-white border-2 border-muted rounded-2xl shadow-[0_4px_0_0_rgba(0,0,0,0.05)]">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-secondary rounded-2xl flex items-center justify-center text-white font-black">
                        {testimonial.avatar}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground font-bold italic mb-3">&ldquo;{testimonial.content}&rdquo;</p>
                        <p className="text-sm text-muted-foreground font-bold">
                          <span className="text-foreground font-black uppercase tracking-wider">{testimonial.name}</span> • {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Pricing & CTA */}
          <div className="space-y-8">
            {/* Pricing Section */}
            <div className="bg-white rounded-3xl border-2 border-secondary p-10 shadow-[0_8px_0_0_hsl(var(--secondary-border))] relative overflow-hidden">
              <div className="text-center mb-10">
                <div className="flex items-center justify-center mb-4">
                  <h3 className="text-3xl font-black text-foreground uppercase tracking-tight">ResuSync Pro</h3>
                  {!hasProAccess && (
                    <Badge className="ml-3 bg-secondary text-white font-black uppercase tracking-wider px-3 py-1">Best Value</Badge>
                  )}
                </div>
                
                <div className="mb-6">
                  <span className="text-6xl font-black text-foreground">$20</span>
                  <span className="text-xl font-bold text-muted-foreground">/month</span>
                </div>
                
                {!hasProAccess && (
                  <div className="space-y-2 text-muted-foreground font-bold">
                    <p>💰 <span className="text-foreground font-black uppercase tracking-wider">Pays for itself</span> with one interview</p>
                    <p>⏰ Less than one lunch per month</p>
                  </div>
                )}
              </div>

              {/* Feature List */}
              <div className="space-y-5 mb-10">
                {[
                  "Unlimited base resumes",
                  "Unlimited AI-tailored resumes", 
                  "Advanced AI assistance",
                  "Premium ATS-optimized templates",
                  "Priority customer support",
                  "Custom branding options"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-foreground font-bold">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Risk Reduction */}
              {!hasProAccess && (
                <div className="flex items-center justify-center space-x-3 mb-8 p-4 bg-primary/5 rounded-2xl border-2 border-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                  <span className="text-primary font-black uppercase tracking-wider text-sm">
                    30-day money-back guarantee
                  </span>
                </div>
              )}

              {/* CTA Button */}
              <Button
                onClick={handleUpgrade}
                disabled={isLoading}
                size="lg"
                className={cn(
                  "w-full py-8 text-xl font-black uppercase tracking-widest rounded-2xl",
                  hasProAccess
                    ? "bg-muted text-muted-foreground border-2 border-muted hover:border-muted-foreground/30 shadow-[0_4px_0_0_rgba(0,0,0,0.1)]"
                    : "bg-secondary text-white shadow-[0_6px_0_0_hsl(var(--secondary-border))] hover:shadow-[0_8px_0_0_hsl(var(--secondary-border))] translate-y-[-2px] hover:translate-y-[-4px] active:translate-y-[0px] active:shadow-none"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : hasProAccess ? (
                  "Manage Subscription"
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Unlock Pro Now</span>
                    <ArrowRight className="h-6 w-6" />
                  </div>
                )}
              </Button>

              {!hasProAccess && (
                <p className="text-center font-bold text-muted-foreground/60 mt-6 text-sm uppercase tracking-wider">
                  Cancel anytime • Instant access
                </p>
              )}
            </div>

            {/* Additional CTA for canceling users */}
            {isCanceling && (
              <div className="bg-secondary/10 border-2 border-secondary rounded-3xl p-8 shadow-[0_4px_0_0_hsl(var(--secondary-border))] text-center">
                <h4 className="text-2xl font-black text-secondary uppercase tracking-tight mb-3">Limited Time Offer</h4>
                <p className="text-secondary font-bold mb-6">
                  Reactivate now and get 2 months for the price of 1
                </p>
                <Button
                  onClick={handleUpgrade}
                  className="bg-secondary font-black uppercase tracking-wider px-8"
                >
                  Save 50% Now
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
