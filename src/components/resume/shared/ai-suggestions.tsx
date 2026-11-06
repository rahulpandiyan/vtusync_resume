'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, X } from "lucide-react";
import Tiptap from "@/components/ui/tiptap";

interface AISuggestion {
  id: string;
  point: string;
}

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  onApprove: (suggestion: AISuggestion) => void;
  onDelete: (suggestionId: string) => void;
}

export function AISuggestions({ suggestions, onApprove, onDelete }: AISuggestionsProps) {
  if (suggestions.length === 0) return null;

  return (
    <div className={cn(
      "relative group/suggestions",
      "p-4 sm:p-5 mt-4",
      "rounded-xl",
      "bg-zinc-50/90 dark:bg-zinc-900/90",
      "border border-zinc-200 dark:border-zinc-800",
      "shadow-sm",
      "transition-all duration-300",
      "hover:border-zinc-300 dark:hover:border-zinc-700",
      "overflow-hidden"
    )}>
      {/* Content */}
      <div className="relative">
        <div className="flex items-center gap-2 mb-3.5">
          <div className="p-1 rounded-md bg-[#3861fb]/10 text-[#3861fb]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">AI Suggested Improvements</span>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div 
              key={suggestion.id} 
              className="group/item relative transition-all"
            >
              <div className="flex gap-2.5 items-start">
                <div className="flex-1">
                  <Tiptap
                    content={suggestion.point}
                    onChange={() => {}}
                    readOnly={true}
                    className={cn(
                      "min-h-[70px] text-xs sm:text-sm",
                      "bg-white dark:bg-zinc-950",
                      "border-zinc-200 dark:border-zinc-800",
                      "text-zinc-800 dark:text-zinc-200",
                      "rounded-lg p-2.5",
                      "transition-all"
                    )}
                  />
                </div>
                <div className="flex flex-col gap-1.5 shrink-0 pt-0.5">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onApprove(suggestion)}
                    className="h-8 w-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 shadow-xs transition-transform active:scale-95"
                    title="Accept suggestion"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onDelete(suggestion.id)}
                    className="h-8 w-8 rounded-lg bg-zinc-50 dark:bg-zinc-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-zinc-400 hover:text-red-500 border-zinc-200 dark:border-zinc-800 shadow-xs transition-transform active:scale-95"
                    title="Dismiss"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
