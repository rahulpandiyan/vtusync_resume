'use client';

import React from "react";
import { PromptBar, PromptBarCommand, PromptBarModel, PromptBarSource } from "@/components/ui/prompt-bar";
import { Briefcase01Icon, GraduationCapIcon, ChartLineData01Icon, File02Icon } from '@hugeicons/core-free-icons';

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
  onStop: () => void;
}

const RESUME_SOURCES: PromptBarSource[] = [
  { key: 'experience', name: 'Work Experience', description: 'Analyze achievements & metrics', icon: Briefcase01Icon },
  { key: 'education', name: 'Education', description: 'Degree, coursework & honors', icon: GraduationCapIcon },
  { key: 'projects', name: 'Projects', description: 'Tech stack & impact', icon: ChartLineData01Icon },
  { key: 'job_desc', name: 'Job Description', description: 'Calibrate against role requirements', icon: File02Icon },
];

const RESUME_COMMANDS: PromptBarCommand[] = [
  { key: 'critique', name: '/critique', description: 'Comprehensive ATS review & scoring' },
  { key: 'rewrite', name: '/rewrite', description: 'Elevate bullet points with impact verbs' },
  { key: 'skills', name: '/skills', description: 'Suggest missing role-relevant keywords' },
  { key: 'summary', name: '/summary', description: 'Generate high-impact executive summary' },
];

const RESUME_MODELS: PromptBarModel[] = [
  { key: 'gpt-oss', name: 'GPT-OSS 120B', tag: 'Fast' },
  { key: 'claude-3-5', name: 'Claude 3.5 Sonnet', tag: 'Accurate' },
  { key: 'gpt-4o', name: 'GPT-4o', tag: 'Pro' },
];

export default function ChatInput({ 
  isLoading, 
  onSubmit, 
  onStop 
}: ChatInputProps) {
  const handleSend = (text: string) => {
    if (text.trim()) {
      onSubmit(text.trim());
    }
  };

  return (
    <div className="p-2 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 w-full flex justify-center">
      <PromptBar
        placeholder="Ask AI Copilot to rewrite, review, or calibrate this resume... (type / for commands)"
        sources={RESUME_SOURCES}
        commands={RESUME_COMMANDS}
        models={RESUME_MODELS}
        efforts={['Fast', 'Balanced', 'Deep Think']}
        defaultEffort="Balanced"
        busy={isLoading}
        onSend={handleSend}
        onStop={onStop}
        sparkColor="#3861fb"
        width={1400}
        radius={12}
        className="w-full text-zinc-900 dark:text-zinc-100 border border-zinc-200/90 dark:border-zinc-800/90 shadow-sm rounded-xl overflow-visible [&_textarea]:text-xs [&_textarea]:leading-relaxed"
      />
    </div>
  );
}
