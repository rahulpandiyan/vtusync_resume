"use client";

import { Check, ShieldAlert, CheckCircle2, Cpu, Key, Layers, FileCheck, GitBranch } from "lucide-react";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";

export default function FeatureHighlights() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="features">
      
      {/* Section Header */}
      <div className="max-w-3xl mb-14 space-y-3.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
          <Layers className="w-3.5 h-3.5" />
          <span>ATS ENGINE SPECIFICATIONS</span>
        </div>
        
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.12]">
          Engineered to pass every ATS parser on the planet.
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal leading-relaxed">
          Over 75% of qualified tech applicants are filtered out before human review. ResuSync eliminates parsing bottlenecks with single-column geometry and algorithmic keyword calibration.
        </p>
      </div>

      {/* Bento Grid: Clean, quiet, and subtle */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Bento 1: Multi-Column Flaw vs Single-Column Linear Architecture (7 cols) */}
        <div className="md:col-span-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Architecture 01 · ATS Parser Geometry</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
                100% Parsing Accuracy
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Single-column linear parsing vs. two-column failure.
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              When Workday and Greenhouse read multi-column or Canva templates, they parse horizontally across columns — mixing your company names with skills from the sidebar. ResuSync strictly outputs linear UTF-8 text with zero token collision.
            </p>
          </div>

          {/* Visual Parser Anatomy */}
          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 grid sm:grid-cols-2 gap-4">
            
            {/* Canva / Graphic template flaw */}
            <div className="p-3.5 rounded-xl bg-red-50/40 dark:bg-red-950/20 border border-red-200/70 dark:border-red-900/40 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 dark:text-red-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Two-Column Templates (Canva)</span>
              </div>
              <div className="font-mono text-xs text-red-700/90 dark:text-red-300/90 p-2 rounded-lg bg-white dark:bg-zinc-950 border border-red-200/80 dark:border-red-900/30">
                <span className="text-zinc-400">Scanner output: </span>
                <span>&quot;Senior Python Eng 4/5 stars AWS 2022 Stripe Seattle&quot;</span>
              </div>
              <p className="text-[11px] text-zinc-500">Result: Unparseable tokens; resume auto-rejected.</p>
            </div>

            {/* ResuSync Single-Column Engineered */}
            <div className="p-3.5 rounded-xl bg-blue-50/40 dark:bg-blue-950/20 border border-blue-200/80 dark:border-blue-800/60 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>ResuSync Linear Format</span>
              </div>
              <div className="font-mono text-xs text-blue-800 dark:text-blue-200 p-2 rounded-lg bg-white dark:bg-zinc-950 border border-blue-200 dark:border-blue-800/60">
                <span className="text-zinc-400">Clean AST: </span>
                <span>{`{ role: "Senior Backend Eng", metrics: "8500 RPS" }`}</span>
              </div>
              <p className="text-[11px] text-zinc-500">Result: 100% token extraction & interview qualification.</p>
            </div>

          </div>
        </div>

        {/* Bento 2: Semantic Requisition Alignment (5 cols) */}
        <div className="md:col-span-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-600" />
              <span>System 02 · Job Alignment</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Semantic alignment with the job requisition.
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Paste the job posting. The engine identifies exact frameworks, architectures, and metrics sought by the team and weaves them into your real experience without unnatural keyword stuffing.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-200/80 dark:border-zinc-800">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Requisition Criteria</span>
              <span className="text-blue-600 dark:text-blue-400 font-bold">Match Rate</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-700 dark:text-zinc-300">Distributed Microservices</span>
              <span className="text-blue-600 font-bold">100% Match</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-700 dark:text-zinc-300">PostgreSQL Index Optimization</span>
              <span className="text-blue-600 font-bold">96% Match</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-zinc-700 dark:text-zinc-300">Automated Canary Deployments</span>
              <span className="text-blue-600 font-bold">100% Match</span>
            </div>
          </div>
        </div>

        {/* Bento 3: Branching Profile Architecture (5 cols) */}
        <div className="md:col-span-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-3.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-600" />
              <span>System 03 · Career Branching</span>
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              One master profile. Infinite tailored branches.
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Maintain one master record of every project and achievement. ResuSync branches and prunes your resume dynamically for each role you apply for.
            </p>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 font-mono text-xs space-y-2">
            <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100 font-semibold">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <span>main / master_profile.json</span>
            </div>
            <div className="pl-4 space-y-1 text-zinc-500 dark:text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 ml-1">
              <div className="flex items-center justify-between">
                <span>├── stripe-fullstack.pdf</span>
                <span className="text-blue-600 font-semibold">96%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>└── google-ai-eng.pdf</span>
                <span className="text-blue-600 font-semibold">98%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bento 4: BYO API Keys & Privacy Vault (7 cols) */}
        <div className="md:col-span-7 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/90 p-6 sm:p-8 flex flex-col justify-between shadow-sm transition-all hover:border-zinc-300 dark:hover:border-zinc-700">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
                <Key className="w-4 h-4 text-blue-600" />
                <span>System 04 · Privacy & Sovereignty</span>
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                Zero Lock-In
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
              Bring your own keys. Free forever for developers.
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We never hold your career data hostage. Plug in your personal API key from Anthropic, OpenAI, or Google to generate unlimited tailored resumes for ₹0 platform charges, or upgrade to Pro for hosted inference.
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-100 dark:border-zinc-800 grid sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 text-xs space-y-1">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>BYO Key Support</span>
              </div>
              <p className="text-zinc-500 text-[11px]">Claude 3.5, GPT-4o, Gemini</p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 text-xs space-y-1">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Clean PDF Exports</span>
              </div>
              <p className="text-zinc-500 text-[11px]">No watermarks, no forced upgrades</p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-950 border border-zinc-200/70 dark:border-zinc-800 text-xs space-y-1">
              <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-blue-600" />
                <span>Private Supabase</span>
              </div>
              <p className="text-zinc-500 text-[11px]">Never used to train public models</p>
            </div>
          </div>
        </div>

      </div>

      {/* Callout Banner with subtle button */}
      <div className="mt-16 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 p-8 sm:p-12 text-center relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-zinc-50 tracking-tight">
            Stop losing interviews to unreadable templates.
          </h3>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 font-normal">
            Build your ATS-calibrated resume in under 10 minutes. 100% free with your own API key.
          </p>
          <div className="pt-2">
            <AuthDialog>
              <Button size="lg" className="h-12 px-7 text-sm sm:text-base font-semibold">
                <span>Start Calibrating Free</span>
              </Button>
            </AuthDialog>
          </div>
        </div>
      </div>

    </section>
  );
}
