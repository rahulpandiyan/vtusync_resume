'use client';

import React from 'react';
import { Resume, Profile, Job } from "@/lib/types";
import { useState, useEffect, useReducer } from "react";
import { useRouter } from "next/navigation";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { ResumeContext, resumeReducer } from './resume-editor-context';
import { createClient } from "@/utils/supabase/client";
import { EditorLayout } from "./layout/EditorLayout";
import { EditorPanel } from './panels/editor-panel';
import { PreviewPanel } from './panels/preview-panel';
import { EditorTopBar } from "./header/editor-topbar";
import { UnsavedChangesDialog } from './dialogs/unsaved-changes-dialog';
import { EditorSectionProvider } from './section-context';

interface ResumeEditorClientProps {
  initialResume: Resume;
  profile: Profile;
  initialJob?: Job | null;
  showWatermark?: boolean;
}

export function ResumeEditorClient({
  initialResume,
  profile,
  initialJob,
  showWatermark = false,
}: ResumeEditorClientProps) {
  const router = useRouter();
  const handleRequestExit = () => {
    if (state.hasUnsavedChanges) {
      setShowExitDialog(true);
      return;
    }
    router.push('/resumes');
  };

  // Editor Panel
  const [state, dispatch] = useReducer(resumeReducer, {
    resume: initialResume,
    isSaving: false,
    isDeleting: false,
    hasUnsavedChanges: false
  });

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'form' | 'preview'>('split');
  const debouncedResume = useDebouncedValue(state.resume, 100);
  const [job, setJob] = useState<Job | null>(initialJob ?? null);
  const [isLoadingJob, setIsLoadingJob] = useState(false);

  // Single job fetching effect
  useEffect(() => {
    if (!state.resume.job_id) {
      setJob(null);
      setIsLoadingJob(false);
      return;
    }

    if (job?.id === state.resume.job_id) {
      return;
    }

    let isCancelled = false;

    async function fetchJob() {
      try {
        setIsLoadingJob(true);
        const supabase = createClient();
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', state.resume.job_id)
          .single();

        if (isCancelled) {
          return;
        }

        if (error) {
          void error;
          setJob(null);
          return;
        }

        setJob(jobData);
      } catch {
        if (!isCancelled) {
          setJob(null);
        }
      } finally {
        if (!isCancelled) {
          setIsLoadingJob(false);
        }
      }
    }

    fetchJob();

    return () => {
      isCancelled = true;
    };
  }, [state.resume.job_id, job?.id]);

  const updateField = <K extends keyof Resume>(field: K, value: Resume[K]) => {
    
    if (field === 'document_settings') {
      // Ensure we're passing a valid DocumentSettings object
      if (typeof value === 'object' && value !== null) {
        dispatch({ type: 'UPDATE_FIELD', field, value });
      } else {
        console.error('Invalid document settings:', value);
      }
    } else {
      dispatch({ type: 'UPDATE_FIELD', field, value });
    }
  };

  // Track changes
  useEffect(() => {
    const hasChanges = JSON.stringify(state.resume) !== JSON.stringify(initialResume);
    dispatch({ type: 'SET_HAS_CHANGES', value: hasChanges });
  }, [state.resume, initialResume]);

  // Handle beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (state.hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [state.hasUnsavedChanges]);



  // Editor Panel
  const editorPanel = (
    <EditorPanel
      resume={state.resume}
      profile={profile}
      job={job}
      isLoadingJob={isLoadingJob}
      onResumeChange={updateField}
      showWatermark={showWatermark}
    />
  );

  // Preview Panel
  const previewPanel = (width: number) => (
    <PreviewPanel
      resume={debouncedResume}
      onResumeChange={updateField}
      width={width}
      showWatermark={showWatermark}
    />
  );

  return (
    <ResumeContext.Provider value={{ state, dispatch }}>
      <EditorSectionProvider>
        {/* Unsaved Changes Dialog */}
        <UnsavedChangesDialog
          isOpen={showExitDialog}
          onOpenChange={setShowExitDialog}
          onConfirm={() => {
            setShowExitDialog(false);
            router.push('/resumes');
          }}
        />

        <div className="flex h-full min-h-0 flex-col">
          {/* Full-bleed window bar: exit, identity, actions */}
          <EditorTopBar
            resume={state.resume}
            hasUnsavedChanges={state.hasUnsavedChanges}
            onRequestExit={handleRequestExit}
            showWatermark={showWatermark}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {/* Editor Layout */}
          <EditorLayout
            isBaseResume={state.resume.is_base_resume}
            resume={state.resume}
            job={job}
            editorPanel={editorPanel}
            previewPanel={previewPanel}
            viewMode={viewMode}
          />
        </div>
      </EditorSectionProvider>
    </ResumeContext.Provider>
  );
} 
