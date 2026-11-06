'use client';

import { useState, useCallback, useMemo } from "react";
import { Resume } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ResumePreview } from "../preview/resume-preview";
import CoverLetter from "@/components/cover-letter/cover-letter";
import { ResumeContextMenu } from "../preview/resume-context-menu";
import { useEditorSection } from "../section-context";
import { ZoomIn, ZoomOut, Maximize2, FileText } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PreviewPanelProps {
  resume: Resume;
  onResumeChange?: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  width: number;
  showWatermark?: boolean;
}

export function PreviewPanel({
  resume,
  width,
  showWatermark = false,
}: PreviewPanelProps) {
  const { section } = useEditorSection();
  const [zoomMode, setZoomMode] = useState<'fit' | 'custom'>('fit');
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [pageCount, setPageCount] = useState<number>(1);

  // Compute the width given to the PDF preview based on zoom state
  const effectiveWidth = useMemo(() => {
    if (zoomMode === 'fit') {
      // Fit to available container with comfortable padding
      return Math.max(280, Math.min(width - 48, 860));
    }
    // Standard A4 width in points is 595.28
    return Math.max(280, Math.round(595 * zoomScale));
  }, [zoomMode, zoomScale, width]);

  const handleZoomIn = useCallback(() => {
    setZoomMode('custom');
    setZoomScale((prev) => Math.min(Number((prev + 0.1).toFixed(1)), 1.6));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomMode('custom');
    setZoomScale((prev) => Math.max(Number((prev - 0.1).toFixed(1)), 0.5));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomMode('fit');
    setZoomScale(1.0);
  }, []);

  const handleSetActualSize = useCallback(() => {
    setZoomMode('custom');
    setZoomScale(1.0);
  }, []);

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-zinc-100/80 dark:bg-zinc-950">
      {/* Scrollable document stage */}
      <div className="relative flex-1 overflow-auto overscroll-contain p-4 sm:p-8 flex flex-col items-center justify-start print:p-0">
        {section === 'cover-letter' ? (
          <div className="w-full flex flex-col items-center justify-start">
            {resume.has_cover_letter ? (
              <div style={{ width: effectiveWidth }} className="transition-all duration-150">
                <CoverLetter containerWidth={effectiveWidth} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-center max-w-md bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mt-8">
                <div className="h-10 w-10 rounded-full bg-[#3861fb]/10 text-[#3861fb] flex items-center justify-center mb-3">
                  <FileText className="h-5 w-5" />
                </div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No Cover Letter Created</h4>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Create a cover letter from the editor panel to preview and format it here.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: effectiveWidth }} className="transition-all duration-150">
            <ResumeContextMenu resume={resume} showWatermark={showWatermark}>
              <ResumePreview
                resume={resume}
                containerWidth={effectiveWidth}
                showWatermark={showWatermark}
                onPageCountChange={setPageCount}
              />
            </ResumeContextMenu>
          </div>
        )}
      </div>

      {/* Floating Zoom & Canvas Toolbar (shown for resume preview) */}
      {section !== 'cover-letter' && (
        <div className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 z-30 print:hidden">
          <TooltipProvider delayDuration={150}>
            <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-zinc-200/80 bg-white/95 px-2.5 py-1 shadow-lg backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/95">
              {/* Zoom Out */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleZoomOut}
                    aria-label="Zoom out"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Zoom out</TooltipContent>
              </Tooltip>

              {/* Zoom level toggle: Fit vs 100% */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={zoomMode === 'fit' ? handleSetActualSize : handleResetZoom}
                    className="h-7 px-2.5 rounded-full text-xs font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    {zoomMode === 'fit' ? 'Fit' : `${Math.round(zoomScale * 100)}%`}
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {zoomMode === 'fit' ? 'Click for 100% actual size' : 'Click to fit container'}
                </TooltipContent>
              </Tooltip>

              {/* Zoom In */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleZoomIn}
                    aria-label="Zoom in"
                    className="flex h-7 w-7 items-center justify-center rounded-full text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Zoom in</TooltipContent>
              </Tooltip>

              {/* Fit Width shortcut button */}
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleResetZoom}
                    aria-label="Fit width"
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full transition-colors",
                      zoomMode === 'fit'
                        ? "text-[#3861fb] bg-[#3861fb]/10"
                        : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
                    )}
                  >
                    <Maximize2 className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top">Fit to width</TooltipContent>
              </Tooltip>

              {/* Page count pill */}
              {pageCount > 0 && (
                <>
                  <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
                  <span className="px-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 tabular-nums">
                    {pageCount === 1 ? '1 page' : `${pageCount} pages`}
                  </span>
                </>
              )}
            </div>
          </TooltipProvider>
        </div>
      )}
    </div>
  );
}
