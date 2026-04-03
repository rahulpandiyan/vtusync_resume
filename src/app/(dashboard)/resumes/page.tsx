import { getDashboardData } from "@/utils/actions";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MiniResumePreview } from "@/components/resume/shared/mini-resume-preview";
import { ResumeSortControls } from "@/components/resume/management/resume-sort-controls";
import type { SortOption, SortDirection } from "@/components/resume/management/resume-sort-controls";

const RESUMES_PER_PAGE = 12;

type SearchParams = { [key: string]: string | string[] | undefined }

export default async function ResumesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams;
  
  const { baseResumes, tailoredResumes } = await getDashboardData();
  
  // Combine and sort resumes
  const allResumes = [...baseResumes, ...tailoredResumes];
  const currentPage = Number(params.page) || 1;
  const sort = (params.sort as SortOption) || 'createdAt';
  const direction = (params.direction as SortDirection) || 'desc';

  // Sort resumes
  const sortedResumes = allResumes.sort((a, b) => {
    const modifier = direction === 'asc' ? 1 : -1;
    switch (sort) {
      case 'name':
        return modifier * a.name.localeCompare(b.name);
      case 'jobTitle':
        return modifier * (a.target_role?.localeCompare(b.target_role || '') || 0);
      case 'createdAt':
      default:
        return modifier * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    }
  });

  // Paginate resumes
  const totalPages = Math.ceil(sortedResumes.length / RESUMES_PER_PAGE);
  const paginatedResumes = sortedResumes.slice(
    (currentPage - 1) * RESUMES_PER_PAGE,
    currentPage * RESUMES_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-7xl mx-auto p-6 space-y-10">
        {/* Header with controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b-2 border-muted pb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              My Resumes
            </h1>
            <p className="text-sm font-medium text-zinc-500">
              Manage all your resumes in one place
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <Suspense>
              <ResumeSortControls />
            </Suspense>
            <Link href="/resumes/new">
              <Button className="h-10 px-4 font-medium bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200">
                Create Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Resumes Grid */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8">
          <Suspense fallback={<ResumesLoadingSkeleton />}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {paginatedResumes.map((resume) => (
                <Link href={`/resumes/${resume.id}`} key={resume.id} className="transition-transform duration-200 active:scale-95">
                  <MiniResumePreview
                    name={resume.name}
                    type={resume.is_base_resume ? 'base' : 'tailored'}
                    target_role={resume.target_role}
                    updatedAt={resume.updated_at}
                  />
                </Link>
              ))}
              {paginatedResumes.length === 0 && (
                <div className="col-span-full py-20 text-center">
                  <p className="text-xl font-bold text-muted-foreground">No resumes found.</p>
                </div>
              )}
            </div>
          </Suspense>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 pt-6">
            {[...Array(totalPages)].map((_, i) => (
              <Link
                key={i}
                href={`?page=${i + 1}&sort=${sort}&direction=${direction}`}
                className={cn(
                  "h-10 w-10 flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 border",
                  currentPage === i + 1
                    ? "bg-zinc-900 border-zinc-900 text-zinc-50 dark:bg-zinc-50 dark:border-zinc-50 dark:text-zinc-900"
                    : "bg-white border-zinc-200 text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:bg-zinc-950 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                )}
              >
                {i + 1}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResumesLoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {[...Array(8)].map((_, i) => (
        <Skeleton 
          key={i} 
          className="w-full aspect-[8.5/11] rounded-xl bg-zinc-100 dark:bg-zinc-900" 
        />
      ))}
    </div>
  );
}
