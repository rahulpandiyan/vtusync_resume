'use client';

import { Resume, Profile, Job, DocumentSettings } from "@/lib/types";
import { Accordion } from "@/components/ui/accordion";
import { Suspense, useRef, useState } from "react";
import { TailoredJobAccordion } from "../../management/cards/tailored-job-card";
import { useEditorSection } from "../section-context";
import { BasicInfoForm } from "../forms/basic-info-form";
import ChatBot from "../../assistant/chatbot";
import { CoverLetterPanel } from "./cover-letter-panel";
import {
  WorkExperienceForm,
  EducationForm,
  SkillsForm,
  ProjectsForm,
  DocumentSettingsForm
} from '../dynamic-components';
import { ResumeEditorTabs } from "../header/resume-editor-tabs";
import ResumeScorePanel from "./resume-score-panel";
import { Briefcase } from "lucide-react";

interface EditorPanelProps {
  resume: Resume;
  profile: Profile;
  job: Job | null;
  isLoadingJob: boolean;
  onResumeChange: (field: keyof Resume, value: Resume[keyof Resume]) => void;
  showWatermark?: boolean;
}

export function EditorPanel({
  resume,
  profile,
  job,
  isLoadingJob,
  onResumeChange,
  showWatermark = false,
}: EditorPanelProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { section, setSection } = useEditorSection();
  const [, setActiveBullet] = useState<string>('');

  const handleFocusCapture = (event: React.FocusEvent) => {
    const el = event.target as HTMLElement;
    const value = el instanceof HTMLTextAreaElement || el instanceof HTMLInputElement
      ? el.value
      : '';
    if (value) setActiveBullet(value);
  };

  if (section === 'synkai') {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-zinc-950">
        {/* Mobile tabs */}
        <div className="p-2.5 lg:hidden print:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <ResumeEditorTabs value={section} onValueChange={setSection} variant="tabs" />
        </div>
        <div className="flex-1 min-h-0 overflow-hidden">
          <ChatBot
            resume={resume}
            onResumeChange={onResumeChange}
            job={job}
            standalone={true}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white dark:bg-zinc-950">
      {/* Scrollable form pane with native scrolling & ample bottom padding to avoid clipping */}
      <div 
        ref={scrollAreaRef}
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 sm:px-6 py-4 pb-36"
        onFocus={handleFocusCapture}
      >
        <div className="mx-auto w-full min-w-0 max-w-[580px] space-y-4">
          {/* Section tabs — shown below lg (rail takes over at lg) */}
          <div className="mb-2 lg:hidden print:hidden">
            <ResumeEditorTabs value={section} onValueChange={setSection} variant="tabs" />
          </div>

          {/* Job Context: Full accordion on basic info tab, or compact target banner on other tabs */}
          {section === 'basic' ? (
            <div>
              <Accordion type="single" collapsible defaultValue="basic">
                <TailoredJobAccordion
                  resume={resume}
                  job={job}
                  isLoading={isLoadingJob}
                />
              </Accordion>
            </div>
          ) : job ? (
            <div className="flex items-center justify-between rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-3 py-2 text-xs dark:border-zinc-800 dark:bg-zinc-900/50">
              <div className="flex items-center gap-2 truncate">
                <Briefcase className="h-3.5 w-3.5 text-[#3861fb] shrink-0" />
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{job.position_title}</span>
                {job.company_name && <span className="text-zinc-500 truncate">· {job.company_name}</span>}
              </div>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#3861fb] bg-[#3861fb]/10 px-2 py-0.5 rounded-full shrink-0">
                Target Job
              </span>
            </div>
          ) : null}

          {/* Section Forms */}
          <div>
            <Suspense fallback={
              <div className="space-y-4 animate-pulse">
                <div className="h-8 rounded-md bg-muted w-1/3" />
                <div className="h-24 rounded-md bg-muted" />
                <div className="h-24 rounded-md bg-muted" />
              </div>
            }>
              {section === 'basic' && <BasicInfoForm profile={profile} />}
              {section === 'work' && (
                <WorkExperienceForm
                  experiences={resume.work_experience}
                  onChange={(experiences) => onResumeChange('work_experience', experiences)}
                  profile={profile}
                  targetRole={resume.target_role}
                />
              )}
              {section === 'projects' && (
                <ProjectsForm
                  projects={resume.projects}
                  onChange={(projects) => onResumeChange('projects', projects)}
                  profile={profile}
                />
              )}
              {section === 'education' && (
                <EducationForm
                  education={resume.education}
                  onChange={(education) => onResumeChange('education', education)}
                  profile={profile}
                />
              )}
              {section === 'skills' && (
                <SkillsForm
                  skills={resume.skills}
                  onChange={(skills) => onResumeChange('skills', skills)}
                  profile={profile}
                />
              )}
              {section === 'settings' && (
                <DocumentSettingsForm
                  documentSettings={resume.document_settings!}
                  profile={profile}
                  showWatermark={showWatermark}
                  resumeId={resume.id}
                  onChange={(_field: 'document_settings', value: DocumentSettings) => {
                    onResumeChange('document_settings', value);
                  }}
                />
              )}
              {section === 'cover-letter' && (
                <CoverLetterPanel
                  resume={resume}
                  job={job}
                />
              )}
              {section === 'resume-score' && (
                <ResumeScorePanel
                  resume={resume}
                  job={job}
                />
              )}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
