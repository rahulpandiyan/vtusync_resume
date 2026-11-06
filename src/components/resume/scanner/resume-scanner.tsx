"use client";

import { useCallback, useRef, useState } from "react";
import Link from "next/link";
import {
  Upload,
  Loader2,
  AlertTriangle,
  FileCheck2,
  Link2,
  ArrowRight,
  RotateCcw,
  Briefcase,
  FileText,
  CheckCircle2,
  XCircle,
  Zap,
  Target,
  BarChart3,
  Award,
  Check,
  Plus,
  TrendingUp,
  FileSearch,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { analyzeResume, LEVELS, type ResumeAnalysis, type ResumeLevel } from "@/lib/resume-analysis";
import { analyzeJobMatch, type JobMatchResult } from "@/lib/job-match";
import { crawlJobUrl } from "@/utils/actions/jobs/crawler";
import LatticeLoader from "@/components/ui/lattice-loader";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AUDIT_STEPS = [
  "Extracting document structure & headings...",
  "Auditing ATS parsing compatibility & margins...",
  "Evaluating quantifiable metrics & action verbs...",
  "Cross-referencing technical keywords & skill density...",
  "Benchmarking against career rubric & compiling report...",
] as const;

const JOB_AUDIT_STEPS = [
  "Connecting to job portal & reading posting...",
  "Parsing position responsibilities & qualifications...",
  "Extracting required hard skills & technology stack...",
  "Cross-referencing keywords with your resume...",
] as const;

async function extractText(file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".pdf") || file.type === "application/pdf") {
    const { default: pdfToText } = await import("react-pdftotext");
    return String((await pdfToText(file)) ?? "");
  }
  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth/mammoth.browser");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return String(result.value ?? "");
  }
  throw new Error("Please upload a PDF or DOCX file.");
}

function getScoreTier(score: number) {
  if (score >= 80) {
    return {
      label: "ATS Ready",
      note: "Strong structure, keywords, and quantifiable impact.",
      badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      color: "#10b981",
      bgColor: "bg-emerald-500",
    };
  }
  if (score >= 60) {
    return {
      label: "Needs Polish",
      note: "Passable formatting, but has notable keyword or impact gaps.",
      badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      color: "#f59e0b",
      bgColor: "bg-amber-500",
    };
  }
  return {
    label: "Critical Gaps",
    note: "High probability of rejection by automated screeners.",
    badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    color: "#f43f5e",
    bgColor: "bg-rose-500",
  };
}

const ATS_PILLARS = [
  {
    icon: FileCheck2,
    title: "ATS Parsing & Hierarchy",
    desc: "Single-column layout, standard headings, and machine-readable margins.",
  },
  {
    icon: TrendingUp,
    title: "Action Verbs & Metrics",
    desc: "Checks for quantifiable impact, percentages, dollar values, and power verbs.",
  },
  {
    icon: Target,
    title: "Job-Tailored Skill Match",
    desc: "Compares your resume against any job posting URL or description in real time.",
  },
  {
    icon: Award,
    title: "Calibrated Career Rubric",
    desc: "Benchmarked word count and depth targets calibrated to your experience level.",
  },
] as const;

export function ResumeScanner() {
  const [level, setLevel] = useState<ResumeLevel>("fresher");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [auditStepIndex, setAuditStepIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);

  // Job Matching State
  const [resumeText, setResumeText] = useState<string | null>(null);
  const [jdText, setJdText] = useState("");
  const [jdUrl, setJdUrl] = useState("");
  const [crawledMeta, setCrawledMeta] = useState<{ title?: string; company?: string } | null>(null);
  const [isAnalyzingJob, setIsAnalyzingJob] = useState(false);
  const [jobStepIndex, setJobStepIndex] = useState(0);
  const [jdError, setJdError] = useState<string | null>(null);
  const [matchResult, setMatchResult] = useState<JobMatchResult | null>(null);
  const [jdMode, setJdMode] = useState<"url" | "text">("url");
  const [copiedSkill, setCopiedSkill] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const scoreSectionRef = useRef<HTMLDivElement>(null);

  const scrollToLoading = useCallback(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setTimeout(() => {
        scoreSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
    }
  }, []);

  const scrollToScore = useCallback(() => {
    setTimeout(() => {
      scoreSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }, []);

  const recomputeMatch = useCallback((text: string | null, jd: string) => {
    if (text && jd.trim()) {
      setMatchResult(analyzeJobMatch(text, jd));
    } else {
      setMatchResult(null);
    }
  }, []);

  const handleProcess = useCallback(
    async (file: File | undefined) => {
      if (!file) return;
      setError(null);
      setAnalysis(null);
      setMatchResult(null);
      setFileName(file.name);
      setFileSize(file.size);
      setIsAnalyzing(true);
      setAuditStepIndex(0);

      // On mobile, scroll directly to the live loading animation card
      scrollToLoading();

      try {
        const text = await extractText(file);
        if (!text.trim()) {
          setError("No readable text found in file. Please ensure it's not a scanned image.");
          setIsAnalyzing(false);
          return;
        }

        setResumeText(text);
        const computedAnalysis = analyzeResume(text, level);
        const computedMatch = jdText.trim() ? analyzeJobMatch(text, jdText) : null;

        // Progressive 1.7-second simulated analysis sequence
        await sleep(350);
        setAuditStepIndex(1);
        await sleep(350);
        setAuditStepIndex(2);
        await sleep(380);
        setAuditStepIndex(3);
        await sleep(380);
        setAuditStepIndex(4);
        await sleep(250);

        setAnalysis(computedAnalysis);
        setMatchResult(computedMatch);
        setIsAnalyzing(false);

        // Smoothly ensure score section stays in view
        scrollToScore();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not read that file.");
        setIsAnalyzing(false);
      }
    },
    [level, jdText, scrollToLoading, scrollToScore]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      handleProcess(e.dataTransfer.files?.[0]);
    },
    [handleProcess]
  );

  const handleCrawlJob = async () => {
    setJdError(null);
    setCrawledMeta(null);
    const url = jdUrl.trim();
    if (!url) {
      setJdError("Enter a job posting URL.");
      return;
    }

    setIsAnalyzingJob(true);
    setJobStepIndex(0);

    // On mobile, scroll directly to the live loading animation card
    scrollToLoading();

    try {
      // Step 0: Connecting
      const resPromise = crawlJobUrl(url);
      await sleep(350);
      setJobStepIndex(1); // Parsing position responsibilities

      const res = await resPromise;
      if (!res.success || !res.description) {
        throw new Error(res.error || "Could not read job text. Switch to paste tab.");
      }

      setJobStepIndex(2); // Extracting required hard skills
      await sleep(400);
      setJobStepIndex(3); // Cross-referencing keywords with resume
      await sleep(400);

      setCrawledMeta({
        title: res.position_title || "Target Role",
        company: res.company_name,
      });
      setJdText(res.description);

      if (resumeText) {
        const match = analyzeJobMatch(resumeText, res.description);
        setMatchResult(match);
        scrollToScore();
      }
    } catch (e) {
      setJdError(e instanceof Error ? e.message : "Failed to analyze job link. Switch to paste tab.");
    } finally {
      setIsAnalyzingJob(false);
    }
  };

  const handleJdTextChange = (value: string) => {
    setJdText(value);
    setJdError(null);
    if (!value.trim()) {
      setMatchResult(null);
      return;
    }
    recomputeMatch(resumeText, value);
  };

  const clearJobPosting = () => {
    setJdText("");
    setJdUrl("");
    setCrawledMeta(null);
    setJdError(null);
    setMatchResult(null);
  };

  const resetAll = () => {
    setAnalysis(null);
    setMatchResult(null);
    setResumeText(null);
    setFileName(null);
    setFileSize(0);
    setJdText("");
    setJdUrl("");
    setCrawledMeta(null);
    setJdError(null);
    setError(null);
  };

  const copySkill = (skill: string) => {
    navigator.clipboard.writeText(skill);
    setCopiedSkill(skill);
    setTimeout(() => setCopiedSkill(null), 2000);
  };

  const overall = analysis?.overall ?? 0;
  const tier = getScoreTier(overall);
  const matchScore = matchResult?.matchScore ?? 0;
  const matchTier = getScoreTier(matchScore);

  const skillsCategory = analysis?.categories.find((c) => c.key === "skills");
  const atsCategory = analysis?.categories.find((c) => c.key === "ats");

  return (
    <div className="w-full space-y-6 pb-20 lg:pb-8">
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => handleProcess(e.target.files?.[0])}
      />

      {/* Utility App Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs shrink-0">
            <FileSearch className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                ATS Scanner & Job Matcher
              </h1>
              <Badge
                variant="outline"
                className="hidden sm:inline-flex text-[10px] font-semibold text-[#3861fb] border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5"
              >
                100% Client-Side
              </Badge>
            </div>
            <p className="text-xs text-zinc-500">
              Audit your resume against ATS screeners, and optionally pair with a job posting to uncover missing keywords.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Experience Rubric Selector */}
          <div className="relative">
            <select
              value={level}
              onChange={(e) => {
                const next = e.target.value as ResumeLevel;
                setLevel(next);
                if (resumeText) setAnalysis(analyzeResume(resumeText, next));
              }}
              className="h-8 pl-3 pr-7 text-xs font-medium rounded-lg bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 shadow-2xs appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            >
              {LEVELS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>

          {analysis && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetAll}
              className="h-8 px-2.5 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-100 text-xs font-medium shadow-2xs"
              title="Reset All"
            >
              <RotateCcw className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          )}

          <Link href="/resumes" className="hidden sm:inline-block">
            <Button
              size="sm"
              className="h-8 px-3.5 rounded-lg text-xs font-semibold shadow-xs"
            >
              Open AI Editor <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Main Dual Workstation Layout (Desktop: Split Side-by-Side with Sticky Staging Dock / Mobile: Linear Stack) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Unified Input Staging Dock (Desktop Sticky Workstation) */}
        <div className="lg:col-span-5 relative">
          <div className="lg:sticky lg:top-20 space-y-4 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto no-scrollbar pb-4">
            <div className="rounded-xl p-5 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs space-y-5">
              {/* Header: Explaining the Unified Flow */}
            <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-900">
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  Audit Staging
                </span>
                <p className="text-[11px] text-zinc-500">
                  Step 1 scans formatting; Step 2 pairs with a job for keyword match.
                </p>
              </div>
              <Badge variant="outline" className="text-[10px] text-zinc-500 font-mono">
                Unified Scan
              </Badge>
            </div>

            {/* STEP 1: RESUME DOCUMENT (Required) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-colors",
                      fileName
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    )}
                  >
                    {fileName ? <Check className="w-3 h-3" /> : "1"}
                  </span>
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    Your Resume
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium">
                    (Required)
                  </span>
                </div>
                {fileName ? (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 px-2 py-0.2"
                  >
                    Uploaded
                  </Badge>
                ) : (
                  <span className="text-[10px] text-zinc-400 font-mono">PDF · DOCX</span>
                )}
              </div>

              {!fileName ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => {
                    if (!isAnalyzing) inputRef.current?.click();
                  }}
                  className={cn(
                    "rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all active:scale-[0.99]",
                    dragging
                      ? "border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900"
                      : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40"
                  )}
                >
                  {isAnalyzing ? (
                    <div className="py-4 flex flex-col items-center justify-center gap-3">
                      <LatticeLoader
                        status="working"
                        label={AUDIT_STEPS[auditStepIndex]}
                        color="#18181b"
                        fontSize={12}
                        cellSize={4.5}
                        gap={1.5}
                        showTimer={false}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 py-1">
                      <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                        Tap or drag resume here
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Evaluated locally on your machine
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200/60 dark:border-emerald-800/60">
                      <FileCheck2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {fileName}
                      </p>
                      <p className="text-[11px] text-zinc-500 tabular-nums">
                        {(fileSize / 1024).toFixed(0)} KB • {analysis?.wordCount} words
                      </p>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => inputRef.current?.click()}
                    className="h-7 px-2.5 rounded-md text-[11px] font-semibold border-zinc-200 dark:border-zinc-800 shrink-0 shadow-2xs"
                  >
                    Change
                  </Button>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 rounded-lg p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/40 text-xs text-red-600 dark:text-red-400">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            {/* PIPELINE CONNECTOR */}
            <div className="relative flex items-center justify-center py-0.5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-dashed border-zinc-200 dark:border-zinc-800" />
              </div>
              <span className="relative px-3 py-0.5 text-[10px] font-semibold text-zinc-500 bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 rounded-md flex items-center gap-1.5 shadow-2xs">
                <Plus className="w-3 h-3 text-zinc-700 dark:text-zinc-300" /> Optional Role Match
              </span>
            </div>

            {/* STEP 2: TARGET JOB DESCRIPTION (Optional Enhancer) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center transition-colors",
                      jdText.trim()
                        ? "bg-emerald-600 text-white"
                        : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                    )}
                  >
                    {jdText.trim() ? <Check className="w-3 h-3" /> : "2"}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      Target Job
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium ml-1.5">
                      (Optional)
                    </span>
                  </div>
                </div>

                <div className="inline-flex p-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-lg text-[11px] border border-zinc-200/60 dark:border-zinc-800/60">
                  <button
                    type="button"
                    onClick={() => setJdMode("url")}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1",
                      jdMode === "url"
                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    )}
                  >
                    <Link2 className="w-3 h-3" /> Link
                  </button>
                  <button
                    type="button"
                    onClick={() => setJdMode("text")}
                    className={cn(
                      "px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1",
                      jdMode === "text"
                        ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-2xs"
                        : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    )}
                  >
                    <FileText className="w-3 h-3" /> Paste
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-zinc-500 leading-snug">
                Attach a job URL or paste requirements to calculate exact role match percentage and reveal missing keywords.
              </p>

              {jdMode === "url" ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Link2 className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                      <Input
                        type="url"
                        value={jdUrl}
                        onChange={(e) => setJdUrl(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isAnalyzingJob) handleCrawlJob();
                        }}
                        placeholder="Paste link (VTU, LinkedIn, Indeed, etc.)"
                        className="pl-8 h-9 text-xs rounded-lg border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={handleCrawlJob}
                      disabled={isAnalyzingJob || !jdUrl.trim()}
                      className="h-9 px-3.5 rounded-lg text-xs font-semibold shrink-0 shadow-xs"
                    >
                      {isAnalyzingJob ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                          <span>Analyzing...</span>
                        </>
                      ) : (
                        "Fetch & Analyze"
                      )}
                    </Button>
                  </div>

                  {crawledMeta && (
                    <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate block">
                          {crawledMeta.title ?? "Target Role"} {crawledMeta.company && `• ${crawledMeta.company}`}
                        </span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" /> Job Requirements Analyzed
                          </span>
                          {matchResult && (
                            <span className="text-[10px] text-zinc-400">
                              • {matchResult.extracted.length} requirements calibrated
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={clearJobPosting}
                        className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    value={jdText}
                    onChange={(e) => handleJdTextChange(e.target.value)}
                    placeholder="Paste job requirements, required technologies, or qualifications..."
                    rows={4}
                    className="text-xs rounded-lg border-zinc-200 dark:border-zinc-800 resize-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
                  />
                  {jdText.trim() && (
                    <div className="flex justify-end">
                      <button
                        onClick={clearJobPosting}
                        className="text-[11px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 underline"
                      >
                        Clear job text
                      </button>
                    </div>
                  )}
                </div>
              )}

              {jdError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {jdError}
                </p>
              )}

              {/* Status Feedback when Job Attached */}
              {jdText.trim() && (
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    Target Job Attached
                  </span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {matchResult ? `${matchScore}% Match` : "Awaiting Resume"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

        {/* Right Column: Live Audit Inspection Workspace */}
        <div ref={scoreSectionRef} className="lg:col-span-7 space-y-5 scroll-mt-20">
          {/* Active Live Audit Stream (Shown during animated analysis sequence) */}
          {(isAnalyzing || isAnalyzingJob) ? (
            <div className="rounded-xl p-6 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs space-y-5">
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-900">
                <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shrink-0">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {isAnalyzing ? "Analyzing Resume & ATS Compatibility" : "Analyzing Job Posting Requirements"}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Running automated parsing checks and keyword calibration...
                  </p>
                </div>
              </div>

              {/* Progressive Step Sequence */}
              <div className="space-y-2.5 py-1">
                {(isAnalyzing ? AUDIT_STEPS : JOB_AUDIT_STEPS).map((step, idx) => {
                  const currentIdx = isAnalyzing ? auditStepIndex : jobStepIndex;
                  const isDone = idx < currentIdx;
                  const isCurrent = idx === currentIdx;
                  return (
                    <div
                      key={step}
                      className={cn(
                        "flex items-center gap-2.5 text-xs transition-all duration-200",
                        isDone && "text-zinc-700 dark:text-zinc-300",
                        isCurrent && "text-zinc-950 dark:text-zinc-50 font-semibold",
                        !isDone && !isCurrent && "text-zinc-400 dark:text-zinc-600 opacity-60"
                      )}
                    >
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-900 dark:text-zinc-100" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                        )}
                      </div>
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 flex justify-center border-t border-zinc-100 dark:border-zinc-900">
                <LatticeLoader
                  status="working"
                  label={isAnalyzing ? AUDIT_STEPS[auditStepIndex] : JOB_AUDIT_STEPS[jobStepIndex]}
                  color="#18181b"
                  fontSize={12}
                  cellSize={4}
                  gap={1.5}
                  showTimer={false}
                />
              </div>
            </div>
          ) : analysis ? (
            <div className="space-y-5">
              {/* Score Overview Card */}
              <div className="rounded-xl p-6 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 sm:gap-5">
                    {/* Concentric Progress Ring */}
                    <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke="currentColor"
                          strokeWidth="9"
                          className="text-zinc-100 dark:text-zinc-800"
                          fill="none"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="38"
                          stroke={tier.color}
                          strokeWidth="9"
                          strokeDasharray={2 * Math.PI * 38}
                          strokeDashoffset={2 * Math.PI * 38 * (1 - overall / 100)}
                          strokeLinecap="round"
                          className="transition-all duration-700 ease-out"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 tabular-nums">
                          {overall}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                          {tier.label}
                        </h2>
                        <Badge
                          variant="outline"
                          className={cn("text-xs font-semibold px-2 py-0.5", tier.badge)}
                        >
                          {overall} / 100
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-500 max-w-md leading-relaxed">
                        {tier.note}
                      </p>
                      <div className="pt-0.5">
                        <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md inline-block">
                          {matchResult
                            ? `Paired with target job: ${matchScore}% role alignment`
                            : "Standalone ATS audit • Add a job on the left for keyword gap analysis"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4-KPI Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-900">
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 text-center">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Words</span>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 tabular-nums">
                      {analysis.wordCount}
                    </p>
                    <span className="text-[9px] text-zinc-400">Target: 400–600</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 text-center">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">ATS Format</span>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 tabular-nums">
                      {atsCategory?.score ?? 0}%
                    </p>
                    <span className="text-[9px] text-zinc-400">Structure</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 text-center">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Keywords</span>
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 mt-0.5 tabular-nums">
                      {skillsCategory?.score ?? 0}%
                    </p>
                    <span className="text-[9px] text-zinc-400">Skill Breadth</span>
                  </div>
                  <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900/60 text-center">
                    <span className="text-[10px] text-zinc-400 font-semibold uppercase">Job Match</span>
                    <p
                      className={cn(
                        "text-sm font-bold mt-0.5 tabular-nums",
                        matchResult ? "text-[#3861fb]" : "text-zinc-400"
                      )}
                    >
                      {matchResult ? `${matchScore}%` : "Not added"}
                    </p>
                    <span className="text-[9px] text-zinc-400">
                      {matchResult ? `${matchResult.matched.length}/${matchResult.extracted.length} terms` : "Step 2"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Skill Matrix (If Target Job Added) */}
              {matchResult ? (
                <div className="rounded-xl p-5 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                        <Target className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                        Role Skill Alignment
                      </span>
                      <p className="text-[11px] text-zinc-500">
                        Tap any missing skill to copy it for your resume experience bullets.
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-semibold px-2 py-0.5 shrink-0", matchTier.badge)}
                    >
                      {matchScore}% Matched
                    </Badge>
                  </div>

                  {matchResult.missingHardSkills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Missing From Resume ({matchResult.missingHardSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchResult.missingHardSkills.map((s) => (
                          <button
                            key={s}
                            onClick={() => copySkill(s)}
                            className="px-2 py-1 text-xs font-medium rounded-md bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900/50 flex items-center gap-1 hover:bg-rose-100 dark:hover:bg-rose-900/60 active:scale-95 transition-all"
                            title="Click to copy keyword"
                          >
                            {copiedSkill === s ? (
                              <Check className="w-3 h-3 text-rose-600" />
                            ) : (
                              <Plus className="w-3 h-3 text-rose-500" />
                            )}
                            <span>{s}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {matchResult.matchedHardSkills.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Already Covered in Resume ({matchResult.matchedHardSkills.length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchResult.matchedHardSkills.map((s) => (
                          <span
                            key={s}
                            className="px-2 py-1 text-xs font-medium rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900/50 flex items-center gap-1"
                          >
                            <Check className="w-3 h-3 text-emerald-500" /> {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-dashed border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
                      Want job-specific missing keywords?
                    </p>
                    <p className="text-[11px] text-zinc-500">
                      Add a job link or paste requirements in Step 2 to generate your targeted skill match matrix.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setJdMode("url")}
                    className="text-xs h-8 px-3 rounded-lg border-zinc-200 dark:border-zinc-700 shrink-0 font-medium shadow-2xs"
                  >
                    Add Job Posting
                  </Button>
                </div>
              )}

              {/* Rubric Category Breakdown */}
              <div className="rounded-xl p-5 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs space-y-3.5">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                  Audit Breakdown by Rubric
                </span>

                <div className="space-y-3 divide-y divide-zinc-100 dark:divide-zinc-900">
                  {analysis.categories.map((cat) => {
                    const catTier = getScoreTier(cat.score);
                    return (
                      <div key={cat.key} className="pt-2.5 first:pt-0 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{cat.label}</span>
                          <span className="font-bold tabular-nums text-zinc-900 dark:text-zinc-100">{cat.score}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={cn("h-full rounded-full transition-all duration-500", catTier.bgColor)}
                            style={{ width: `${cat.score}%` }}
                          />
                        </div>
                        {cat.tips[0] && (
                          <p className="text-[11px] text-zinc-500 leading-tight">
                            {cat.tips[0]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ATS Screener Cautions */}
              {analysis.atsFlags.length > 0 && (
                <div className="rounded-xl p-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 space-y-2">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    ATS Formatting Cautions ({analysis.atsFlags.length})
                  </span>
                  <ul className="space-y-1 text-xs text-amber-900/90 dark:text-amber-200/90">
                    {analysis.atsFlags.map((flag, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Direct Priority Recommendations */}
              {analysis.improvements.length > 0 && (
                <div className="rounded-xl p-5 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs space-y-3">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-zinc-900 dark:text-zinc-100" />
                    Recommended Improvements
                  </span>
                  <ol className="space-y-2">
                    {analysis.improvements.slice(0, 3).map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-400">
                        <span className="w-4 h-4 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{imp}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ) : (
            /* Empty State: High-craft Desktop Workstation Preview */
            <div className="space-y-5">
              <div className="rounded-xl p-6 bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xs space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 flex items-center justify-center shrink-0">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      Unified ATS & Job Match Audit
                    </h3>
                    <p className="text-xs text-zinc-500">
                      Standard enterprise ATS parsing rules paired with real-time job requirement alignment.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {ATS_PILLARS.map((p) => {
                    const Icon = p.icon;
                    return (
                      <div
                        key={p.title}
                        className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200/60 dark:border-zinc-800/60 space-y-1"
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                          <h4 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                            {p.title}
                          </h4>
                        </div>
                        <p className="text-[11px] text-zinc-500 leading-snug">{p.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sample Preview Card */}
              <div className="rounded-xl p-5 bg-zinc-50/70 dark:bg-zinc-900/30 border border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Ready to audit your resume?
                  </p>
                  <p className="text-[11px] text-zinc-500 max-w-sm">
                    Upload your PDF or DOCX file on the left. The scanner evaluates formatting, keywords, metrics, and role alignment in under 2 seconds.
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  className="h-9 px-4 rounded-lg text-xs font-semibold shrink-0 shadow-xs"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Resume
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Pill for Mobile Screens */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200/80 dark:border-zinc-800/80 backdrop-blur-md z-40 lg:hidden">
        <Link href="/resumes" className="block w-full">
          <Button className="w-full h-10 rounded-lg text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 active:scale-[0.98]">
            <span>{analysis ? "Fix & Tailor in AI Editor" : "Create Tailored Resume"}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
