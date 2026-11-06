'use client';

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function SuggestionSkeleton() {
  return (
    <Card className={cn(
      "group relative overflow-hidden p-3.5",
      "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800",
      "shadow-sm rounded-xl"
    )}>
      <div className="relative space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-[#3861fb]/10 text-[#3861fb]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Main Content */}
        <div className="bg-zinc-50 dark:bg-zinc-950/60 rounded-lg p-3 border border-zinc-200/80 dark:border-zinc-800/80 space-y-2.5">
          <div className="flex justify-between items-start">
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-3 w-16" />
          </div>

          <div className="space-y-1.5 pt-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-3/4" />
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            <Skeleton className="h-4 w-14 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
        </div>
      </div>
    </Card>
  );
}
