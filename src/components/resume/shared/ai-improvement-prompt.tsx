'use client';

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIImprovementPromptProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  placeholder?: string;
  hideSubmitButton?: boolean;
}

export function AIImprovementPrompt({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "e.g., Make it more impactful and quantifiable with metrics",
  hideSubmitButton = false
}: AIImprovementPromptProps) {
  return (
    <div className="space-y-2.5">
      <div>
        <Label className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">Prompt for AI (Optional)</Label>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-14 mt-1 text-xs",
            "bg-white dark:bg-zinc-950",
            "border-zinc-200 dark:border-zinc-800",
            "focus:border-[#3861fb] focus:ring-1 focus:ring-[#3861fb]",
            "resize-none",
            "text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
          )}
        />
      </div>
      {!hideSubmitButton && onSubmit && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSubmit}
          disabled={isLoading}
          className={cn(
            "w-full h-8 text-xs font-medium rounded-lg",
            "bg-[#3861fb] text-white hover:bg-[#3861fb]/90 hover:text-white",
            "border-none shadow-xs",
            "transition-all active:scale-[0.98]"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
              Improve with AI
            </>
          )}
        </Button>
      )}
    </div>
  );
}
