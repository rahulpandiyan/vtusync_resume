'use client';

import { AlertCircle, Sparkles, KeyRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

function isRateLimitOrQuotaError(text: string) {
  const normalized = text.toLowerCase();
  return (
    normalized.includes('rate limit') ||
    normalized.includes('too many requests') ||
    normalized.includes('429') ||
    normalized.includes('quota') ||
    normalized.includes('throttl')
  );
}

function isApiKeyError(text: string) {
  const normalized = text.toLowerCase();
  return (
    normalized.includes('api key') ||
    normalized.includes('unauthorized') ||
    normalized.includes('invalid key') ||
    normalized.includes('authentication')
  );
}

interface ApiErrorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorMessage: { title: string; description: string };
  onUpgrade: () => void;
  onSettings: () => void;
}

export function ApiErrorDialog({ 
  open, 
  onOpenChange,
  errorMessage,
  onUpgrade,
  onSettings
}: ApiErrorDialogProps) {
  const fullMessage = `${errorMessage.title} ${errorMessage.description}`;
  const isRateLimit = isRateLimitOrQuotaError(fullMessage);
  const isKeyError = isApiKeyError(fullMessage);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(
        "sm:max-w-[440px] p-0 overflow-hidden",
        "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
        "shadow-2xl rounded-2xl"
      )}>
        <div className="p-6 space-y-5">
          {/* Header Icon & Title */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <AlertCircle className="w-6 h-6 stroke-[2.2]" />
            </div>
            
            <div className="space-y-1.5">
              <DialogTitle className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                {errorMessage.title || "AI Service Notice"}
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mx-auto">
                {errorMessage.description || "An unexpected error occurred while processing your request."}
              </DialogDescription>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-2.5 pt-1">
            {isRateLimit ? (
              <Button
                onClick={onUpgrade}
                className="w-full h-9 bg-[#3861fb] hover:bg-[#3861fb]/90 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Upgrade to Pro for Higher Limits</span>
              </Button>
            ) : isKeyError ? (
              <Button
                onClick={onSettings}
                className="w-full h-9 bg-[#3861fb] hover:bg-[#3861fb]/90 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <KeyRound className="h-3.5 w-3.5" />
                <span>Configure AI Key in Settings</span>
              </Button>
            ) : null}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onSettings}
                className="flex-1 h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl"
              >
                <KeyRound className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
                <span>AI Settings</span>
              </Button>

              <Button
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="h-8 px-4 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-xl"
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
