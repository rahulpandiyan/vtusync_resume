'use client';

import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Loader2, Save, FileEdit, Columns2, Eye, Check } from "lucide-react";
import { toast } from "sonner";
import { pdf } from '@react-pdf/renderer';
import { TextImport } from "@/components/resume/text-import";
import { ResumePDFDocument } from "../preview/resume-pdf-document";
import { useResumeContext } from "../resume-editor-context";
import { updateResume } from "@/utils/actions/resumes/actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface EditorTopBarProps {
  resume: Resume;
  hasUnsavedChanges: boolean;
  onRequestExit: () => void;
  showWatermark?: boolean;
  viewMode?: 'split' | 'form' | 'preview';
  onViewModeChange?: (mode: 'split' | 'form' | 'preview') => void;
}

export function EditorTopBar({
  resume,
  hasUnsavedChanges,
  onRequestExit,
  showWatermark = false,
  viewMode = 'split',
  onViewModeChange,
}: EditorTopBarProps) {
  const { state, dispatch } = useResumeContext();
  const { isSaving } = state;
  const [downloadOptions, setDownloadOptions] = useState({
    resume: true,
    coverLetter: true
  });

  const handleSave = async () => {
    try {
      dispatch({ type: 'SET_SAVING', value: true });
      await updateResume(state.resume.id, state.resume);
      toast.success("Resume saved successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save your changes.");
    } finally {
      dispatch({ type: 'SET_SAVING', value: false });
    }
  };

  const handleDownload = async () => {
    try {
      if (downloadOptions.resume) {
        const blob = await pdf(<ResumePDFDocument resume={resume} showWatermark={showWatermark} />).toBlob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${resume.first_name || 'Resume'}_${resume.last_name || ''}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }

      if (downloadOptions.coverLetter && resume.has_cover_letter) {
        const html2pdf = (await import('html2pdf.js')).default;
        const coverLetterElement = document.getElementById('cover-letter-content');
        if (!coverLetterElement) {
          throw new Error('Cover letter content not found');
        }

        await html2pdf().set({
          margin: [0, 0, -0.5, 0],
          filename: `${resume.first_name || 'Cover'}_${resume.last_name || 'Letter'}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { useCORS: true, letterRendering: true },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).from(coverLetterElement).save();
      }

      toast.success("Download started.");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Unable to download document.");
    }
  };

  const capitalizeWords = (str: string) =>
    str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <header className="shrink-0 border-b border-zinc-200 bg-white/95 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/95 print:hidden select-none">
      <div className="flex h-14 items-center justify-between gap-2 px-2 sm:px-4">
        {/* Left: Exit & Object Identity */}
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={onRequestExit}
                  aria-label="Exit editor"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="bottom">Back to resumes</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#3861fb] text-white shadow-sm font-semibold text-xs">
              R
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-xs sm:text-sm font-semibold leading-tight text-zinc-900 dark:text-zinc-100">
                  {resume.is_base_resume ? capitalizeWords(resume.target_role || 'Base Resume') : resume.name}
                </h1>
                <span className={cn(
                  "hidden sm:inline-flex text-[10px] font-semibold px-1.5 py-0.5 rounded-full uppercase tracking-wider",
                  resume.is_base_resume 
                    ? "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" 
                    : "bg-[#3861fb]/10 text-[#3861fb]"
                )}>
                  {resume.is_base_resume ? 'Base' : 'Tailored'}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {isSaving ? (
                  <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                    <Loader2 className="h-3 w-3 animate-spin text-[#3861fb]" />
                    <span>Saving…</span>
                  </span>
                ) : hasUnsavedChanges ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    <span>Unsaved changes</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span>Saved</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Desktop View Mode Switcher (Split | Form | Preview) */}
        {onViewModeChange && (
          <div className="hidden lg:flex items-center rounded-lg bg-zinc-100 p-0.5 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <button
              onClick={() => onViewModeChange('form')}
              title="Editor only"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                viewMode === 'form'
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              <FileEdit className="h-3.5 w-3.5" />
              <span>Editor</span>
            </button>
            <button
              onClick={() => onViewModeChange('split')}
              title="Side-by-side view"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                viewMode === 'split'
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              <Columns2 className="h-3.5 w-3.5" />
              <span>Split</span>
            </button>
            <button
              onClick={() => onViewModeChange('preview')}
              title="Preview only"
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold transition-all",
                viewMode === 'preview'
                  ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              )}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </button>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <TextImport
            resume={resume}
            onResumeChange={(field, value) => dispatch({ type: 'UPDATE_FIELD', field, value })}
            className="hidden sm:inline-flex h-9 px-3 text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg shadow-sm"
          />

          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="h-9 gap-1.5 rounded-lg border-zinc-200 dark:border-zinc-800 text-xs font-medium hover:bg-zinc-50 dark:hover:bg-zinc-900 shadow-sm"
                  aria-label="Download PDF"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden xs:inline">Download</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="end" className="w-44 p-3 bg-white dark:bg-zinc-900 shadow-lg border border-zinc-200 dark:border-zinc-800 rounded-xl">
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Export Options</p>
                  <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                    <Checkbox
                      checked={downloadOptions.resume}
                      onCheckedChange={(checked) => setDownloadOptions(prev => ({ ...prev, resume: checked as boolean }))}
                    />
                    <span>Resume (PDF)</span>
                  </label>
                  {resume.has_cover_letter && (
                    <label className="flex items-center gap-2 text-xs cursor-pointer select-none">
                      <Checkbox
                        checked={downloadOptions.coverLetter}
                        onCheckedChange={(checked) => setDownloadOptions(prev => ({ ...prev, coverLetter: checked as boolean }))}
                      />
                      <span>Cover Letter</span>
                    </label>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            size="sm"
            className="h-9 rounded-lg bg-[#3861fb] px-3.5 sm:px-4 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#2b50ea] active:scale-[0.98] disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center gap-1.5">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Saving…</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Save className="h-4 w-4" />
                <span>Save</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
