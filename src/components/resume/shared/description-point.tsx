'use client';

import Tiptap from "@/components/ui/tiptap";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, Trash2, Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { AIImprovementPrompt } from "./ai-improvement-prompt";

interface DescriptionPointProps {
  value: string;
  onChange: (value: string) => void;
  onDelete: () => void;
  onImprove: () => void;
  onAcceptImprovement?: () => void;
  onUndoImprovement?: () => void;
  isImproved?: boolean;
  isLoading?: boolean;
  placeholder?: string;
  improvementPrompt?: string;
  onImprovementPromptChange?: (value: string) => void;
  improvementPromptPlaceholder?: string;
}

export function DescriptionPoint({
  value,
  onChange,
  onDelete,
  onImprove,
  onAcceptImprovement,
  onUndoImprovement,
  isImproved,
  isLoading,
  placeholder = "Start with a strong action verb",
  improvementPrompt = "",
  onImprovementPromptChange,
  improvementPromptPlaceholder = "e.g., Focus on technical implementation details and performance metrics"
}: DescriptionPointProps) {
  return (
    <div className="flex gap-1.5 items-start group/item relative">
      <div className="flex-1 relative">
        <Tiptap
          content={value}
          onChange={onChange}
          editorProps={{
            attributes: {
              placeholder,
              class: cn(
                "min-h-[70px] text-xs md:text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-2.5",
                "focus:border-[#3861fb] focus:ring-1 focus:ring-[#3861fb]",
                "hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors",
                "placeholder:text-zinc-400 text-zinc-900 dark:text-zinc-100",
                isImproved && [
                  "border-[#3861fb]/60 dark:border-[#3861fb]/60",
                  "bg-blue-50/40 dark:bg-blue-950/20",
                  "shadow-xs"
                ]
              )
            }
          }}
        />
        {isImproved && (
          <div className="absolute -top-2.5 right-3 px-2 py-0.5 bg-blue-100 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800/60 rounded-full z-10 shadow-xs">
            <span className="text-[10px] font-semibold text-[#3861fb] flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" />
              AI Suggestion
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 shrink-0 pt-0.5">
        {isImproved ? (
          <>
            <Button
              variant="outline"
              size="icon"
              onClick={onAcceptImprovement}
              className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 shadow-xs"
              title="Accept improvement"
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={onUndoImprovement}
              className="h-7 w-7 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-zinc-400 hover:text-red-500 border-zinc-200 dark:border-zinc-800 shadow-xs"
              title="Revert"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-7 w-7 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
              title="Delete bullet point"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={onImprove}
                    disabled={isLoading}
                    className="h-7 w-7 rounded-lg bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-[#3861fb] border-zinc-200 dark:border-zinc-800 shadow-xs"
                    title="Improve with AI"
                  >
                    {isLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#3861fb]" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                {onImprovementPromptChange && (
                  <TooltipContent 
                    side="bottom" 
                    align="end"
                    sideOffset={4}
                    className="w-72 p-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl"
                  >
                    <AIImprovementPrompt
                      value={improvementPrompt}
                      onChange={onImprovementPromptChange}
                      placeholder={improvementPromptPlaceholder}
                      onSubmit={onImprove}
                      isLoading={isLoading}
                    />
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </>
        )}
      </div>
    </div>
  );
}
