import { getDashboardData } from "@/utils/actions";
import { createClient } from "@/utils/supabase/server";
import { getSubscriptionAccessState } from "@/lib/subscription-access";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ResumesPageClient } from "@/components/resume/management/resumes-page-client";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function ResumesPageLoadingSkeleton() {
  return (
    <div className="w-full space-y-6 sm:space-y-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-4 w-72 rounded-md" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Toolbar Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <Skeleton className="h-9 w-64 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-9 w-48 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-6 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <Skeleton 
              key={i} 
              className="w-full aspect-[8.5/11] rounded-xl bg-zinc-200/70 dark:bg-zinc-800/70" 
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ResumesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const [{ profile, baseResumes, tailoredResumes }, { data: subscription }] = await Promise.all([
    getDashboardData(),
    supabase
      .from('subscriptions')
      .select('subscription_plan, subscription_status')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  const subscriptionState = getSubscriptionAccessState(subscription);
  const isProPlan = subscriptionState.hasProAccess;

  if (!profile) {
    redirect("/home");
  }

  return (
    <div className="w-full">
      <Suspense fallback={<ResumesPageLoadingSkeleton />}>
        <ResumesPageClient
          baseResumes={baseResumes}
          tailoredResumes={tailoredResumes}
          profile={profile}
          isProPlan={isProPlan}
        />
      </Suspense>
    </div>
  );
}
