import { Metadata } from 'next';
import { Footer } from '@/components/layout/footer';
import { AuthDialogProvider } from '@/components/auth/auth-dialog-provider';
import { Logo } from '@/components/ui/logo';
import { NavLinks } from '@/components/layout/nav-links';
import { Background } from '@/components/landing/Background';
import { CheckCircle2, Zap, Layout, FileText, Download, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from '@/components/auth/auth-dialog';

export const metadata: Metadata = {
  title: 'How It Works | ResuSync',
  description: 'Detailed guide on how to build and tailor your resume with ResuSync AI.',
};

export default function HowItWorks() {
  const steps = [
    {
      title: "Step 1: Create a Base Profile",
      icon: Layout,
      description: "Input your personal information, work experience, education, and skills. This becomes your 'source of truth' from which all future resumes are generated.",
      details: ["One-time setup", "Include all roles and technical skills", "Upload existing resume to parse quickly"]
    },
    {
      title: "Step 2: Add a Job Description",
      icon: FileText,
      description: "Found a job you love? Paste the job title and description into ResuSync. Our AI analyzes the requirements and key qualifications sought by the employer.",
      details: ["Target specific companies", "Automatic role matching", "Identify key technical keywords"]
    },
    {
      title: "Step 3: AI Tailoring",
      icon: Zap,
      description: "Our AI aligns your base experience with the specific job description. It adjusts bullet points to emphasize relevant achievements and optimizes for ATS (Applicant Tracking Systems).",
      details: ["ATS-friendly keywords", "Achievement-focused phrasing", "Tone adjustment for specific company cultures"]
    },
    {
      title: "Step 4: Download & Apply",
      icon: Download,
      description: "Review the generated resume, make any final manual adjustments if needed, and download the PDF. You're now ready to apply with a 3x higher chance of an interview.",
      details: ["Clean, professional formatting", "Instant PDF export", "Versioning for different applications"]
    }
  ];

  return (
    <AuthDialogProvider>
      <div className="min-h-screen bg-background flex flex-col">
        {/* Unified Navigation */}
        <nav aria-label="Main navigation" className="border-b border-zinc-100 dark:border-zinc-900 fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-[1000] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14">
              <Logo />
              <NavLinks />
            </div>
          </div>
        </nav>

        {/* Background component */}
        <Background />

        <main className="flex-grow max-w-5xl mx-auto px-6 py-12 md:py-24 space-y-24 relative z-10 pt-32">
          {/* Intro */}
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              Build perfectly <br/> tailored resumes
            </h1>
            <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-medium">
              ResuSync uses state-of-the-art AI to help you land tech interviews 3x faster. 
              Here is your roadmap to a better career.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="p-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300">
                <div className="h-12 w-12 rounded-xl bg-zinc-900 dark:bg-zinc-50 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-zinc-50 dark:text-zinc-950" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {step.title}
                  </h3>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed italic">
                    {step.description}
                  </p>
                </div>
                <ul className="space-y-3 pt-2">
                  {step.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      <CheckCircle2 className="h-4 w-4 text-zinc-400" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Pro vs Free Section */}
          <div className="p-12 md:p-20 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-900 dark:bg-zinc-100 dark:text-zinc-900 text-zinc-50 space-y-12 relative overflow-hidden">
             <div className="relative z-10 text-center space-y-4 max-w-3xl mx-auto">
               <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Flexible for every stage</h2>
               <p className="text-zinc-400 dark:text-zinc-500 font-medium leading-relaxed">
                 Whether you want us to handle the AI or you want to bring your own models, we&apos;ve got you covered.
               </p>
             </div>

             <div className="grid md:grid-cols-2 gap-12 relative z-10">
                <div className="space-y-6 p-8 rounded-2xl bg-zinc-800/50 dark:bg-zinc-200/50 border border-zinc-700/50 dark:border-zinc-300/50">
                   <h4 className="text-xl font-bold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-zinc-100 dark:text-zinc-900" />
                      Pro Subscription
                   </h4>
                   <p className="text-zinc-400 dark:text-zinc-600 text-sm font-medium">
                      The easiest experience. Access our premium enterprise-grade AI models (GPT-4o, Claude 3.5 Sonnet) instantly. No setup required.
                   </p>
                </div>
                <div className="space-y-6 p-8 rounded-2xl bg-zinc-800/50 dark:bg-zinc-200/50 border border-zinc-700/50 dark:border-zinc-300/50">
                   <h4 className="text-xl font-bold flex items-center gap-2 text-zinc-100 dark:text-zinc-900">
                      <ShieldCheck className="h-5 w-5" />
                      Free (Bring Your Own Key)
                   </h4>
                   <p className="text-zinc-400 dark:text-zinc-600 text-sm font-medium">
                      Complete data privacy and zero cost. Supply your own Anthropic or Groq keys and the app functions entirely on your personal infrastructure.
                   </p>
                </div>
             </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-8 py-12">
             <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Stop wasting time tailoring manually</h2>
             <AuthDialog>
                <Button size="lg" className="h-12 px-12 text-sm font-semibold tracking-tight">
                  Land Your Dream Interview
                </Button>
             </AuthDialog>
          </div>
        </main>

        <Footer />
      </div>
    </AuthDialogProvider>
  );
}
