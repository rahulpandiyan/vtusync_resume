

import { cn } from "@/lib/utils";

interface MiniResumePreviewProps {
  name: string;
  type: 'base' | 'tailored';
  updatedAt?: string;
  createdAt?: string;
  target_role?: string;
  className?: string;
}

export function MiniResumePreview({
  name,
  type,
  createdAt,
  className
}: MiniResumePreviewProps) {

  function formatDate(dateString?: string) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  return (
    <div className={cn(
      "relative w-full aspect-[8.5/11]",
      "rounded-xl overflow-hidden",
      "border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all duration-300",
      "group hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-md",
      className
    )}>
      {/* Content Container */}
      <div className="relative h-full p-5 flex flex-col">
        {/* Header Section */}
        <div className="border-b border-zinc-100 dark:border-zinc-900 pb-4 mb-5">
          <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1 tracking-tight">
            {name}
          </h3>
          <div className={cn(
            "inline-flex items-center text-[9px] font-bold uppercase tracking-[0.1em]",
            type === 'base' ? "text-zinc-400" : "text-zinc-500 font-black"
          )}>
            {type === 'base' ? 'Base Template' : 'Tailored Version'}
          </div>
        </div>

        {/* Mock Resume Content - Minimalist & Geometric */}
        <div className="flex-1 space-y-4 opacity-20 dark:opacity-40">
          {/* Header Lines */}
          <div className="flex justify-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={`contact-${i}`}
                className="h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 w-10"
              />
            ))}
          </div>

          {/* Body Sections */}
          {[...Array(4)].map((_, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="space-y-2">
              <div className="h-2 w-16 rounded-sm bg-zinc-300 dark:bg-zinc-700" />
              <div className="space-y-1.5">
                {[...Array(sectionIndex === 1 ? 3 : 2)].map((_, i) => (
                  <div
                    key={`line-${sectionIndex}-${i}`}
                    className={cn(
                      "h-1 rounded-full bg-zinc-100 dark:bg-zinc-800",
                      i === 0 ? "w-full" : "w-[85%]"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Badge/Date */}
        {createdAt && (
          <div className="mt-auto pt-4 flex justify-between items-center border-t border-zinc-50 dark:border-zinc-900">
            <div className="h-1.5 w-12 rounded-full bg-zinc-100 dark:bg-zinc-900" />
            <div className="text-[8px] font-semibold text-zinc-400 tracking-tight">
              {formatDate(createdAt)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 