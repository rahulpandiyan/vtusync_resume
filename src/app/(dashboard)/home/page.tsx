import { redirect } from "next/navigation";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileRow } from "@/components/dashboard/profile-row";
import { WelcomeDialog } from "@/components/dashboard/welcome-dialog";
import { getGreeting } from "@/lib/utils";
import { ApiKeyAlert } from "@/components/dashboard/api-key-alert";
import { type SortOption, type SortDirection } from "@/components/resume/management/resume-sort-controls";
import type { ResumeSummary } from "@/lib/types";
import { ResumesSection } from "@/components/dashboard/resumes-section";
import { getDashboardData } from "@/utils/actions";
import { checkSubscriptionPlan } from "@/utils/actions/stripe/actions";
import { FREE_PLAN_RESUME_LIMITS } from "@/lib/resume-limits";

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
      <main className="min-h-screen p-6 md:p-8 lg:p-10 relative flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="max-w-md w-full p-10 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl">
          <div className="text-center space-y-6">
            <div className="h-16 w-16 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-zinc-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Profile Not Found</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
                We couldn&apos;t find your profile information. Please contact support for assistance.
              </p>
            </div>
            <Button className="w-full">Contact Support</Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative pb-24 sm:pb-12 bg-white dark:bg-zinc-950">
      <WelcomeDialog isOpen={!!isNewSignup} />
      
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-4 sm:pt-8 px-4 sm:px-6">
        <div className="space-y-4 sm:space-y-8">
          {/* Profile Overview */}
          <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-8">
            <ProfileRow profile={profile} />
          </section>
          
          <div className="space-y-4 sm:space-y-6">
            {/* API Key Alert */}
            {!isProPlan && <ApiKeyAlert variant="upgrade" />}
            
            {/* Greeting */}
            <div className="flex items-center justify-between px-1 pt-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {getGreeting()}, {profile.first_name}
                </h1>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium">
                  ResuSync Dashboard
                </p>
              </div>
            </div>

            {/* Resume Sections */}
            <div className="space-y-4 sm:space-y-8 pt-2">
              <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-8">
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
              </section>

              <section className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 sm:p-8">
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
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
