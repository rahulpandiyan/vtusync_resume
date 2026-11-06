'use client';

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  FileText, 
  Sparkles, 
  Copy, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  Layers,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { MiniResumePreview } from '@/components/resume/shared/mini-resume-preview';
import { ResumeSortControls, type SortOption, type SortDirection } from '@/components/resume/management/resume-sort-controls';
import { CreateBaseResumeDialog } from '@/components/resume/management/dialogs/create-base-resume-dialog';
import { CreateTailoredResumeDialog } from '@/components/resume/management/dialogs/create-tailored-resume-dialog';
import { deleteResume, copyResume } from '@/utils/actions/resumes/actions';
import { ResumeSummary, Profile } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const ITEMS_PER_PAGE = 12;

interface ResumesPageClientProps {
  baseResumes: ResumeSummary[];
  tailoredResumes: ResumeSummary[];
  profile: Profile;
  isProPlan?: boolean;
}

export function ResumesPageClient({
  baseResumes: initialBaseResumes,
  tailoredResumes: initialTailoredResumes,
  profile,
  isProPlan = false,
}: ResumesPageClientProps) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<'all' | 'base' | 'tailored'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('createdAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [currentPage, setCurrentPage] = useState(1);

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copyingId, setCopyingId] = useState<string | null>(null);

  // Combine resumes
  const allResumes = useMemo(() => {
    return [...initialBaseResumes, ...initialTailoredResumes];
  }, [initialBaseResumes, initialTailoredResumes]);

  // Filter by tab & search query
  const filteredResumes = useMemo(() => {
    let list = allResumes;

    if (activeTab === 'base') {
      list = list.filter(r => r.is_base_resume);
    } else if (activeTab === 'tailored') {
      list = list.filter(r => !r.is_base_resume);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(r => 
        (r.name && r.name.toLowerCase().includes(q)) ||
        (r.target_role && r.target_role.toLowerCase().includes(q))
      );
    }

    // Sort
    return [...list].sort((a, b) => {
      const modifier = sortDirection === 'asc' ? 1 : -1;
      switch (sortOption) {
        case 'name':
          return modifier * a.name.localeCompare(b.name);
        case 'jobTitle':
          return modifier * ((a.target_role || '').localeCompare(b.target_role || '') || 0);
        case 'createdAt':
        default:
          return modifier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
    });
  }, [allResumes, activeTab, searchQuery, sortOption, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredResumes.length / ITEMS_PER_PAGE);
  const paginatedResumes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResumes.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResumes, currentPage]);

  // Handle resume duplication
  const handleCopy = async (resume: ResumeSummary) => {
    try {
      setCopyingId(resume.id);
      toast.info(`Duplicating "${resume.name}"...`);
      await copyResume(resume.id);
      toast.success(`"${resume.name}" duplicated successfully!`);
      router.refresh();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to duplicate resume');
    } finally {
      setCopyingId(null);
    }
  };

  // Handle resume deletion
  const handleDelete = async (resumeId: string, resumeName: string) => {
    try {
      setDeletingId(resumeId);
      await deleteResume(resumeId);
      toast.success(`"${resumeName}" deleted`);
      router.refresh();
    } catch (error: unknown) {
      const err = error as Error;
      toast.error(err.message || 'Failed to delete resume');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="w-full space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Resumes
            </h1>
            <Badge variant="secondary" className="text-xs font-bold px-2 py-0.5 rounded-full">
              {allResumes.length} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            All your master profiles and job-tailored applications in one unified workspace.
          </p>
        </div>

        {/* Action Button: Create Resume Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="sm" 
                className="h-9 px-4 rounded-lg text-xs font-semibold bg-[#3861fb] hover:bg-[#3861fb]/90 text-white shadow-sm active:scale-[0.98] transition-all"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                <span>Create Resume</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <CreateBaseResumeDialog profile={profile}>
                <div className="flex items-start gap-2.5 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors">
                  <div className="p-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 mt-0.5">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      Master Resume
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Comprehensive career profile
                    </div>
                  </div>
                </div>
              </CreateBaseResumeDialog>

              <CreateTailoredResumeDialog baseResumes={initialBaseResumes} profile={profile}>
                <div className="flex items-start gap-2.5 p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer transition-colors mt-1">
                  <div className="p-1 rounded bg-[#3861fb]/10 text-[#3861fb] mt-0.5">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      AI Tailored Resume
                    </div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Calibrated for a job posting
                    </div>
                  </div>
                </div>
              </CreateTailoredResumeDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Filter Tabs, Search & Sort Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Category Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(val) => {
            setActiveTab(val as 'all' | 'base' | 'tailored');
            setCurrentPage(1);
          }}
          className="w-full md:w-auto"
        >
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-auto flex flex-wrap gap-1">
            <TabsTrigger 
              value="all" 
              className="rounded-lg text-xs font-semibold px-3.5 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              All ({allResumes.length})
            </TabsTrigger>
            <TabsTrigger 
              value="base" 
              className="rounded-lg text-xs font-semibold px-3.5 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              Master ({initialBaseResumes.length})
            </TabsTrigger>
            <TabsTrigger 
              value="tailored" 
              className="rounded-lg text-xs font-semibold px-3.5 py-1.5 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              AI Tailored ({initialTailoredResumes.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Right side: Search & Sort Controls */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <Input
              type="text"
              placeholder="Search resumes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-8 pr-7 h-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg shadow-sm focus-visible:ring-1 focus-visible:ring-[#3861fb]"
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setCurrentPage(1);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Sort Controls */}
          <ResumeSortControls
            currentSort={sortOption}
            currentDirection={sortDirection}
            onSortChange={(sort) => {
              setSortOption(sort);
              setCurrentPage(1);
            }}
            onDirectionToggle={() => {
              setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {/* Resumes Grid */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm p-4 sm:p-6 shadow-sm">
        {paginatedResumes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedResumes.map((resume) => {
              const isDeleting = deletingId === resume.id;
              const isCopying = copyingId === resume.id;

              return (
                <div 
                  key={resume.id}
                  className={cn(
                    "group relative transition-all duration-200",
                    isDeleting && "opacity-40 pointer-events-none"
                  )}
                >
                  <AlertDialog>
                    {/* The Card preview wrapped in Link */}
                    <Link 
                      href={`/resumes/${resume.id}`}
                      className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3861fb] rounded-xl"
                    >
                      <MiniResumePreview
                        name={resume.name}
                        type={resume.is_base_resume ? 'base' : 'tailored'}
                        target_role={resume.target_role}
                        createdAt={resume.created_at}
                        updatedAt={resume.updated_at}
                      />
                    </Link>

                    {/* Floating Hover Action Buttons */}
                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity z-20">
                      {/* Duplicate Button */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault();
                          startTransition(() => {
                            handleCopy(resume);
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

                    {/* Delete Confirmation Alert Dialog */}
                    <AlertDialogContent className="sm:max-w-[420px]">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                          Delete Resume?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                          Are you sure you want to delete &quot;{resume.name}&quot;? This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="gap-2 sm:gap-0">
                        <AlertDialogCancel className="text-xs h-9">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => {
                            startTransition(() => {
                              handleDelete(resume.id, resume.name);
                            });
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs h-9"
                        >
                          Delete Resume
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-16 text-center space-y-3">
            <div className="h-12 w-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto text-zinc-400">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-base font-semibold text-zinc-800 dark:text-zinc-200">
              {searchQuery ? "No matching resumes found" : "No resumes in this view"}
            </p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              {searchQuery
                ? `No resumes matched "${searchQuery}". Try clearing your search.`
                : activeTab === 'tailored'
                ? "You haven't created any AI-tailored resumes yet. Tailor your first resume to match a specific job description."
                : "Create your first master resume using your profile data or upload an existing PDF."}
            </p>

            <div className="pt-2">
              {searchQuery ? (
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setSearchQuery('')}
                  className="text-xs"
                >
                  Clear Search
                </Button>
              ) : (
                <CreateBaseResumeDialog profile={profile}>
                  <Button 
                    size="sm" 
                    className="bg-[#3861fb] hover:bg-[#3861fb]/90 text-white text-xs font-semibold px-4"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    Create Master Resume
                  </Button>
                </CreateBaseResumeDialog>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-9 px-2.5 text-xs border-zinc-200 dark:border-zinc-800"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Prev</span>
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={cn(
                "h-9 w-9 flex items-center justify-center rounded-lg text-xs font-semibold transition-all border",
                currentPage === i + 1
                  ? "bg-[#3861fb] border-[#3861fb] text-white shadow-sm"
                  : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800"
              )}
            >
              {i + 1}
            </button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="h-9 px-2.5 text-xs border-zinc-200 dark:border-zinc-800"
          >
            <span>Next</span>
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
