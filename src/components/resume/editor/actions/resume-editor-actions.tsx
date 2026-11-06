'use client';

import { Resume } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Download, Loader2, Save, FileText } from "lucide-react";
import { toast } from "sonner";
import { pdf } from '@react-pdf/renderer';
import { TextImport } from "../../text-import";
import { ResumePDFDocument } from "../preview/resume-pdf-document";
import { cn } from "@/lib/utils";
import { useResumeContext } from "../resume-editor-context";
import { updateResume } from "@/utils/actions/resumes/actions";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface ResumeEditorActionsProps {
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  showWatermark?: boolean;
}

export function ResumeEditorActions({
  onResumeChange,
  showWatermark = false,
}: ResumeEditorActionsProps) {
  const { state, dispatch } = useResumeContext();
  const { resume, isSaving } = state;
  const [downloadOptions, setDownloadOptions] = useState({
    resume: true,
    coverLetter: true
  });

  // Save Resume
  const handleSave = async () => {
    try {
      dispatch({ type: 'SET_SAVING', value: true });
      await updateResume(state.resume.id, state.resume);
      toast.success("Resume changes saved successfully.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save your changes.");
    } finally {
      dispatch({ type: 'SET_SAVING', value: false });
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full py-1">
      {/* Left: Text Import Button */}
      <TextImport
        resume={resume}
        onResumeChange={onResumeChange}
        className="h-8 px-3 text-xs font-medium border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-sm rounded-lg"
      />

      {/* Right: Download & Save Buttons */}
      <div className="flex items-center gap-2">
        {/* Download Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    // Download Resume if selected
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

                    // Download Cover Letter if selected and exists
                    if (downloadOptions.coverLetter && resume.has_cover_letter) {
                      const html2pdf = (await import('html2pdf.js')).default;
                      const coverLetterElement = document.getElementById('cover-letter-content');
                      if (!coverLetterElement) {
                        throw new Error('Cover letter content not found');
                      }

                      const opt = {
                        margin: [0, 0, -0.5, 0],
                        filename: `${resume.first_name || 'Cover'}_${resume.last_name || 'Letter'}.pdf`,
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: {
                          backgroundColor: '#ffffff',
                          useCORS: true,
                          letterRendering: true,
                          logging: false,
                        },
                        jsPDF: { 
                          unit: 'in', 
                          format: 'letter', 
                          orientation: 'portrait' 
                        }
                      };

                      await html2pdf().set(opt).from(coverLetterElement).save();
                    }

                    toast.success("Download started.");
                  } catch (error) {
                    console.error(error);
                    toast.error(error instanceof Error ? error.message : "Unable to download document.");
                  }
                }}
                className="h-8 px-3 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg shadow-sm"
              >
                <Download className="h-3.5 w-3.5 mr-1 text-zinc-500" />
                <span>Download</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent 
              side="bottom" 
              align="end"
              sideOffset={5}
              className="w-44 p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-lg"
            >
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Export Options</p>
                <label className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <Checkbox 
                    checked={downloadOptions.resume}
                    onCheckedChange={(checked) => 
                      setDownloadOptions(prev => ({ ...prev, resume: checked as boolean }))
                    }
                  />
                  <span>Resume (PDF)</span>
                </label>
                {resume.has_cover_letter && (
                  <label className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                    <Checkbox 
                      checked={downloadOptions.coverLetter}
                      onCheckedChange={(checked) => 
                        setDownloadOptions(prev => ({ ...prev, coverLetter: checked as boolean }))
                      }
                    />
                    <span>Cover Letter</span>
                  </label>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          size="sm"
          className="h-8 px-3.5 text-xs font-semibold bg-[#3861fb] hover:bg-[#3861fb]/90 text-white shadow-sm rounded-lg active:scale-[0.98] transition-all"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5 mr-1" />
              <span>Save</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
