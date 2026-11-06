import { redirect } from "next/navigation";
import { getDashboardData } from "@/utils/actions";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function ProfileLoadingSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-44 rounded-lg" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
          <Skeleton className="h-4 w-80 rounded-md" />
        </div>
      </div>

      {/* Quick Import Bar Skeleton */}
      <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 p-4 sm:p-5 bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40 rounded" />
            <Skeleton className="h-3.5 w-72 rounded" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
            <Skeleton className="h-8 w-28 rounded-lg" />
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <div className="space-y-6">
        <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
          <div className="flex gap-1.5">
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-28 rounded-lg" />
            <Skeleton className="h-9 w-24 rounded-lg" />
          </div>
        </div>

        {/* Form Card Skeleton */}
        <Card className="border-zinc-200/80 dark:border-zinc-800/80">
          <CardHeader className="space-y-2">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-3.5 w-64 rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
          </CardContent>
        </Card>

        {/* Bottom Action Footer Skeleton */}
        <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-4 w-72 rounded" />
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-9 w-24 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
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
    <div className="w-full animate-in fade-in duration-200">
      <Suspense fallback={<ProfileLoadingSkeleton />}>
        <ProfileEditForm profile={profile} />
      </Suspense>
    </div>
  );
}
