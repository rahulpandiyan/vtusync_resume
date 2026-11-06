'use client';

import React from "react";
import { Star, Briefcase, FileSearch, Target } from "lucide-react";

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  targetRole?: string;
}

const SHORTCUTS = [
  { label: "/critique", prompt: "Perform a comprehensive ATS critique and score my resume." },
  { label: "/rewrite", prompt: "Rewrite my work experience bullets with high-impact action verbs and quantified metrics." },
  { label: "/skills", prompt: "Analyze my skills and suggest high-value missing keywords for this target role." },
  { label: "/summary", prompt: "Draft a concise, executive summary calibrated for my target role." },
];

const SUGGESTIONS = [
  {
    title: "ATS Compliance Critique",
    description: "Scan formatting, bullet density, and role keyword match for ATS screener pass-rate.",
    prompt: "Critique my resume for ATS compliance and rate it out of 10 with clear recommendations.",
    icon: FileSearch,
  },
  {
    title: "Elevate Bullet Points",
    description: "Transform passive duties into metric-driven achievements with strong action verbs.",
    prompt: "Improve my work experience bullet points by opening with impact verbs and adding metrics.",
    icon: Briefcase,
  },
  {
    title: "Role Keyword Calibration",
    description: "Detect missing industry skills and match against recruiter screeners.",
    prompt: "Analyze my resume skills and suggest high-value missing keywords for this target role.",
    icon: Target,
  },
  {
    title: "Executive Summary",
    description: "Draft a high-impact summary statement tailored to your career milestones.",
    prompt: "Generate a compelling 3-line executive summary calibrated for my target role.",
    icon: Star,
  },
];

export function QuickSuggestions({ onSuggestionClick, targetRole }: QuickSuggestionsProps) {
  return (
    <div className="flex min-h-full w-full flex-col items-center justify-center px-4 py-6 text-center max-w-2xl mx-auto">
      <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
        How can I help you?
      </h3>
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md">
        {targetRole
          ? `Calibrated for ${targetRole}. Pick a shortcut or type your own question.`
          : "Ask me to score, rewrite, or calibrate your resume for any role."}
      </p>

      {/* Shortcuts moved here */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
        {SHORTCUTS.map((cmd) => (
          <button
            key={cmd.label}
            type="button"
            onClick={() => onSuggestionClick(cmd.prompt)}
            className="text-[11px] font-mono font-medium px-2.5 py-1.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-[#3861fb] hover:border-[#3861fb]/40 transition-colors"
          >
            {cmd.label}
          </button>
        ))}
      </div>

      {/* Suggestion cards — hidden on phones, shown on larger screens */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-5 text-left">
        {SUGGESTIONS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              type="button"
              onClick={() => onSuggestionClick(item.prompt)}
              className="flex items-start gap-3 p-3 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-[#3861fb]/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 transition-all group text-left"
            >
              <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-500 group-hover:bg-[#3861fb]/10 group-hover:text-[#3861fb] transition-colors shrink-0 mt-0.5">
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-[#3861fb] transition-colors">
                  {item.title}
                </p>
                <p className="text-[11px] leading-relaxed text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
