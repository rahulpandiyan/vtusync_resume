'use client';

import { ArrowRight, Crown, Sparkles, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useApiKeys } from "@/hooks/use-api-keys";
import { Badge } from "@/components/ui/badge";

type ApiKeyAlertVariant = 'upgrade' | 'trial';

export function ApiKeyAlert({ variant = 'upgrade' }: { variant?: ApiKeyAlertVariant }) {
  const { apiKeys } = useApiKeys();
  const hasApiKeys = apiKeys.length > 0;

  if (hasApiKeys) return null;

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-orange-500/5 to-transparent p-4 sm:p-4.5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Crown className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                Unlock Unlimited AI Resumes & Multi-Model Scoring
              </h3>
              <Badge variant="outline" className="hidden xs:inline-flex text-[10px] font-bold border-amber-500/30 text-amber-700 dark:text-amber-300 bg-amber-500/10 py-0">
                PRO ACCESS
              </Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Get unlimited ATS tailoring, GPT-4o & Claude 3.5 Sonnet without bringing your own API keys.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Link href="/settings">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg text-xs font-semibold border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <Key className="h-3.5 w-3.5 mr-1 text-zinc-400" />
              <span>Use Custom Key</span>
            </Button>
          </Link>
          <Link href="/subscription">
            <Button
              size="sm"
              className="h-8 px-3.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 mr-1" />
              <span>Upgrade to Pro</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}