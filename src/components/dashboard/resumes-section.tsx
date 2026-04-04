'use client';

import { Trash2, Copy, FileText, Sparkles, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { MiniResumePreview } from '@/components/resume/shared/mini-resume-preview';
import { CreateResumeDialog } from '@/components/resume/management/dialogs/create-resume-dialog';
import { ResumeSortControls, type SortOption, type SortDirection } from '@/components/resume/management/resume-sort-controls';
import type { Profile, ResumeSummary } from '@/lib/types';
import { deleteResume, copyResume } from '@/utils/actions/resumes/actions';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { useState, useOptimistic, useTransition } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel"
import { toast } from 'sonner';

// Extended Resume type for optimistic updates
interface OptimisticResume extends ResumeSummary {
  isOptimistic?: boolean;
  originalId?: string;
}

interface ResumesSectionProps {
  type: 'base' | 'tailored';
  resumes: ResumeSummary[];
  profile: Profile;
  sortParam: string;
  directionParam: string;
  currentSort: SortOption;
  currentDirection: SortDirection;
  baseResumes?: ResumeSummary[]; // Only needed for tailored type
  canCreateMore?: boolean;
}

interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
}

export function ResumesSection({ 
  type,
  resumes,
  profile,
  sortParam,
  directionParam,
  currentSort,
  currentDirection,
  baseResumes = [],
  canCreateMore
}: ResumesSectionProps) {
  // Optimistic state for deletions
  const [optimisticResumes, removeOptimisticResume] = useOptimistic(
    resumes as OptimisticResume[],
    (state, deletedResumeId: string) => 
      state.filter(resume => resume.id !== deletedResumeId)
  );

  // Optimistic state for copying
  const [optimisticCopiedResumes, addOptimisticCopy] = useOptimistic(
    optimisticResumes,
    (state, newResume: OptimisticResume) => {
      // Always add new resume at the beginning (leftmost position)
      return [newResume, ...state];
    }
  );

  const [, startTransition] = useTransition();
  const [deletingResumes, setDeletingResumes] = useState<Set<string>>(new Set());
  const [copyingResumes, setCopyingResumes] = useState<Set<string>>(new Set());

  const config = {
    base: {
      border: 'border-zinc-200 dark:border-zinc-800',
      bg: 'bg-zinc-50/50 dark:bg-zinc-900/50',
      text: 'text-zinc-900 dark:text-zinc-50',
      icon: FileText,
      accent: {
        bg: 'zinc-100',
        hover: 'zinc-200'
      }
    },
    tailored: {
      border: 'border-zinc-200 dark:border-zinc-800',
      bg: 'bg-zinc-50/50 dark:bg-zinc-900/50',
      text: 'text-zinc-900 dark:text-zinc-50',
      icon: Sparkles,
      accent: {
        bg: 'zinc-100',
        hover: 'zinc-200'
      }
    }
  }[type];

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 7
  });

  // Handle optimistic deletion
  const handleDeleteResume = async (resumeId: string, resumeName: string) => {
    // Add to deleting set for visual feedback
    setDeletingResumes(prev => new Set(prev).add(resumeId));
    
    // Optimistically remove from UI immediately
    removeOptimisticResume(resumeId);
    
    // Show immediate feedback
    toast.info(`Deleting "${resumeName}"...`, { id: resumeId });
    
    try {
      // Call server action in background
      await deleteResume(resumeId);
      
      // Success feedback
      toast.success(`"${resumeName}" deleted`, { id: resumeId });
    } catch (error) {
      // On error, the optimistic update will automatically rollback
      console.error('Failed to delete resume:', error);
      toast.error(`Failed to delete "${resumeName}"`, { id: resumeId });
    } finally {
      // Remove from deleting set
      setDeletingResumes(prev => {
        const newSet = new Set(prev);
        newSet.delete(resumeId);
        return newSet;
      });
    }
  };

  // Handle optimistic copying
  const handleCopyResume = async (sourceResume: OptimisticResume) => {
    // Add to copying set for visual feedback
    setCopyingResumes(prev => new Set(prev).add(sourceResume.id));
    
    // Create optimistic copy
    const optimisticCopy: OptimisticResume = {
      ...sourceResume,
      id: `temp-${Date.now()}-${Math.random()}`, // Temporary unique ID
      name: `${sourceResume.name} (Copy)`,
      isOptimistic: true,
      originalId: sourceResume.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Optimistically add to UI immediately
    addOptimisticCopy(optimisticCopy);
    
    // Show immediate feedback
    toast.info(`Copying "${sourceResume.name}"...`, { id: `copy-${sourceResume.id}` });
    
    try {
      // Call server action in background
      await copyResume(sourceResume.id);
      
      // Success feedback
      toast.success(`"${sourceResume.name}" copied`, { id: `copy-${sourceResume.id}` });
    } catch (error) {
      // On error, the optimistic update will automatically rollback
      console.error('Failed to copy resume:', error);
      toast.error(`Failed to copy "${sourceResume.name}"`, { id: `copy-${sourceResume.id}` });
    } finally {
      // Remove from copying set
      setCopyingResumes(prev => {
        const newSet = new Set(prev);
        newSet.delete(sourceResume.id);
        return newSet;
      });
    }
  };

  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = startIndex + pagination.itemsPerPage;
  const paginatedResumes = optimisticCopiedResumes.slice(startIndex, endIndex);

  function handlePageChange(page: number) {
    setPagination(prev => ({
      ...prev,
      currentPage: page
    }));
  }

  // Create Resume Card Component
  const CreateResumeCard = () => (
    <CreateResumeDialog
      type={type}
      profile={profile}
      {...(type === 'tailored' && { baseResumes })}
    >
      <button className={cn(
        "aspect-[8.5/11] rounded-xl w-full",
        "relative overflow-hidden",
        "border border-dashed transition-all duration-300",
        "group/new-resume flex flex-col items-center justify-center gap-4",
        "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/50",
        "bg-white dark:bg-zinc-950"
      )}>
        <div className="relative z-10 flex flex-col items-center transform transition-all duration-300 group-hover/new-resume:scale-105">
          <div className="h-14 w-14 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-900 dark:text-zinc-100 transition-all duration-300 group-hover/new-resume:bg-zinc-900 group-hover/new-resume:text-zinc-50 dark:group-hover/new-resume:bg-zinc-50 dark:group-hover/new-resume:text-zinc-900">
            <config.icon className="h-6 w-6" />
          </div>

          <span className="mt-4 text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Create {type === 'base' ? 'Base' : 'Tailored'}
          </span>
        </div>
      </button>
    </CreateResumeDialog>
  );

  // Limit Reached Card Component
  const LimitReachedCard = () => (
    <Link 
      href="/subscription"
      className="group/limit block"
    >
      <div className={cn(
        "aspect-[8.5/11] rounded-xl",
        "relative overflow-hidden",
        "border border-dashed border-zinc-200 dark:border-zinc-800",
        "flex flex-col items-center justify-center gap-4",
        "bg-zinc-50/30 dark:bg-zinc-900/10 transition-all duration-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
      )}>
        <div className="relative z-10 flex flex-col items-center transform transition-all duration-300 group-hover/limit:scale-105">
          <div className="h-12 w-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400">
            <config.icon className="h-5 w-5" />
          </div>
          <span className="mt-4 text-xs font-bold text-zinc-600 dark:text-zinc-400">
            {type === 'base' ? 'Base' : 'Tailored'} Limit
          </span>
          <span className="mt-1 text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400 underline underline-offset-4">
            Upgrade for Pro
          </span>
        </div>
      </div>
    </Link>
  );

  // Resume Card Component with optimistic states
  const ResumeCard = ({ resume }: { resume: OptimisticResume }) => {
    const isDeleting = deletingResumes.has(resume.id);
    const isCopying = copyingResumes.has(resume.originalId || resume.id);

    return (
      <div className={cn(
        "group relative transition-all duration-300",
        isDeleting && "opacity-50 pointer-events-none",
        resume.isOptimistic && "animate-in slide-in-from-top-1 duration-300"
      )}>
        <AlertDialog>
          <div className="relative">
            {/* Resume Preview - Conditional Link */}
            {resume.isOptimistic ? (
              <div className="cursor-wait relative">
                <MiniResumePreview
                  name={resume.name}
                  type={type}
                  target_role={resume.target_role}
                  createdAt={resume.created_at}
                  className="transition-all duration-300 opacity-60 pointer-events-none"
                />
                <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-900 dark:text-zinc-100" />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Processing...</span>
                  </div>
                </div>
              </div>
            ) : (
              <Link href={`/resumes/${resume.id}`}>
                <MiniResumePreview
                  name={resume.name}
                  type={type}
                  target_role={resume.target_role}
                  createdAt={resume.created_at}
                  className="hover:border-zinc-400 dark:hover:border-zinc-600 transition-all duration-300"
                />
              </Link>
            )}

            {/* Action Buttons */}
            {!resume.isOptimistic && (
              <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting}
                    className="h-8 w-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                
                {canCreateMore ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      startTransition(() => {
                        handleCopyResume(resume);
                      });
                    }}
                    disabled={isDeleting || isCopying}
                    className="h-8 w-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                  >
                    {isCopying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
                        <AlertDialogDescription>
                          You&apos;ve reached the maximum number of {type} resumes allowed. 
                          Upgrade to Pro to create unlimited resumes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Link href="/subscription">
                            Upgrade to Pro
                          </Link>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            )}
          </div>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resume</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{resume.name}&quot;? 
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  startTransition(() => {
                    handleDeleteResume(resume.id, resume.name);
                  });
                }}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <div className="relative">
      <div className="flex flex-col gap-4 w-full">
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-10">
          <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {type === 'base' ? 'Base' : 'Tailored'} Resumes
          </h2>
          <div className="flex items-center gap-2">
            <ResumeSortControls 
              sortParam={sortParam}
              directionParam={directionParam}
              currentSort={currentSort}
              currentDirection={currentDirection}
            />
          </div>
        </div>

        {/* Desktop Pagination */}
        {optimisticCopiedResumes.length > pagination.itemsPerPage && (
          <div className="hidden md:flex w-full items-start justify-start -mt-6 mb-4">
            <Pagination className="flex justify-end">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                </PaginationItem>
                
                {Array.from({ length: Math.ceil(optimisticCopiedResumes.length / pagination.itemsPerPage) }).map((_, index) => {
                  const pageNumber = index + 1;
                  const totalPages = Math.ceil(optimisticCopiedResumes.length / pagination.itemsPerPage);
                  
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages || 
                    (pageNumber >= pagination.currentPage - 1 && pageNumber <= pagination.currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={index}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePageChange(pageNumber)}
                          className={cn(
                            "h-8 w-8 p-0 text-xs font-semibold",
                            pagination.currentPage === pageNumber 
                              ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100" 
                              : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                          )}
                        >
                          {pageNumber}
                        </Button>
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === Math.ceil(optimisticCopiedResumes.length / pagination.itemsPerPage)}
                    className="h-8 w-8 p-0 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <div className="relative pb-10">
        {/* Mobile View */}
        <div className="md:hidden w-full space-y-6">
          {canCreateMore ? (
            <div className="w-full">
              <CreateResumeCard />
            </div>
          ) : (
            <div className="w-full">
              <LimitReachedCard />
            </div>
          )}

          {paginatedResumes.length > 0 && (
            <div className="w-full">
              <Carousel className="w-full">
                <CarouselContent>
                  {paginatedResumes.map((resume) => (
                    <CarouselItem key={resume.id} className="basis-[85%] pl-4">
                      <ResumeCard resume={resume} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>

        {/* Desktop Grid View */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {canCreateMore ? (
            <CreateResumeCard />
          ) : (
            <LimitReachedCard />
          )}

          {paginatedResumes.map((resume) => (
            <ResumeCard key={resume.id} resume={resume} />
          ))}
        </div>
      </div>
    </div>
  );
} 
