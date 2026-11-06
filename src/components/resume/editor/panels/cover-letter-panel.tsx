'use client';

import { Resume, Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Plus, Sparkles, Loader2 } from "lucide-react";
import { cn, withBasePath } from "@/lib/utils";
import { useState } from 'react';
import { readStreamableValue } from 'ai/rsc';
import type { AIConfig } from "@/utils/ai-tools";
import { AIImprovementPrompt } from "../../shared/ai-improvement-prompt";
import { generate } from "@/utils/actions/cover-letter/actions";
import { useResumeContext } from "../resume-editor-context";
import { readStoredCustomProviders } from "@/hooks/use-custom-providers";
import { ApiErrorDialog } from "@/components/ui/api-error-dialog";
import { CreateTailoredResumeDialog } from "@/components/resume/management/dialogs/create-tailored-resume-dialog";

interface CoverLetterPanelProps {
  resume: Resume;
  job: Job | null;
  aiConfig?: AIConfig;
}

export function CoverLetterPanel({
  resume,
  job,
  aiConfig,
}: CoverLetterPanelProps) {
  const { dispatch } = useResumeContext();
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState({ title: '', description: '' });

  const updateField = (field: keyof Resume, value: Resume[keyof Resume]) => {
    dispatch({ 
      type: 'UPDATE_FIELD',
      field,
      value
    });
  };

  const generateCoverLetter = async () => {
    if (!job) return;
    
    setIsGenerating(true);
    
    try {
      // Get model and API key from local storage
      const MODEL_STORAGE_KEY = 'resusync-default-model';
      const LOCAL_STORAGE_KEY = 'resusync-api-keys';

      const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY);
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      let apiKeys = [];

      try {
        apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error('Error parsing API keys:', error);
      }

      // Prompt
      const prompt = `Write a professional cover letter for the following job using my resume information:
      ${JSON.stringify(job)}
      
      ${JSON.stringify(resume)}
      
      Today's date is ${new Date().toLocaleDateString()}.

      Please use my contact information in the letter:
      Full Name: ${resume.first_name} ${resume.last_name}
      Email: ${resume.email}
      ${resume.phone_number ? `Phone: ${resume.phone_number}` : ''}
      ${resume.linkedin_url ? `LinkedIn: ${resume.linkedin_url}` : ''}
      ${resume.github_url ? `GitHub: ${resume.github_url}` : ''}

      ${customPrompt ? `\nAdditional requirements: ${customPrompt}` : ''}`;

      // Call The Model
      const { output } = await generate(prompt, {
        ...aiConfig,
        model: selectedModel || '',
        apiKeys,
        customProviders: readStoredCustomProviders()
      });

      // Generated Content
      let generatedContent = '';

      // Update Resume Context
      for await (const delta of readStreamableValue(output)) {
        generatedContent += delta;
        updateField('cover_letter', {
          content: generatedContent,
        });
      }
      
    } catch (error: Error | unknown) {
      console.error('Generation error:', error);
      if (error instanceof Error && (
          error.message.toLowerCase().includes('api key') || 
          error.message.toLowerCase().includes('unauthorized') ||
          error.message.toLowerCase().includes('invalid key') ||
          error.message.toLowerCase().includes('invalid x-api-key'))
      ) {
        setErrorMessage({
          title: "API Key Error",
          description: "There was an issue with your API key. Please check your settings and try again."
        });
      } else {
        setErrorMessage({
          title: "Error",
          description: "Failed to generate cover letter. Please try again."
        });
      }
      setShowErrorDialog(true);
    } finally {
      setIsGenerating(false);
    }
  };

  if (resume.is_base_resume) {
    return (
      <div className={cn(
        "p-6 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800",
        "space-y-4 text-center"
      )}>
        <div className="flex items-center gap-2 justify-center">
          <div className="p-2 rounded-lg bg-[#3861fb]/10 text-[#3861fb]">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">Cover Letter</h3>
        </div>
        
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md mx-auto">
          To generate a tailored cover letter, please first tailor this base resume to a specific job vacancy.
        </p>
        
        <CreateTailoredResumeDialog 
          baseResumes={[resume]}
        >
          <Button
            size="sm"
            className="mt-1 bg-[#3861fb] hover:bg-[#3861fb]/90 text-white rounded-lg shadow-sm"
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Tailor This Resume
          </Button>
        </CreateTailoredResumeDialog>
      </div>
    );
  }

  return (
    <div className={cn(
      "p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm",
      "space-y-5"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-[#3861fb]/10 text-[#3861fb]">
          <FileText className="h-4 w-4" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Cover Letter</h3>
      </div>

      {resume.has_cover_letter ? (
        <div className="space-y-5">
          <div className="w-full p-4 bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <AIImprovementPrompt
              value={customPrompt}
              onChange={setCustomPrompt}
              isLoading={isGenerating}
              placeholder="e.g., Emphasize technical strengths, problem solving, and relevant projects"
              hideSubmitButton
            />
          </div>

          <div className="space-y-2.5">
            <Button
              size="sm"
              className="w-full h-9 bg-[#3861fb] hover:bg-[#3861fb]/90 text-white shadow-sm rounded-lg active:scale-[0.98] transition-all text-xs font-semibold"
              onClick={generateCoverLetter}
              disabled={isGenerating || !job}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Cover Letter...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Cover Letter with AI
                </>
              )}
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900/40 rounded-lg"
              onClick={() => updateField('has_cover_letter', false)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete Cover Letter
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 text-center">
            <p className="text-xs text-zinc-500">No cover letter has been created for this resume yet.</p>
          </div>
          <Button
            size="sm"
            className="w-full h-9 bg-[#3861fb] hover:bg-[#3861fb]/90 text-white rounded-lg shadow-sm text-xs font-semibold"
            onClick={() => updateField('has_cover_letter', true)}
          >
            <Plus className="h-4 w-4 mr-1.5" />
            Create Cover Letter
          </Button>
        </div>
      )}

      <ApiErrorDialog
        open={showErrorDialog}
        onOpenChange={setShowErrorDialog}
        errorMessage={errorMessage}
        onUpgrade={() => {
          setShowErrorDialog(false);
          window.location.href = withBasePath('/subscription');
        }}
        onSettings={() => {
          setShowErrorDialog(false);
          window.location.href = withBasePath('/settings');
        }}
      />
    </div>
  );
}
