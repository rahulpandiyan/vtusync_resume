"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, CheckCircle2, Copy, CheckCheck, FileText, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import RotatingText from "@/components/RotatingText";
import ShinyText from "@/components/ShinyText";
import DecryptedText from "@/components/DecryptedText";

interface DemoRole {
  id: string;
  title: string;
  companyTarget: string;
  score: number;
  skills: string[];
  weakBullet: string;
  optimizedBullet: string;
  impactMetrics: string;
  matchedTokens: string[];
}

const DEMO_ROLES: DemoRole[] = [
  {
    id: "fullstack",
    title: "Senior Full-Stack Engineer",
    companyTarget: "Target: Stripe & Tier-1 Fintech",
    score: 96,
    skills: ["TypeScript", "Next.js", "PostgreSQL", "Kafka", "Redis"],
    weakBullet: "Responsible for improving database queries and helped team speed up API responses.",
    optimizedBullet: "Architected distributed Redis caching and optimized PostgreSQL indexing across 14 microservices, reducing p99 API latency from 480ms to 62ms under 8,500 RPS peak traffic.",
    impactMetrics: "87% latency reduction · Verified with Greenhouse ATS parser",
    matchedTokens: ["p99 Latency", "PostgreSQL Indexing", "Redis Caching", "8,500 RPS"],
  },
  {
    id: "aiml",
    title: "AI & ML Engineer",
    companyTarget: "Target: OpenAI & High-Growth AI Labs",
    score: 98,
    skills: ["Python", "PyTorch", "vLLM", "CUDA", "FastAPI"],
    weakBullet: "Trained machine learning models and deployed them to cloud servers for users.",
    optimizedBullet: "Fine-tuned Llama-3 70B via LoRA with custom flash-attention kernels, scaling multi-GPU inference throughput by 3.4x while trimming GPU memory utilization by 42%.",
    impactMetrics: "3.4x throughput scale · 100% semantic match for LLM roles",
    matchedTokens: ["FlashAttention", "LoRA Fine-tuning", "vLLM", "Inference Throughput"],
  },
  {
    id: "devops",
    title: "Cloud & Platform Engineer",
    companyTarget: "Target: AWS & Cloud Infrastructure",
    score: 94,
    skills: ["Kubernetes", "Terraform", "AWS EKS", "CI/CD", "Go"],
    weakBullet: "Managed Kubernetes clusters and set up GitHub Actions pipelines for deployments.",
    optimizedBullet: "Provisioned multi-region AWS EKS clusters via modular Terraform IaC with automated zero-downtime Canary deployments, driving 99.99% service availability across 6 global regions.",
    impactMetrics: "Zero downtime deployments · Passed Workday ATS filter",
    matchedTokens: ["Canary Deployments", "Terraform IaC", "AWS EKS", "99.99% SLA"],
  },
];

const ATS_PLATFORMS = [
  { name: "Workday", tag: "Enterprise" },
  { name: "Greenhouse", tag: "Tech Leaders" },
  { name: "Lever", tag: "Fast Growth" },
  { name: "Ashby", tag: "Modern ATS" },
  { name: "Taleo", tag: "Fortune 500" },
];

export function Hero() {
  const [activeRole, setActiveRole] = useState<DemoRole>(DEMO_ROLES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeRole.optimizedBullet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-24 pb-14 md:pt-36 md:pb-24 px-4 sm:px-6 max-w-6xl mx-auto">
      
      {/* Subtle Release Pill with ShinyText */}
      <div className="flex justify-center mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-200 border border-zinc-200/70 dark:border-zinc-700/60 backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#3861fb] animate-pulse" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">ResuSync v2.4</span>
          <span className="text-zinc-300 dark:text-zinc-700">|</span>
          <ShinyText
            text="Single-Column ATS Engine"
            speed={3}
            color="#27272a"
            shineColor="#3861fb"
            className="font-medium text-zinc-700 dark:text-zinc-300"
          />
          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
        </div>
      </div>

      {/* Core Typography: With Gen-Z Kinetic RotatingText */}
      <div className="max-w-4xl mx-auto text-center space-y-5 sm:space-y-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.18] sm:leading-[1.12]">
          The AI resume builder that lands{" "}
          <span className="inline-block text-[#3861fb]">
            <RotatingText
              texts={["tech interviews.", "top callbacks.", "FAANG offers.", "dream jobs."]}
              mainClassName="inline-flex overflow-hidden py-0.5"
              staggerFrom="last"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={2800}
            />
          </span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Calibrate your bullet points to match job descriptions word-for-word. Pass automated ATS filters at Google, Stripe, and high-growth startups in under 10 minutes.
        </p>

        {/* Clean, beautifully proportioned Hero CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2 sm:pt-3">
          <AuthDialog>
            <Button 
              size="lg" 
              className="h-12 px-7 text-sm sm:text-base font-semibold group cursor-pointer w-full sm:w-auto"
            >
              <span>Build My Resume Free</span>
            </Button>
          </AuthDialog>
          
          <Link href="/resume-scanner" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="h-12 px-7 text-sm sm:text-base font-semibold cursor-pointer w-full sm:w-auto"
            >
              <span>Check My Resume Score</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Modern ATS Platform Badges */}
      <div className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-zinc-200/60 dark:border-zinc-800/60 max-w-4xl mx-auto">
        <p className="text-center text-xs sm:text-sm font-semibold text-zinc-600 dark:text-zinc-400 mb-3 sm:mb-4">
          Verified for 99.4% parsing success across enterprise systems
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {ATS_PLATFORMS.map((platform) => (
            <div 
              key={platform.name}
              className="px-3 py-1.5 rounded-full bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/50 text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>{platform.name}</span>
              <span className="text-[11px] text-zinc-400">({platform.tag})</span>
            </div>
          ))}
        </div>
      </div>

      {/* The Live Thing: Modern Responsive Candidate Calibration Studio */}
      <div className="mt-12 sm:mt-16">
        <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden transition-all">
          
          {/* Studio Top Navigation: Cleanly stacks on mobile */}
          <div className="px-4 sm:px-5 py-3 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center justify-between sm:justify-start gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              </div>
              <div className="flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400">
                <FileText className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                <span>Candidate Calibration Studio</span>
              </div>
            </div>

            {/* Role Switcher: Responsive, perfectly fits mobile without horizontal overflow */}
            <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl sm:rounded-full w-full sm:w-auto">
              {DEMO_ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role)}
                  className={cn(
                    "flex-1 sm:flex-initial text-center px-2.5 sm:px-3.5 py-1.5 sm:py-1 rounded-lg sm:rounded-full text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer",
                    activeRole.id === role.id
                      ? "bg-white dark:bg-zinc-900 text-zinc-950 dark:text-white shadow-sm font-semibold"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white"
                  )}
                >
                  {role.id === "fullstack" ? "Full-Stack" : role.id === "aiml" ? "AI & ML" : "DevOps"}
                </button>
              ))}
            </div>
          </div>

          {/* Studio Body: Real Subject Matter Content */}
          <div className="p-4 sm:p-6 md:p-8 grid md:grid-cols-12 gap-6 md:gap-8 items-start">
            
            {/* Left Column: ATS Score Gauge & Keywords */}
            <div className="md:col-span-5 space-y-5 sm:space-y-6">
              
              {/* Radial Score Gauge Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-zinc-50/80 dark:bg-zinc-950/40 border border-zinc-200/80 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                    ATS Match Analysis
                  </span>
                  <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800 flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Passing Filter
                  </span>
                </div>
                
                <div className="flex items-center gap-3.5 sm:gap-5">
                  {/* SVG Circular Ring Gauge */}
                  <div className="relative w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 36 36">
                      <path
                        className="text-zinc-200 dark:text-zinc-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-blue-600 transition-all duration-700 ease-out"
                        strokeDasharray={`${activeRole.score}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg sm:text-xl font-extrabold text-zinc-950 dark:text-zinc-50">{activeRole.score}</span>
                      <span className="text-[9px] text-zinc-500 font-semibold uppercase">score</span>
                    </div>
                  </div>

                  <div className="space-y-0.5 min-w-0">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                      <DecryptedText
                        key={activeRole.id}
                        text={activeRole.title}
                        speed={45}
                        maxIterations={12}
                        animateOn="view"
                        className="text-sm font-bold text-zinc-900 dark:text-zinc-100"
                        encryptedClassName="text-[#3861fb] font-mono font-medium"
                      />
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 truncate">
                      {activeRole.companyTarget}
                    </p>
                    <div className="pt-0.5 flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                      <span>✓ Single-column hierarchy verified</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detected Core Competencies */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Job Keywords Detected
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {activeRole.skills.map((skill) => (
                    <span 
                      key={skill}
                      className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/50 flex items-center gap-1"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                      <span>{skill}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* STAR Framework Transformation Note */}
              <div className="p-3.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-xs sm:text-sm space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>STAR Framework & Quantified Metrics</span>
                </div>
                <p className="text-amber-800/90 dark:text-amber-300/90 leading-relaxed text-xs">
                  {activeRole.impactMetrics}
                </p>
              </div>
            </div>

            {/* Right Column: Live Before vs After Transformation */}
            <div className="md:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-800 gap-2">
                <span className="text-xs sm:text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                  Live Bullet Calibration Diff
                </span>
                <span className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400 font-medium truncate">
                  {activeRole.companyTarget.replace("Target: ", "")}
                </span>
              </div>

              {/* Before: Raw Candidate Draft (No mobile overlap) */}
              <div className="p-3.5 sm:p-4 rounded-xl border border-red-200/80 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/20 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                    <span>Draft (Failed ATS Screen)</span>
                  </span>
                  <span className="self-start sm:self-auto text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 font-medium">
                    Missing Action Verbs & Metrics
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed line-through decoration-red-400/60">
                  {activeRole.weakBullet}
                </p>
              </div>

              {/* After: Calibrated Bullet Point (No mobile overlap) */}
              <div className="p-3.5 sm:p-5 rounded-xl border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 space-y-3 relative group">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5 min-w-0">
                    <Check className="w-4 h-4 stroke-[3] shrink-0" />
                    <span className="truncate">ResuSync Calibrated (Passes ATS)</span>
                  </span>
                  
                  {/* Subtle, clean Copy Button */}
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 sm:px-3 py-1 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
                  >
                    {copied ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-white" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed">
                  {activeRole.optimizedBullet}
                </p>

                {/* Injected Hard Skills Highlights */}
                <div className="pt-2 border-t border-blue-200/60 dark:border-blue-900/40 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] sm:text-xs text-blue-800 dark:text-blue-300 font-semibold">Matched:</span>
                  {activeRole.matchedTokens.map((kw) => (
                    <span 
                      key={kw}
                      className="px-2 py-0.5 rounded-full bg-white dark:bg-zinc-900 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold text-blue-700 dark:text-blue-300"
                    >
                      +{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Diff Footer: Cleanly stacks on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pt-1 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                <span>Single-column format: 100% UTF-8 layer</span>
                <span>Calibrated in 4.2 seconds</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
