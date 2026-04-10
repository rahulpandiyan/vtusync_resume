import { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Terms of Service | ResuSync',
  description: 'Terms of Service for ResuSync - AI Resume Builder (powered by VTUSync).',
};

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-[2000px] mx-auto h-full px-4 sm:px-6 flex items-center font-bold text-lg">
          Terms of Service
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 md:py-24 space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">Terms of Service</h1>
          <p className="text-zinc-500 dark:text-zinc-400">Last updated: April 3, 2026</p>
        </div>

        <section className="space-y-6 text-zinc-700 dark:text-zinc-300">
          <p>
            Please read these Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) carefully before using the ResuSync application 
            (the &quot;Service&quot;) operated by VTUSync (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;).
          </p>
          <p>
            Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. 
            These Terms apply to all visitors, users, and others who access or use the Service.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">1. Accounts and Subscriptions</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Creation:</strong> You must provide accurate and complete information when registering. You are responsible for safeguarding the password that you use to access the Service.</li>
            <li><strong>Pro Subscriptions:</strong> Certain premium features require a paid subscription. Subscriptions are billed in advance on a recurring basis as selected during purchase.</li>
            <li><strong>Cancellations:</strong> You may cancel your subscription at any time. Upon cancellation, you will retain access to the paid features until the end of your current billing cycle.</li>
          </ul>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">2. Acceptable Use and Personal API Keys</h2>
          <p>
            ResuSync provides AI-tailored resume building tools. Users may choose to use our internal AI models (via Pro subscription) or supply their own API keys (e.g., Anthropic, Groq, Google Gemini) to power the application locally via the Free tier.
          </p>
          <p>
            If you provide your own API keys, you agree that you are solely responsible for compliance with the terms of service of the respective third-party provider, and you will bear all costs and liabilities associated with the use of that key. 
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">3. Intellectual Property</h2>
          <p>
            The software architecture, UI design, branding (&quot;ResuSync&quot;, &quot;VTUSync&quot;), and original content (excluding resumes created by users) are protected by copyright, trademark, and other intellectual property rights. You retain full ownership and intellectual property rights to the resumes and data you input into the Service.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">4. Limitation of Liability</h2>
          <p>
            ResuSync is provided on an &quot;AS-IS&quot; basis. In no event shall VTUSync, its directors, employees, or affiliates, 
            be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of data, 
            loss of use, or loss of job opportunities resulting from your use of or inability to use the Service.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">5. Modifications to Service</h2>
          <p>
            We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) with or without notice. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the Service.
          </p>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 pt-4">6. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
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
