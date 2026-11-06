'use client';

import { useApiKeys, useDefaultModel } from '@/hooks/use-api-keys';
import { ModelSelector } from '@/components/shared/model-selector';
import { getGreeting } from '@/lib/utils';
import { Bot, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface HomeHeaderProps {
  firstName: string;
  isProPlan: boolean;
}

export function HomeHeader({ firstName, isProPlan }: HomeHeaderProps) {
  const { apiKeys } = useApiKeys();
  const { defaultModel, setDefaultModel } = useDefaultModel();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
      {/* Left: Greeting & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {getGreeting()}, {firstName}
          </h1>
          {isProPlan ? (
            <Badge 
              variant="outline" 
              className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full"
            >
              PRO ACTIVE
            </Badge>
          ) : (
            <Badge 
              variant="secondary" 
              className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 px-2 py-0.5 rounded-full"
            >
              Free Tier
            </Badge>
          )}
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          VTU & Engineering Resume Intelligence Hub — Tailor, calibrate & beat ATS filters.
        </p>
      </div>

      {/* Right: Model Selector (Clean & Uncluttered, no duplicate upgrade button) */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/60 shadow-sm">
          <Bot className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-medium text-zinc-400 hidden sm:inline">Active Model:</span>
          <ModelSelector
            value={defaultModel}
            onValueChange={setDefaultModel}
            apiKeys={apiKeys}
            isProPlan={isProPlan}
            className="w-[140px] sm:w-[170px] border-none bg-transparent h-6 text-xs shadow-none p-0 focus:ring-0 font-medium"
            showToast={true}
          />
        </div>
      </div>
    </div>
  );
}