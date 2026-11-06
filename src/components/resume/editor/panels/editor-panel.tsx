'use client';

import { Resume, Profile, Job, DocumentSettings } from "@/lib/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Suspense, useRef } from "react";
import { ResumeEditorActions } from "../actions/resume-editor-actions";
import { TailoredJobAccordion } from "../../management/cards/tailored-job-card";
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

  return (
    <div className="flex flex-col relative h-full max-h-full min-h-0 w-full overflow-hidden bg-white dark:bg-zinc-950">
      {/* Scrollable Form Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea className="flex-1" ref={scrollAreaRef}>
          <div className="relative w-full min-w-0 px-3 sm:px-5 pb-8">
            {/* Clean Sticky Actions Bar */}
            <div className="sticky top-0 z-20 backdrop-blur-md bg-white/95 dark:bg-zinc-950/95 border-b border-zinc-200/80 dark:border-zinc-800/80 -mx-3 sm:-mx-5 px-3 sm:px-5 py-2.5 shadow-sm">
              <ResumeEditorActions
                onResumeChange={onResumeChange}
                showWatermark={showWatermark}
              />
            </div>

            {/* Tailored Job Accordion (if tailored resume) */}
            <Accordion type="single" collapsible defaultValue="basic" className="mt-3">
              <TailoredJobAccordion
                resume={resume}
                job={job}
                isLoading={isLoadingJob}
              />
            </Accordion>

            {/* Tabs for Forms */}  
            <Tabs defaultValue="basic" className="mt-2 mb-4 w-full min-w-0">
              <ResumeEditorTabs />

              {/* Basic Info Form */}
              <TabsContent value="basic" className="w-full min-w-0 mt-0 outline-none">
                <BasicInfoForm
                  profile={profile}
                />
              </TabsContent>

              {/* Work Experience Form */}
              <TabsContent value="work" className="w-full min-w-0 mt-0 outline-none">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <WorkExperienceForm
                    experiences={resume.work_experience}
                    onChange={(experiences) => onResumeChange('work_experience', experiences)}
                    profile={profile}
                    targetRole={resume.target_role}
                  />
                </Suspense>
              </TabsContent>

              {/* Projects Form */}
              <TabsContent value="projects" className="w-full min-w-0 mt-0 outline-none">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <ProjectsForm
                    projects={resume.projects}
                    onChange={(projects) => onResumeChange('projects', projects)}
                    profile={profile}
                  />
                </Suspense>
              </TabsContent>

              {/* Education Form */}
              <TabsContent value="education" className="w-full min-w-0 mt-0 outline-none">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <EducationForm
                    education={resume.education}
                    onChange={(education) => onResumeChange('education', education)}
                    profile={profile}
                  />
                </Suspense>
              </TabsContent>

              {/* Skills Form */}
              <TabsContent value="skills" className="w-full min-w-0 mt-0 outline-none">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <SkillsForm
                    skills={resume.skills}
                    onChange={(skills) => onResumeChange('skills', skills)}
                    profile={profile}
                  />
                </Suspense>
              </TabsContent>

              {/* Document Settings Form */}
              <TabsContent value="settings" className="w-full min-w-0 mt-0 outline-none">
                <Suspense fallback={
                  <div className="space-y-4 animate-pulse">
                    <div className="h-8 bg-muted rounded-md w-1/3" />
                    <div className="h-24 bg-muted rounded-md" />
                  </div>
                }>
                  <DocumentSettingsForm
                    documentSettings={resume.document_settings!}
                    profile={profile}
                    showWatermark={showWatermark}
                    resumeId={resume.id}
                    onChange={(_field: 'document_settings', value: DocumentSettings) => {
                      onResumeChange('document_settings', value);
                    }}
                  />
                </Suspense>
              </TabsContent>

              {/* Cover Letter Form */}
              <TabsContent value="cover-letter" className="w-full min-w-0 mt-0 outline-none">
                <CoverLetterPanel
                  resume={resume}
                  job={job}
                />
              </TabsContent>

              {/* Resume Score Form */}
              <TabsContent value="resume-score" className="w-full min-w-0 mt-0 outline-none">
                <ResumeScorePanel
                  resume={resume}
                  job={job}
                />
              </TabsContent>
            </Tabs>
          </div>
          <ScrollBar orientation="vertical" className="w-2" />
        </ScrollArea>
      </div>

      {/* Docked AI Resume Copilot at bottom of editor */}
      <div className="shrink-0 z-30 px-3 sm:px-4 py-2 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/50 backdrop-blur-sm">
        <ChatBot 
          resume={resume} 
          onResumeChange={onResumeChange}
          job={job}
        />
      </div>
    </div>
  );
}
