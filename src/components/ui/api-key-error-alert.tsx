'use client';

import { AlertCircle, KeyRound, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ApiKeyErrorAlertProps {
  error: unknown;
  router: ReturnType<typeof useRouter>;
}

export function ApiKeyErrorAlert({ error, router }: ApiKeyErrorAlertProps) {
  const errorMessage = typeof error === 'string' 
    ? error 
    : (error as Error)?.message || JSON.stringify(error);

  const isRateLimit = errorMessage.toLowerCase().includes('rate limit');
  const isKeyError = errorMessage.toLowerCase().includes('api key') || errorMessage.toLowerCase().includes('unauthorized');

  return (
    <div className="my-2 p-4 rounded-xl bg-amber-500/[0.06] border border-amber-500/20 text-zinc-900 dark:text-zinc-100 space-y-3">
      <div className="flex items-start gap-3">
        <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4 stroke-[2.2]" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
            {isRateLimit ? "AI Rate Limit Reached" : isKeyError ? "AI Provider Notice" : "AI Service Notice"}
          </p>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {isKeyError 
              ? "Your selected AI provider requires an API key. You can configure your key in Settings or switch to our included free model."
              : isRateLimit
                ? "You have reached the temporary rate limit. Please try again shortly or upgrade to Pro for higher limits."
                : errorMessage}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-500/10">
        <Button
          size="sm"
          onClick={() => router.push('/settings')}
          className="h-7 px-3 bg-[#3861fb] hover:bg-[#3861fb]/90 text-white text-xs font-semibold rounded-lg shadow-sm"
        >
          <KeyRound className="mr-1.5 h-3 w-3" />
          <span>Configure API Key</span>
        </Button>

        {isRateLimit && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/subscription')}
            className="h-7 px-3 text-xs border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg"
          >
            <Sparkles className="mr-1.5 h-3 w-3 text-amber-500" />
            <span>Upgrade to Pro</span>
          </Button>
        )}
      </div>
    </div>
  );
}
