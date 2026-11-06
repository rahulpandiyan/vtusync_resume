'use client';

import { Resume } from "@/lib/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ResumePreview } from "../preview/resume-preview";
import CoverLetter from "@/components/cover-letter/cover-letter";
import { ResumeContextMenu } from "../preview/resume-context-menu";

interface PreviewPanelProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  width: number;
  showWatermark?: boolean;
}

export function PreviewPanel({
  resume,
  width,
  showWatermark = false,
}: PreviewPanelProps) {
  const scrollbarWidth = 12;
  const paddingHorizontal = 16;
  const availableWidth = Math.max(width - scrollbarWidth - paddingHorizontal, 280);

  return (
    <div className={cn(
      "h-full w-full bg-zinc-100/70 dark:bg-zinc-950/80 transition-colors"
    )}>
      <ScrollArea className="z-50 h-full w-full">
        <div className="min-h-full w-full flex flex-col items-center justify-start p-2 sm:p-4">
          <ResumeContextMenu resume={resume} showWatermark={showWatermark}>
            <ResumePreview resume={resume} containerWidth={availableWidth} showWatermark={showWatermark} />
          </ResumeContextMenu>
        </div>

        <CoverLetter 
          containerWidth={availableWidth}
        />
        <ScrollBar orientation="vertical" className="w-3" />
      </ScrollArea>
    </div>
  );
}
