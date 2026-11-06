import { Background } from "@/components/landing/Background";
import FeatureHighlights from "@/components/landing/FeatureHighlights";
import { Hero } from "@/components/landing/Hero";
import { PricingPlans } from "@/components/landing/PricingPlans";
import { CreatorStory } from "@/components/landing/creator-story";
import { FAQ } from "@/components/landing/FAQ";
import { Footer } from "@/components/layout/footer";
import { NavLinks } from "@/components/layout/nav-links";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Script from "next/script";
import { toSafeJsonScript } from "@/lib/html-safety";
import { AuthDialogProvider } from "@/components/auth/auth-dialog-provider";
import ClickSpark from "@/components/ClickSpark";

// Page-specific metadata
export const metadata: Metadata = {
  title: "ResuSync - AI Resume Builder for Tech Jobs",
  description: "Create ATS-optimized tech resumes in under 10 minutes. Calibrate your experience to match job descriptions word-for-word.",
  openGraph: {
    title: "ResuSync - AI Resume Builder for Tech Jobs",
    description: "Create ATS-optimized tech resumes in under 10 minutes. Calibrate your experience to match job descriptions word-for-word.",
    url: "https://resume.vtusync.in",
  },
  twitter: {
    title: "ResuSync - AI Resume Builder for Tech Jobs",
    description: "Create ATS-optimized tech resumes in under 10 minutes. Calibrate your experience to match job descriptions word-for-word.",
  },
};

export default async function Page() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (user) {
    redirect("/home");
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "ResuSync",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Create ATS-optimized tech resumes in under 10 minutes. Calibrate your experience to match job descriptions word-for-word.",
    "operatingSystem": "Web",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "500"
    }
  };
  
  return (
    <>
      <Script
        id="schema-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toSafeJsonScript(structuredData)
        }}
      />

      <AuthDialogProvider>
        <ClickSpark
          sparkColor={["#3861fb", "#60a5fa", "#3b82f6", "#818cf8"]}
          sparkSize={7}
          sparkRadius={20}
          sparkCount={7}
          duration={350}
        >
          <main aria-label="ResuSync landing page" className="overflow-x-hidden w-full relative min-h-screen">
            
            {/* Modern Floating Pill Navigation */}
            <header className="fixed top-3.5 sm:top-5 inset-x-0 z-[1000] flex justify-center px-4 pointer-events-none">
              <div className="pointer-events-auto w-full max-w-lg md:max-w-fit flex justify-center">
                <NavLinks />
              </div>
            </header>

            {/* Architectural Background strictly behind content */}
            <Background />

            {/* All Main Landing Sections in relative z-10 stacking context */}
            <div className="relative z-10 flex flex-col w-full">
              {/* Main Hero */}
              <Hero />

              {/* Substantial Technical Breakdown: #features */}
              <FeatureHighlights />

              {/* Creator Story: #about */}
              <CreatorStory />

              {/* Transparent Pricing Plans: #pricing */}
              <PricingPlans />

              {/* Technical FAQ: #faq */}
              <FAQ />

              {/* Comprehensive Landing Footer */}
              <Footer variant="static" />
            </div>
          </main>
        </ClickSpark>
      </AuthDialogProvider>
    </>
  );
}
