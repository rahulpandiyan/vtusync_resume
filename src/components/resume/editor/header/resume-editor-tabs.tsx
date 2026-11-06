'use client';

import type { ReactNode } from 'react';
import Image from 'next/image';
import {
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  LayoutTemplate,
  Award,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { useEditorSection } from "../section-context";

export type EditorSection = 'basic' | 'work' | 'projects' | 'education' | 'skills' | 'settings' | 'resume-score' | 'cover-letter' | 'synkai';

interface SectionDef {
  value: EditorSection;
  label: string;
  icon: ReactNode;
  amber?: boolean;
}

const SyncAIIcon = (
  <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-zinc-200/80 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
    <Image
      src="/favicon-16x16.png"
      alt=""
      width={16}
      height={16}
      className="h-full w-full object-cover scale-110"
      aria-hidden="true"
    />
  </span>
);

const SECTIONS: SectionDef[] = [
  { value: "basic", label: "Info", icon: <User className="h-4 w-4" /> },
  { value: "work", label: "Work", icon: <Briefcase className="h-4 w-4" /> },
  { value: "projects", label: "Projects", icon: <FolderGit2 className="h-4 w-4" /> },
  { value: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { value: "skills", label: "Skills", icon: <Wrench className="h-4 w-4" /> },
  { value: "settings", label: "Layout", icon: <LayoutTemplate className="h-4 w-4" /> },
  { value: "resume-score", label: "Score", icon: <Award className="h-4 w-4 text-amber-500" /> },
  { value: "cover-letter", label: "Letter", icon: <FileText className="h-4 w-4" /> },
  { value: "synkai", label: "SyncAI", icon: SyncAIIcon },
];

interface ResumeEditorTabsProps {
  value: EditorSection;
  onValueChange: (section: EditorSection) => void;
  variant?: 'rail' | 'tabs';
}

export function ResumeEditorTabs({ value, onValueChange, variant = 'tabs' }: ResumeEditorTabsProps) {
  const { setIsSyncAiOpen, setIsScoreOpen } = useEditorSection();

  const handleTabClick = (v: EditorSection) => {
    if (v === 'synkai') {
      setIsSyncAiOpen(true);
      return;
    }
    if (v === 'resume-score') {
      setIsScoreOpen(true);
      return;
    }
    onValueChange(v);
  };

  if (variant === 'tabs') {
    return (
      <div className="w-full">
        <div
          role="tablist"
          className="flex h-auto w-full gap-1 overflow-x-auto rounded-xl border border-zinc-200/80 bg-zinc-100/80 p-1 no-scrollbar dark:border-zinc-800 dark:bg-zinc-900"
        >
          {SECTIONS.map(({ value: v, label, icon }) => {
            const active = value === v;
            return (
              <button
                key={v}
                role="tab"
                aria-selected={active}
                onClick={() => handleTabClick(v)}
                className={cn(
                  "group flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all select-none",
                  active
                    ? "bg-zinc-900 text-white shadow-xs dark:bg-zinc-100 dark:text-zinc-900"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-white/60 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60"
                )}
              >
                <span className={cn("shrink-0", !active && "opacity-75")}>{icon}</span>
                <span>{label}</span>
                {v === 'synkai' && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-[#3861fb]/15 text-[#3861fb] font-bold">
                    AI
                  </span>
                )}
                {v === 'resume-score' && (
                  <span className="text-[9px] px-1 py-0.2 rounded-full bg-amber-500/15 text-amber-600 font-bold">
                    ATS
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <nav className="flex flex-col gap-0.5" aria-label="Resume sections">
      {SECTIONS.map(({ value: v, label, icon }) => {
        const active = value === v;
        return (
          <button
            key={v}
            onClick={() => onValueChange(v)}
            aria-current={active ? 'page' : undefined}
            className={cn(
              "flex min-h-[44px] items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
              active
                ? "bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-900"
            )}
          >
            <span className={cn("shrink-0", v === 'synkai' ? '' : !active && "opacity-70")}>{icon}</span>
            <span className="flex-1 truncate">{label}</span>
            {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-70" aria-hidden="true" />}
          </button>
        );
      })}
    </nav>
  );
}
