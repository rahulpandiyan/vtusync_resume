import { redirect } from "next/navigation";
import { getDashboardData } from "@/utils/actions";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function ProfileLoadingSkeleton() {
  return (
    <div className="w-full space-y-5 pb-20 lg:pb-8">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-3.5 w-64 rounded" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-20 rounded-lg" />
          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
        <Skeleton className="h-8 w-28 rounded-lg shrink-0" />
        <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
        <Skeleton className="h-8 w-24 rounded-lg shrink-0" />
        <Skeleton className="h-8 w-20 rounded-lg shrink-0" />
      </div>

      {/* Main Card Skeleton */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          <Skeleton className="h-4 w-32 rounded" />
          <Skeleton className="h-7 w-28 rounded-lg" />
        </div>
        <div className="p-5 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default async function EditProfilePage() {
  let data;
  try {
    data = await getDashboardData();
  } catch (error: unknown) {
    void error;
    redirect("/");
  }

  const { profile } = data;

  if (!profile) {
    redirect("/home");
  }

  return (
    <div className="w-full animate-in fade-in duration-150">
      <Suspense fallback={<ProfileLoadingSkeleton />}>
        <ProfileEditForm profile={profile} />
      </Suspense>
    </div>
  );
}
