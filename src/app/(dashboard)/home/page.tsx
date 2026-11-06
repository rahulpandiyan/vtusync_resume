import { redirect } from "next/navigation";
import { User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileRow } from "@/components/dashboard/profile-row";
import { WelcomeDialog } from "@/components/dashboard/welcome-dialog";
import { ApiKeyAlert } from "@/components/dashboard/api-key-alert";
import { type SortOption, type SortDirection } from "@/components/resume/management/resume-sort-controls";
import type { ResumeSummary } from "@/lib/types";
import { ResumesSection } from "@/components/dashboard/resumes-section";
import { getDashboardData } from "@/utils/actions";
import { checkSubscriptionPlan } from "@/utils/actions/stripe/actions";
import { FREE_PLAN_RESUME_LIMITS } from "@/lib/resume-limits";
import { HomeHeader } from "@/components/dashboard/home-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const isNewSignup = params?.type === 'signup' && params?.token_hash;

  const fallbackSubscription = {
    plan: '',
    status: '',
    currentPeriodEnd: '',
    trialEnd: '',
    isTrialing: false,
    hasProAccess: false,
  };

  let data;
  let subscription: Awaited<ReturnType<typeof checkSubscriptionPlan>> = fallbackSubscription;
  try {
    [data, subscription] = await Promise.all([
      getDashboardData(),
      checkSubscriptionPlan().catch(() => fallbackSubscription)
    ]);
    if (!data.profile) {
      redirect("/");
    }
  } catch {
    redirect("/");
  }

  const { profile, baseResumes: unsortedBaseResumes, tailoredResumes: unsortedTailoredResumes } = data;
  const baseResumesCount = unsortedBaseResumes.length;
  const tailoredResumesCount = unsortedTailoredResumes.length;

  const baseSort = (params.baseSort as SortOption) || 'createdAt';
  const baseDirection = (params.baseDirection as SortDirection) || 'desc';
  const tailoredSort = (params.tailoredSort as SortOption) || 'createdAt';
  const tailoredDirection = (params.tailoredDirection as SortDirection) || 'desc';

  function sortResumes(resumes: ResumeSummary[], sort: SortOption, direction: SortDirection) {
    return [...resumes].sort((a, b) => {
      const modifier = direction === 'asc' ? 1 : -1;
      switch (sort) {
        case 'name':
          return modifier * a.name.localeCompare(b.name);
        case 'jobTitle':
          return modifier * ((a.target_role || '').localeCompare(b.target_role || '') || 0);
        case 'createdAt':
        default:
          return modifier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
    });
  }

  const baseResumes = sortResumes(unsortedBaseResumes, baseSort, baseDirection);
  const tailoredResumes = sortResumes(unsortedTailoredResumes, tailoredSort, tailoredDirection);
  
  const isProPlan = subscription.hasProAccess;
  const canCreateBase = isProPlan || baseResumesCount < FREE_PLAN_RESUME_LIMITS.base;
  const canCreateTailored = isProPlan || tailoredResumesCount < FREE_PLAN_RESUME_LIMITS.tailored;

  if (!profile) {
    return (
      <main className="min-h-screen p-6 md:p-8 lg:p-10 relative flex items-center justify-center">
        <div className="max-w-md w-full p-8 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl text-center space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto text-zinc-500">
            <User className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Profile Not Found</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              We couldn&apos;t find your profile information. Please contact support or restart session.
            </p>
          </div>
          <Button className="w-full text-xs font-semibold">Contact Support</Button>
        </div>
      </main>
    );
  }

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      <WelcomeDialog isOpen={!!isNewSignup} />
      
      {/* Top Welcome Header with Greeting & AI Model Selector */}
      <HomeHeader firstName={profile.first_name || 'Student'} isProPlan={isProPlan} />

      {/* Free Plan Upgrade / API Key Alert */}
      {!isProPlan && (
        <div className="w-full">
          <ApiKeyAlert variant="upgrade" />
        </div>
      )}

      {/* Profile Overview & 4-Metric Bento Grid */}
      <section>
        <ProfileRow profile={profile} />
      </section>

      {/* Interactive Resumes Workspace with Shadcn Tabs */}
      <div className="pt-2">
        <Tabs defaultValue="all" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
            <TabsList className="bg-zinc-100/90 dark:bg-zinc-900/90 p-1 rounded-xl h-auto">
              <TabsTrigger 
                value="all" 
                className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm"
              >
                All Resumes ({baseResumesCount + tailoredResumesCount})
              </TabsTrigger>
              <TabsTrigger 
                value="base" 
                className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm"
              >
                Master Profiles ({baseResumesCount})
              </TabsTrigger>
              <TabsTrigger 
                value="tailored" 
                className="rounded-lg text-xs font-semibold px-3 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm"
              >
                AI Tailored ({tailoredResumesCount})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* All Resumes Tab */}
          <TabsContent value="all" className="space-y-6 mt-0 focus-visible:outline-none">
            <div className="p-4 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
              <ResumesSection
                type="base"
                resumes={baseResumes}
                profile={profile}
                sortParam="baseSort"
                directionParam="baseDirection"
                currentSort={baseSort}
                currentDirection={baseDirection}
                canCreateMore={canCreateBase}
              />
            </div>

            <div className="p-4 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
              <ResumesSection
                type="tailored"
                resumes={tailoredResumes}
                profile={profile}
                sortParam="tailoredSort"
                directionParam="tailoredDirection"
                currentSort={tailoredSort}
                currentDirection={tailoredDirection}
                baseResumes={baseResumes}
                canCreateMore={canCreateTailored}
              />
            </div>
          </TabsContent>

          {/* Master Resumes Only Tab */}
          <TabsContent value="base" className="mt-0 focus-visible:outline-none">
            <div className="p-4 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
              <ResumesSection
                type="base"
                resumes={baseResumes}
                profile={profile}
                sortParam="baseSort"
                directionParam="baseDirection"
                currentSort={baseSort}
                currentDirection={baseDirection}
                canCreateMore={canCreateBase}
              />
            </div>
          </TabsContent>

          {/* Tailored Resumes Only Tab */}
          <TabsContent value="tailored" className="mt-0 focus-visible:outline-none">
            <div className="p-4 sm:p-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
              <ResumesSection
                type="tailored"
                resumes={tailoredResumes}
                profile={profile}
                sortParam="tailoredSort"
                directionParam="tailoredDirection"
                currentSort={tailoredSort}
                currentDirection={tailoredDirection}
                baseResumes={baseResumes}
                canCreateMore={canCreateTailored}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}