import { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | ResuSync',
  description: 'Privacy Policy for ResuSync (powered by VTUSync). Learn how we handle and protect your data.',
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[2000px] mx-auto h-full px-4 sm:px-6 flex items-center font-bold text-lg">
          Privacy Policy
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Privacy Policy</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Last updated: April 3, 2026</p>
        </div>

        <section className="space-y-6 text-zinc-700 dark:text-zinc-300">
          <p>
            Welcome to ResuSync, a product built and powered by VTUSync. This Privacy Policy explains how your personal 
            information is collected, used, and protected when you use our website, application, 
            and services (collectively, the &quot;Service&quot;). By accessing the Service, you consent to the practices described in this policy.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">1. Information We Collect</h2>
          <p>We only collect the information necessary to provide and improve our services:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Data:</strong> When you register, we collect your email address, name, and basic authentication details provided by Google Auth or standard login.</li>
            <li><strong>Resume Data:</strong> We store the structured content of resumes you create or upload (e.g., job history, education, skills).</li>
            <li><strong>Usage Data:</strong> We use PostHog analytics to track feature usage, errors, and behavioral metrics to improve platform functionality.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">2. AI Processing and API Keys</h2>
          <p>
            When utilizing AI features to generate or tailor resumes, your data is sent to language model providers (like OpenAI, Anthropic, or Groq):
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Pro Users:</strong> AI processing is handled via our secure enterprise API connections. We do not use your resume data to train our own models.</li>
            <li><strong>Free Users with Personal API Keys:</strong> If you supply your own API keys, they are stored entirely locally in your browser&apos;s storage. We do not send your raw API keys to our backend.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">3. Payment Information</h2>
          <p>
            All subscriptions and payments are securely processed by RazorPay. ResuSync/VTUSync does not collect, 
            store, or process your raw credit card information. We only store payment status and subscription tier records.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">4. Data Security</h2>
          <p>
            Your profile and resume data are stored securely using Supabase (PostgreSQL) with strict Row Level Security (RLS) policies 
            that guarantee your data is isolated and only accessible to you when authenticated.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">5. Account Deletion</h2>
          <p>
            You have full control over your data. In the Settings &gt; Danger Zone area, you can permanently delete your account. 
            This action instantly and irreversibly removes all your personal information, resumes, and API configurations from our active databases.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy or how your data is handled, please reach out to us at:
            <br />
            <a href="mailto:help@vtusync.in" className="text-zinc-900 dark:text-zinc-50 font-semibold hover:underline">
              help@vtusync.in
            </a>
          </p>
        </section>
      </main>

      <Footer variant="static" />
    </div>
  );
}
