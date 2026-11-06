'use client';

import { Trash2, Copy, FileText, Sparkles, ChevronLeft, ChevronRight, Loader2, Plus, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MiniResumePreview } from '@/components/resume/shared/mini-resume-preview';
import { CreateResumeDialog } from '@/components/resume/management/dialogs/create-resume-dialog';
import { ResumeSortControls, type SortOption, type SortDirection } from '@/components/resume/management/resume-sort-controls';
import type { Profile, ResumeSummary } from '@/lib/types';
import { deleteResume, copyResume } from '@/utils/actions/resumes/actions';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { useState, useOptimistic, useTransition } from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
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

  const isBase = type === 'base';

  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 8
  });

  // Handle optimistic deletion
  const handleDeleteResume = async (resumeId: string, resumeName: string) => {
    setDeletingResumes(prev => new Set(prev).add(resumeId));
    removeOptimisticResume(resumeId);
    toast.info(`Deleting "${resumeName}"...`, { id: resumeId });
    
    try {
      await deleteResume(resumeId);
      toast.success(`"${resumeName}" deleted`, { id: resumeId });
    } catch (error) {
      console.error('Failed to delete resume:', error);
      toast.error(`Failed to delete "${resumeName}"`, { id: resumeId });
    } finally {
      setDeletingResumes(prev => {
        const newSet = new Set(prev);
        newSet.delete(resumeId);
        return newSet;
      });
    }
  };

  // Handle optimistic copying
  const handleCopyResume = async (sourceResume: OptimisticResume) => {
    setCopyingResumes(prev => new Set(prev).add(sourceResume.id));
    
    const optimisticCopy: OptimisticResume = {
      ...sourceResume,
      id: `temp-${Date.now()}-${Math.random()}`,
      name: `${sourceResume.name} (Copy)`,
      isOptimistic: true,
      originalId: sourceResume.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    addOptimisticCopy(optimisticCopy);
    toast.info(`Duplicating "${sourceResume.name}"...`, { id: `copy-${sourceResume.id}` });
    
    try {
      await copyResume(sourceResume.id);
      toast.success(`"${sourceResume.name}" duplicated`, { id: `copy-${sourceResume.id}` });
    } catch (error) {
      console.error('Failed to copy resume:', error);
      toast.error(`Failed to duplicate "${sourceResume.name}"`, { id: `copy-${sourceResume.id}` });
    } finally {
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
        "group/new-resume w-full aspect-[8.5/11] rounded-xl relative overflow-hidden",
        "border-2 border-dashed border-zinc-200 dark:border-zinc-800",
        "hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40",
        "bg-white/50 dark:bg-zinc-950/50 p-6 flex flex-col items-center justify-center text-center",
        "transition-all duration-200 shadow-sm hover:shadow active:scale-[0.99]"
      )}>
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-900 dark:text-zinc-100 transition-all duration-200 group-hover/new-resume:scale-110 group-hover/new-resume:bg-zinc-900 group-hover/new-resume:text-white dark:group-hover/new-resume:bg-zinc-50 dark:group-hover/new-resume:text-zinc-900 shadow-sm">
            {isBase ? (
              <FileText className="h-5 w-5" />
            ) : (
              <Sparkles className="h-5 w-5" />
            )}
          </div>

          <div className="space-y-1">
            <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block tracking-tight">
              {isBase ? 'New Master Resume' : 'New Tailored Resume'}
            </span>
            <p className="text-[11px] text-zinc-400 dark:text-zinc-500 max-w-[170px] leading-tight">
              {isBase 
                ? 'Import PDF, sync profile or build from scratch' 
                : 'Tailor instantly with AI for a specific job'}
            </p>
          </div>

          <Badge variant="secondary" className="mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full">
            <Plus className="h-3 w-3 mr-1" />
            Create
          </Badge>
        </div>
      </button>
    </CreateResumeDialog>
  );

  // Limit Reached Card Component
  const LimitReachedCard = () => (
    <Link 
      href="/subscription"
      className="group/limit block w-full"
    >
      <div className={cn(
        "aspect-[8.5/11] rounded-xl w-full p-6",
        "border-2 border-dashed border-zinc-200 dark:border-zinc-800",
        "flex flex-col items-center justify-center text-center gap-3",
        "bg-zinc-50/40 dark:bg-zinc-900/20 transition-all duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900"
      )}>
        <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 block">
            {isBase ? 'Master' : 'Tailored'} Limit Reached
          </span>
          <p className="text-[11px] text-zinc-400 max-w-[160px]">
            Upgrade to Pro for unlimited AI tailored resumes & ATS scoring.
          </p>
        </div>
        <Badge variant="outline" className="text-[10px] font-bold border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5">
          Upgrade to Pro
        </Badge>
      </div>
    </Link>
  );

  // Resume Card Component
  const ResumeCard = ({ resume }: { resume: OptimisticResume }) => {
    const isDeleting = deletingResumes.has(resume.id);
    const isCopying = copyingResumes.has(resume.originalId || resume.id);

    return (
      <div className={cn(
        "group relative transition-all duration-200",
        isDeleting && "opacity-50 pointer-events-none",
        resume.isOptimistic && "animate-in fade-in duration-200"
      )}>
        <AlertDialog>
          <div className="relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {resume.isOptimistic ? (
              <div className="cursor-wait relative">
                <MiniResumePreview
                  name={resume.name}
                  type={type}
                  target_role={resume.target_role}
                  createdAt={resume.created_at}
                  className="opacity-50 pointer-events-none"
                />
                <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm rounded-xl flex items-center justify-center z-10 border border-zinc-200 dark:border-zinc-800">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin text-zinc-900 dark:text-zinc-100" />
                    <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Processing...</span>
                  </div>
                </div>
              </div>
            ) : (
              <Link href={`/resumes/${resume.id}`} className="block focus:outline-none">
                <MiniResumePreview
                  name={resume.name}
                  type={type}
                  target_role={resume.target_role}
                  createdAt={resume.created_at}
                  className="transition-all duration-200 group-hover:border-zinc-400 dark:group-hover:border-zinc-600"
                />
              </Link>
            )}

            {/* Quick Action Floating Bar */}
            {!resume.isOptimistic && (
              <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
                {/* Duplicate Button */}
                {canCreateMore ? (
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={(e) => {
                      e.preventDefault();
                      startTransition(() => {
                        handleCopyResume(resume);
                      });
                    }}
                    disabled={isDeleting || isCopying}
                    title="Duplicate Resume"
                    className="h-7 w-7 rounded-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 shadow-sm"
                  >
                    {isCopying ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        title="Duplicate (Requires Pro)"
                        className="h-7 w-7 rounded-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 shadow-sm"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
                        <AlertDialogDescription>
                          You have reached the maximum number of {type} resumes allowed on the free plan.
                          Upgrade to Pro to create and duplicate unlimited resumes.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction asChild>
                          <Link href="/subscription">Upgrade to Pro</Link>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}

                {/* Delete Button */}
                <AlertDialogTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    disabled={isDeleting}
                    title="Delete Resume"
                    className="h-7 w-7 rounded-lg bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 shadow-sm"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </AlertDialogTrigger>
              </div>
            )}
          </div>

          {/* Delete Confirmation Dialog */}
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Resume</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete &quot;{resume.name}&quot;? This action cannot be undone.
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
                className="bg-red-600 text-white hover:bg-red-700 font-semibold"
              >
                Delete Resume
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100">
            {isBase ? (
              <FileText className="h-4 w-4" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {isBase ? 'Master Resumes' : 'Tailored Resumes'}
              </h2>
              <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-full">
                {optimisticCopiedResumes.length}
              </Badge>
            </div>
            <p className="text-[11px] sm:text-xs text-zinc-500 dark:text-zinc-400">
              {isBase 
                ? 'Your comprehensive master profile templates' 
                : 'Job-specific versions calibrated for targeted ATS roles'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <ResumeSortControls 
            sortParam={sortParam}
            directionParam={directionParam}
            currentSort={currentSort}
            currentDirection={currentDirection}
          />
        </div>
      </div>

      {/* Pagination Controls (Desktop) */}
      {optimisticCopiedResumes.length > pagination.itemsPerPage && (
        <div className="hidden md:flex justify-end">
          <Pagination className="flex justify-end">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="h-8 w-8 p-0"
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
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" 
                            : "text-zinc-500"
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
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Mobile View: Carousel */}
      <div className="md:hidden space-y-4">
        {canCreateMore ? <CreateResumeCard /> : <LimitReachedCard />}

        {paginatedResumes.length > 0 && (
          <Carousel className="w-full">
            <CarouselContent>
              {paginatedResumes.map((resume) => (
                <CarouselItem key={resume.id} className="basis-[80%] pl-3">
                  <ResumeCard resume={resume} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </div>

      {/* Desktop Grid View */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
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
  );
}