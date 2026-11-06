'use client';

import { Resume } from "@/lib/types";
import { Logo } from "@/components/ui/logo";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface ResumeEditorHeaderProps {
  resume: Resume;
  hasUnsavedChanges: boolean;
}

export function ResumeEditorHeader({
  resume,
  hasUnsavedChanges,
}: ResumeEditorHeaderProps) {
  const router = useRouter();
  const capitalizeWords = (str: string) => {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleBackClick = () => {
    if (!hasUnsavedChanges) {
      router.push('/');
    }
  };

  return (
    <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 fixed left-0 right-0 z-40">
      {/* Content Container */}
      <div className="max-w-[2000px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between relative">
        {/* Left Section - Logo, Title  */}
        <div className="flex items-center gap-4">
          {hasUnsavedChanges ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div>
                  <Logo className="text-xl cursor-pointer" asLink={false} />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
                  <AlertDialogDescription>
                    You have unsaved changes. Are you sure you want to leave? Your changes will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => router.push('/')}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Leave
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <div onClick={handleBackClick}>
              <Logo className="text-xl cursor-pointer" asLink={false} />
            </div>
          )}
          <div className="h-7 w-px bg-zinc-200 dark:bg-zinc-800 hidden sm:block" />
          <div className="flex min-w-0 flex-col justify-center">
            <h1 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
              {resume.is_base_resume ? capitalizeWords(resume.target_role) : resume.name}
            </h1>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {resume.is_base_resume ? "Base Resume" : "Tailored Resume"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
} 