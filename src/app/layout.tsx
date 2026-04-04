import { Nunito } from "next/font/google";
import { DisableRightClick } from "@/components/layout/disable-right-click";

import "./globals.css";
import { Toaster } from "sonner";
import { Footer } from "@/components/layout/footer";
import { AppHeader } from "@/components/layout/app-header";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import Link from "next/link";
import { cookies } from "next/headers";
import { PostHogProvider } from "@/components/analytics/posthog-provider";
import {
  IMPERSONATION_STATE_COOKIE_NAME,
  parseImpersonationStateCookieValue,
} from "@/lib/impersonation";
import { getSubscriptionAccessState } from "@/lib/subscription-access";

// Only enable Vercel Analytics when running on Vercel platform
const isVercel = process.env.VERCEL === '1';

const nunito = Nunito({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://resusync.com"),
  title: {
    default: "ResuSync - AI-Powered Resume Builder",
    template: "%s | ResuSync"
  },
  description: "Create tailored, ATS-optimized resumes powered by AI. Land your dream tech job with ResuSync's smart resume builder.",
  applicationName: "ResuSync",
  keywords: ["resume builder", "AI resume", "ATS optimization", "tech jobs", "career tools", "job application", "resusync"],
  authors: [{ name: "ResuSync" }],
  creator: "ResuSync",
  publisher: "ResuSync",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  openGraph: {
    type: "website",
    siteName: "ResuSync",
    title: "ResuSync - AI-Powered Resume Builder",
    description: "Create tailored, ATS-optimized resumes powered by AI. Land your dream tech job with ResuSync's smart resume builder.",
    images: [
      {
        url: "/og.webp",
        width: 1200,
        height: 630,
        alt: "ResuSync - AI Resume Builder",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResuSync - AI-Powered Resume Builder",
    description: "Create tailored, ATS-optimized resumes powered by AI. Land your dream tech job with ResuSync's smart resume builder.",
    images: ["/og.webp"],
    creator: "@resusync",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  // verification: {
  //   google: "google-site-verification-code", // Replace with actual verification code
  // },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Detect impersonation via signed cookie set during /admin/impersonate flow
  const cookieStore = await cookies();
  const impersonationState = parseImpersonationStateCookieValue(
    cookieStore.get(IMPERSONATION_STATE_COOKIE_NAME)?.value
  );
  const isImpersonating = Boolean(impersonationState);

  
  let showUpgradeButton = false;
  let isProPlan = false;
  let upgradeButtonVariant: 'trial' | 'upgrade' = 'upgrade';
  if (user) {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('subscription_plan, subscription_status, current_period_end, trial_end, stripe_subscription_id')
        .eq('user_id', user.id)
        .maybeSingle();

      const subscriptionState = getSubscriptionAccessState(subscription);
      const hasProAccess = subscriptionState.hasProAccess;
      const needsTrial = subscriptionState.needsTrial;

      isProPlan = hasProAccess;
      showUpgradeButton = !hasProAccess;
      upgradeButtonVariant = needsTrial ? 'trial' : 'upgrade';
    } catch {
      // If there's an error, we'll show the upgrade button by default
      showUpgradeButton = true;
      isProPlan = false;
      upgradeButtonVariant = 'upgrade';
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={nunito.className}>
        <DisableRightClick />
        <PostHogProvider>
          {isImpersonating && user && (
            <div className="bg-amber-500 text-white text-center text-sm py-2">
              Impersonating&nbsp;<span className="font-semibold">{user.email ?? user.id}</span>.&nbsp;
              <Link href="/stop-impersonation" className="underline font-medium">
                Stop impersonating
              </Link>
            </div>
          )}
          <div className="relative min-h-screen">
            <main className="h-full">
              {children}
              {isVercel && <Analytics />}
            </main>
          </div>
          <Toaster
            richColors
            position="top-center"
            closeButton
          />
        </PostHogProvider>
      </body>
    </html>
  );
}
