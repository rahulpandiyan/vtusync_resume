'use client';

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface AIGenerationSettingsProps {
  numPoints: number;
  customPrompt: string;
  onNumPointsChange: (value: number) => void;
  onCustomPromptChange: (value: string) => void;
  promptPlaceholder?: string;
}

export function AIGenerationSettings({
  numPoints,
  customPrompt,
  onNumPointsChange,
  onCustomPromptChange,
  promptPlaceholder = "e.g., Focus on leadership, measurable metrics, and technical contributions"
}: AIGenerationSettingsProps) {
  return (
    <div className="space-y-2.5">
      {/* Header */}
      <div className="flex items-center gap-2 pb-0.5">
        <div className="p-1 rounded-md bg-[#3861fb]/10 text-[#3861fb]">
          <Sparkles className="h-3 w-3" />
        </div>
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">AI Generation Settings</span>
      </div>

      {/* Number of Suggestions */}
      <div>
        <Label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Points to Generate</Label>
        <Input
          type="number"
          min={1}
          max={8}
          value={numPoints}
          onChange={(e) => onNumPointsChange(parseInt(e.target.value) || 3)}
          className={cn(
            "h-7 mt-0.5 text-xs",
            "bg-white dark:bg-zinc-950",
            "border-zinc-200 dark:border-zinc-800",
            "focus:border-[#3861fb] focus:ring-1 focus:ring-[#3861fb]",
            "text-zinc-900 dark:text-zinc-100"
          )}
        />
      </div>

      {/* Custom Focus */}
      <div>
        <Label className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">Prompt for AI (Optional)</Label>
        <Textarea
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          placeholder={promptPlaceholder}
          className={cn(
            "h-14 mt-0.5 text-xs",
            "bg-white dark:bg-zinc-950",
            "border-zinc-200 dark:border-zinc-800",
            "focus:border-[#3861fb] focus:ring-1 focus:ring-[#3861fb]",
            "resize-none",
            "text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          )}
        />
      </div>
    </div>
  );
}
