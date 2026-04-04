'use client';

import { Resume, Profile, Job, DocumentSettings } from "@/lib/types";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Accordion } from "@/components/ui/accordion";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Suspense, useRef } from "react";
import { cn } from "@/lib/utils";
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
    <div className="flex flex-col lg:mr-4 relative h-full max-h-full min-h-0 w-full overflow-visible">
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <ScrollArea className="flex-1 lg:pr-2" ref={scrollAreaRef}>
          <div className="relative w-full min-w-0 px-3 sm:px-4 pb-32">
            <div className={cn(
              "sticky top-0 z-20 backdrop-blur-sm -mx-3 sm:-mx-4 px-3 sm:px-4 py-2 w-auto",
              resume.is_base_resume
                ? "bg-purple-50/80"
                : "bg-pink-100/90 shadow-sm shadow-pink-200/50"
            )}>
              <div className="flex flex-col gap-3 lg:gap-4">
                <ResumeEditorActions
                  onResumeChange={onResumeChange}
                  showWatermark={showWatermark}
                />
              </div>
            </div>


            {/* Tailored Job Accordion */}
            <Accordion type="single" collapsible defaultValue="basic" className="mt-4 lg:mt-6">
              <TailoredJobAccordion
                resume={resume}
                job={job}
                isLoading={isLoadingJob}
              />
            </Accordion>

            {/* Tabs */}  
            <Tabs defaultValue="basic" className="mt-4 mb-2 sm:mb-3 lg:mb-4 w-full min-w-0">
              <ResumeEditorTabs />

              {/* Basic Info Form */}
              <TabsContent value="basic" className="w-full min-w-0 overflow-visible">
                <BasicInfoForm
                  profile={profile}
                />
              </TabsContent>

              {/* Work Experience Form */}
              <TabsContent value="work" className="w-full min-w-0 overflow-visible">
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
              <TabsContent value="projects" className="w-full min-w-0 overflow-visible">
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
              <TabsContent value="education" className="w-full min-w-0 overflow-visible">
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
              <TabsContent value="skills" className="w-full min-w-0 overflow-visible">
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
              <TabsContent value="settings" className="w-full min-w-0 overflow-visible">
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
              <TabsContent value="cover-letter" className="w-full min-w-0 overflow-visible">
                <CoverLetterPanel
                  resume={resume}
                  job={job}
                />
              </TabsContent>


              {/* Resume Score Form */}
              <TabsContent value="resume-score" className="w-full min-w-0 overflow-visible">
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

      <div className={cn(
        "lg:relative lg:bottom-auto lg:left-auto lg:right-auto lg:z-50 lg:px-0 lg:pb-0", 
        "fixed bottom-16 left-0 right-0 z-50 px-2 sm:px-4 pb-2", 
        resume.is_base_resume
          ? "bg-purple-50/50 lg:bg-transparent"
          : "bg-pink-50/80 lg:bg-transparent"
      )}>
        <div className={cn(
          "lg:max-w-full rounded-lg border shadow-lg", 
          "max-w-md mx-auto rounded-lg border shadow-lg", 
          resume.is_base_resume
            ? "bg-purple-50/95 border-purple-200/40"
            : "bg-pink-50/95 border-pink-300/50 shadow-pink-200/20"
        )}>
          <ChatBot 
            resume={resume} 
            onResumeChange={onResumeChange}
            job={job}
          />
        </div>
      </div>
    </div>
  );
} 
