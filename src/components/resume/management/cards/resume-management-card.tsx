import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight } from "lucide-react";

import { ResumeList } from "./resume-list";
import { ResumeSummary, Profile } from "@/lib/types";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { CreateResumeDialog } from "../dialogs/create-resume-dialog";

interface ResumeManagementCardProps {
  type: 'base' | 'tailored';
  resumes: ResumeSummary[];
  baseResumes?: ResumeSummary[];
  profile: Profile;
  icon: React.ReactNode;
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
  gradientFrom: string;
  gradientTo: string;
  accentColor: {
    bg: string;
    border: string;
    hover: string;
    text: string;
  };
}

export function ResumeManagementCard({
  type,
  resumes,
  baseResumes,
  profile,
  icon,
  title,
  description,
  emptyTitle,
  emptyDescription,
  accentColor,
}: ResumeManagementCardProps) {
  const isDisabled = type === 'tailored' && (!baseResumes || baseResumes.length === 0);
  const buttonText = type === 'base' ? 'New Base Resume' : 'New Tailored Resume';

  return (
    <Card className={cn(
      "group relative overflow-hidden",
      "bg-white dark:bg-zinc-950",
      "border border-zinc-200 dark:border-zinc-800",
      "shadow-sm rounded-xl"
    )}>

      {/* Header Section */}
      <div className={cn(
        "relative",
        "border-b",
        "border-zinc-200 dark:border-zinc-800"
      )}>
        
        {/* Header Content */}
        <div className="relative px-6 py-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2.5 rounded-lg border",
              "bg-zinc-50 dark:bg-zinc-900",
              "border-zinc-200 dark:border-zinc-800"
            )}>
              <div className={cn(
                "text-zinc-600 dark:text-zinc-400",
                "w-4 h-4"
              )}>
                {icon}
              </div>
            </div>
            <div>
              <h2 className={cn(
                "text-base font-semibold text-zinc-900 dark:text-zinc-100",
                "tracking-tight"
              )}>
                {title}
              </h2>
              <p className="text-xs text-muted-foreground/80 mt-1 font-medium">
                {description} • <span className="font-semibold">{resumes.length} active</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <CreateResumeDialog type={type} baseResumes={type === 'tailored' ? baseResumes : undefined} profile={profile}>
              <Button 
                variant="outline" 
                size="sm"
                className={cn(
                  "bg-white dark:bg-zinc-950",
                  "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                  "h-8 text-xs font-medium rounded-md",
                  isDisabled && "opacity-50 cursor-not-allowed"
                )}
                disabled={isDisabled}
              >
                <Plus className={cn(
                  "h-3.5 w-3.5 mr-1.5",
                  "text-zinc-500"
                )} />
                <span className="font-medium">{buttonText}</span>
              </Button>
            </CreateResumeDialog>
            <Link 
              href={`/resumes`}
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
                "transition-colors duration-200"
              )}
            >
              View all 
              <ChevronRight className={cn(
                "h-3.5 w-3.5"
              )} />
            </Link>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative flex flex-col">
        <div className={cn(
          "relative flex-1 overflow-y-auto scrollbar-thin",
          "scrollbar-thumb-black/10 dark:scrollbar-thumb-white/10 scrollbar-track-transparent",
          "p-4 bg-zinc-50/50 dark:bg-zinc-900/50"
        )}>
          <ResumeList 
            resumes={resumes}
            title={title}
            type={type}
            accentColor={accentColor}
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
              "auto-rows-[minmax(120px,1fr)]",
              "gap-3 pb-2"
            )}
            itemClassName={cn(
              "w-full aspect-[8.5/11]",
              "border border-zinc-200 dark:border-zinc-800 rounded-lg",
              "bg-white dark:bg-zinc-950",
              "transition-all duration-200",
              "hover:border-zinc-300 dark:hover:border-zinc-700",
              "hover:shadow-sm"
            )}
            emptyMessage={
              <div className="col-span-full flex items-center justify-center min-h-[240px]">
                <div className="text-center max-w-md mx-auto px-4">
                  <div className={cn(
                    "mx-auto mb-4",
                    "w-12 h-12 rounded-lg",
                    "flex items-center justify-center",
                    "bg-zinc-100 dark:bg-zinc-900",
                    "border border-zinc-200 dark:border-zinc-800"
                  )}>
                    <div className={cn(
                      "text-zinc-500",
                      "w-6 h-6"
                    )}>
                      {icon}
                    </div>
                  </div>
                  <h3 className={cn(
                    "text-base font-semibold mb-2 text-zinc-900 dark:text-zinc-100"
                  )}>
                    {emptyTitle}
                  </h3>
                  <p className="text-xs text-muted-foreground/80 mb-4 leading-relaxed">
                    {emptyDescription}
                  </p>
                  <CreateResumeDialog type={type} baseResumes={type === 'tailored' ? baseResumes : undefined} profile={profile}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={cn(
                        "bg-white dark:bg-zinc-950",
                        "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900",
                        "font-medium rounded-md",
                        isDisabled && "opacity-50 cursor-not-allowed"
                      )}
                      disabled={isDisabled}
                    >
                      <Plus className={cn(
                        "h-4 w-4 mr-1.5",
                        "text-zinc-500"
                      )} />
                      <span className="font-medium">{buttonText}</span>
                    </Button>
                  </CreateResumeDialog>
                </div>
              </div>
            }
          />
        </div>
      </div>
    </Card>
  );
} 
