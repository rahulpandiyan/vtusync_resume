import { redirect } from "next/navigation";
import { getDashboardData } from "@/utils/actions";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { Suspense } from "react";

// Force dynamic behavior and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditProfilePage() {
  // Fetch profile data and handle authentication
  let data;
  try {
    data = await getDashboardData();
  } catch (error: unknown) {
    void error
    redirect("/");
  }

  const { profile } = data;

  // Display a friendly message if no profile exists
  if (!profile) {
    redirect("/home");
  }

  return (
    <main className="min-h-screen relative bg-white dark:bg-zinc-950 pb-20 sm:pb-12 w-full">
      {/* Main Content Layer */}
      <div className="relative z-10 w-full max-w-4xl mx-auto pt-2 sm:pt-4 px-3 sm:px-4 overflow-hidden">
        <Suspense fallback={<div className="flex items-center justify-center min-h-[400px]"><div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
          <ProfileEditForm profile={profile} />
        </Suspense>
      </div>
    </main>
  );
} 