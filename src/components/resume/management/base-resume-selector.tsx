'use client';

import { cn } from "@/lib/utils";
import { ResumeSummary } from "@/lib/types";
import { MiniResumePreview } from "../shared/mini-resume-preview";
import { Check, FileText } from "lucide-react";

interface BaseResumeSelectorProps {
  baseResumes: ResumeSummary[];
  selectedResumeId: string;
  onResumeSelect: (value: string) => void;
  isInvalid?: boolean;
}

export function BaseResumeSelector({ 
  baseResumes,
  selectedResumeId,
  onResumeSelect,
  isInvalid 
}: BaseResumeSelectorProps) {
  return (
    <div className={cn(
      "space-y-3",
      isInvalid && "animate-pulse"
    )}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {baseResumes?.map((resume) => {
          const isSelected = selectedResumeId === resume.id;
          
          return (
            <div
              key={resume.id}
              onClick={() => onResumeSelect(resume.id)}
              className={cn(
                "relative cursor-pointer group transition-all duration-200",
                "border rounded-xl p-3.5 bg-white dark:bg-zinc-900",
                isSelected 
                  ? "border-[#3861fb] ring-2 ring-[#3861fb]/20 shadow-md bg-[#3861fb]/[0.02]" 
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm",
                isInvalid && !isSelected && "border-red-300 bg-red-50/30"
              )}
            >
              {/* Selection indicator */}
              <div className={cn(
                "absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center transition-all duration-200",
                isSelected 
                  ? "bg-[#3861fb] text-white scale-100 shadow-sm" 
                  : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 scale-0 group-hover:scale-100"
              )}>
                <Check className="w-3 h-3 stroke-[3]" />
              </div>

              {/* Resume preview */}
              <div className="mb-2.5">
                <MiniResumePreview
                  name={resume.name}
                  type="base"
                  createdAt={resume.created_at}
                  className="w-full h-28"
                />
              </div>

              {/* Resume details */}
              <div className="space-y-1.5">
                <div className="flex items-start gap-2">
                  <FileText className="w-3.5 h-3.5 text-zinc-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <h3 className={cn(
                      "font-semibold text-xs truncate",
                      isSelected ? "text-[#3861fb] dark:text-[#3861fb]" : "text-zinc-900 dark:text-zinc-100"
                    )}>
                      {resume.name}
                    </h3>
                    {resume.target_role && (
                      <p className="text-[11px] truncate text-zinc-500 dark:text-zinc-400">
                        {resume.target_role}
                      </p>
                    )}
                  </div>
                </div>

                {/* Creation date */}
                <div className="text-[10px] text-zinc-400">
                  Created {new Date(resume.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error message */}
      {isInvalid && (
        <div className="text-xs text-red-600 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 rounded-lg p-2.5 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-bold">!</span>
          </div>
          <span>Please select a base resume to proceed</span>
        </div>
      )}
    </div>
  );
}
