'use client';

import Image from 'next/image';
import { cn } from "@/lib/utils";
import {
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Wrench,
  LayoutTemplate,
  Award,
  FileText,
  Check,
  Circle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import type { Resume } from "@/lib/types";
import { useEditorSection } from "../section-context";
import type { EditorSection } from "../header/resume-editor-tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SyncAIIcon = (
  <span className="relative flex h-4 w-4 items-center justify-center overflow-hidden rounded-full border border-zinc-200/80 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800">
    <Image src="/favicon-16x16.png" alt="" width={16} height={16} className="h-full w-full object-cover scale-110" aria-hidden="true" />
  </span>
);

const SECTIONS: { value: EditorSection; label: string; icon: React.ReactNode }[] = [
  { value: "basic", label: "Contact Info", icon: <User className="h-4 w-4" /> },
  { value: "work", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
  { value: "projects", label: "Projects", icon: <FolderGit2 className="h-4 w-4" /> },
  { value: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
  { value: "skills", label: "Skills", icon: <Wrench className="h-4 w-4" /> },
  { value: "settings", label: "Formatting", icon: <LayoutTemplate className="h-4 w-4" /> },
  { value: "resume-score", label: "ATS Score", icon: <Award className="h-4 w-4 text-amber-500" /> },
  { value: "cover-letter", label: "Cover Letter", icon: <FileText className="h-4 w-4" /> },
  { value: "synkai", label: "SyncAI Copilot", icon: SyncAIIcon },
];

function sectionComplete(resume: Resume, key: EditorSection): boolean {
  switch (key) {
    case 'basic': return Boolean(resume.first_name && resume.last_name && resume.email);
    case 'work': return resume.work_experience.length > 0 && resume.work_experience.some(e => e.description?.some(d => d?.trim()));
    case 'projects': return resume.projects.length > 0 && resume.projects.some(p => p.description?.some(d => d?.trim()));
    case 'education': return resume.education.length > 0;
    case 'skills': return resume.skills.length > 0 && resume.skills.some(s => s.items.length > 0);
    case 'settings': return true;
    case 'resume-score': return true;
    case 'cover-letter': return Boolean(resume.has_cover_letter);
    case 'synkai': return true;
    default: return false;
  }
}

interface EditorRailProps {
  resume: Resume;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

/** Section rail for the framed resume editor window. Completion is honest (from data). */
export function EditorRail({ 
  resume, 
  isCollapsed = false, 
  onToggleCollapse 
}: EditorRailProps) {
  const { section: active, setSection } = useEditorSection();
  const completed = SECTIONS.filter(s => sectionComplete(resume, s.value)).length;
  const pct = Math.round((completed / SECTIONS.length) * 100);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex h-full flex-col justify-between p-2">
        {/* Top / Main Navigation */}
        <div className="space-y-3">
          {/* Rail Header */}
          <div className={cn(
            "flex items-center pb-1 pt-1",
            isCollapsed ? "justify-center" : "justify-between px-2"
          )}>
            {!isCollapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-400 dark:text-zinc-500">
                Sections
              </p>
            )}
            {onToggleCollapse && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={onToggleCollapse}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 hover:bg-zinc-200/60 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                  >
                    {isCollapsed ? (
                      <PanelLeftOpen className="h-4 w-4" />
                    ) : (
                      <PanelLeftClose className="h-4 w-4" />
                    )}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          {/* Section Items */}
          <nav className="flex flex-col gap-1" aria-label="Resume sections">
            {SECTIONS.map(({ value, label, icon }) => {
              const done = sectionComplete(resume, value);
              const isActive = active === value;

              if (isCollapsed) {
                return (
                  <Tooltip key={value}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setSection(value)}
                        aria-current={isActive ? 'page' : undefined}
                        className={cn(
                          "relative flex h-9 w-9 mx-auto items-center justify-center rounded-lg transition-all",
                          isActive
                            ? "bg-zinc-900 text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                            : "text-zinc-600 hover:bg-zinc-200/50 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                        )}
                      >
                        <span className="shrink-0">{icon}</span>
                        {done && (
                          <span className={cn(
                            "absolute top-1 right-1 h-1.5 w-1.5 rounded-full",
                            isActive ? "bg-emerald-400" : "bg-emerald-600 dark:bg-emerald-500"
                          )} />
                        )}
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <div className="flex items-center gap-1.5">
                        <span>{label}</span>
                        {done && <Check className="h-3 w-3 text-emerald-500" />}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              }

              return (
                <button
                  key={value}
                  onClick={() => setSection(value)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs transition-colors",
                    isActive
                      ? "bg-zinc-900 font-medium text-white shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-200/60 dark:text-zinc-400 dark:hover:bg-zinc-800/50"
                  )}
                >
                  <span className={cn("shrink-0", value !== 'synkai' && !isActive && "opacity-75")}>
                    {icon}
                  </span>
                  <span className="flex-1 truncate">{label}</span>
                  {done ? (
                    <Check className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-emerald-400 dark:text-emerald-600" : "text-emerald-600 dark:text-emerald-500")} />
                  ) : (
                    <Circle className={cn("h-1.5 w-1.5 shrink-0", isActive ? "text-white/40" : "text-zinc-300 dark:text-zinc-700")} fill="currentColor" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Completion Progress Card */}
        {!isCollapsed && (
          <div className="rounded-xl border border-zinc-200/80 bg-white/70 p-3 dark:border-zinc-800 dark:bg-zinc-900/60">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Progress</span>
              <span className="text-[11px] font-semibold tabular-nums text-zinc-700 dark:text-zinc-300">{completed}/{SECTIONS.length} done</span>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
