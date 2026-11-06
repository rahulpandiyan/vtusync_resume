import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

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
  target_role,
  updatedAt,
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

  const displayDate = updatedAt ? formatDate(updatedAt) : formatDate(createdAt);

  return (
    <div className={cn(
      "relative w-full aspect-[8.5/11]",
      "rounded-xl overflow-hidden",
      "border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 transition-all duration-200",
      "group hover:border-[#3861fb]/40 dark:hover:border-[#3861fb]/50 hover:shadow-lg dark:hover:shadow-zinc-950/60",
      className
    )}>
      {/* Content Container */}
      <div className="relative h-full p-4 sm:p-5 flex flex-col justify-between">
        {/* Header Section */}
        <div className="border-b border-zinc-100 dark:border-zinc-800/80 pb-3 mb-2">
          <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1 mb-1 tracking-tight group-hover:text-[#3861fb] transition-colors">
            {name}
          </h3>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn(
              "inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
              type === 'base' 
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300" 
                : "bg-[#3861fb]/10 text-[#3861fb] font-semibold"
            )}>
              {type === 'base' ? 'Master' : 'Tailored'}
            </span>
            {target_role && (
              <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 truncate max-w-[130px]">
                {target_role}
              </span>
            )}
          </div>
        </div>

        {/* Mock Resume Content - Minimalist & Geometric */}
        <div className="flex-1 space-y-3 opacity-25 dark:opacity-40 py-1">
          {/* Header Lines */}
          <div className="flex justify-center gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div
                key={`contact-${i}`}
                className="h-1 rounded-full bg-zinc-400 dark:bg-zinc-600 w-8"
              />
            ))}
          </div>

          {/* Body Sections */}
          {[...Array(3)].map((_, sectionIndex) => (
            <div key={`section-${sectionIndex}`} className="space-y-1.5">
              <div className="h-1.5 w-14 rounded-sm bg-zinc-500 dark:bg-zinc-500" />
              <div className="space-y-1">
                {[...Array(sectionIndex === 1 ? 3 : 2)].map((_, i) => (
                  <div
                    key={`line-${sectionIndex}-${i}`}
                    className={cn(
                      "h-1 rounded-full bg-zinc-300 dark:bg-zinc-700",
                      i === 0 ? "w-full" : "w-[85%]"
                    )}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Badge/Date */}
        {displayDate && (
          <div className="mt-auto pt-2.5 flex justify-between items-center border-t border-zinc-100 dark:border-zinc-800/80">
            <div className="h-1.5 w-8 rounded-full bg-zinc-200 dark:bg-zinc-800" />
            <div className="flex items-center gap-1 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 tracking-tight">
              <Clock className="h-2.5 w-2.5" />
              <span>{displayDate}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
