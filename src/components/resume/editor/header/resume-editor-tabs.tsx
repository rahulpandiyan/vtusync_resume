'use client';

import { User, Briefcase, FolderGit2, GraduationCap, Wrench, LayoutTemplate } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeEditorTabs() {
  return (
    <>
      {/* Enhanced second row with Resume Score and Cover Letter */}
      <div className="my-2 lg:my-2">
        <TabsList className="h-full w-full relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-lg overflow-hidden grid grid-cols-2 gap-1.5 p-1 shadow-lg">
          
          {/* Resume Score */}
          <TabsTrigger 
            value="resume-score" 
            className="group flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-purple-100 dark:data-[state=active]:bg-purple-900/50 data-[state=active]:border data-[state=active]:border-purple-300 dark:data-[state=active]:border-purple-700 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <svg className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-purple-600 dark:group-data-[state=active]:text-purple-300 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Score</span>
          </TabsTrigger>

          {/* Cover Letter */}
          <TabsTrigger 
            value="cover-letter" 
            className="group flex items-center justify-center gap-1.5 px-3 py-2 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-pink-100 dark:data-[state=active]:bg-pink-900/50 data-[state=active]:border data-[state=active]:border-pink-300 dark:data-[state=active]:border-pink-700 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <svg className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-pink-600 dark:group-data-[state=active]:text-pink-300 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <line x1="10" y1="9" x2="8" y2="9"/>
            </svg>
            <span>Letter</span>
          </TabsTrigger>
        </TabsList>
      </div>

        {/* Edit Tabs - Compact with icons-only on mobile, show label for active tab */}
        <TabsList className="w-full relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-lg flex overflow-x-auto scrollbar-hide items-center gap-1 sm:gap-0.5 p-1 shadow-lg justify-start min-h-[44px]">
          {/* Basic Info Tab */}
          <TabsTrigger 
            value="basic" 
            className="group shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <User className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
            <span className="hidden sm:inline">Info</span>
            <span className="sm:hidden text-[10px] group-data-[state=inactive]:hidden">Info</span>
          </TabsTrigger>

          {/* Work Tab */}
          <TabsTrigger 
            value="work" 
            className="group shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <Briefcase className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
            <span className="hidden sm:inline">Work</span>
            <span className="sm:hidden text-[10px] group-data-[state=inactive]:hidden">Work</span>
          </TabsTrigger>

          {/* Projects Tab */}
          <TabsTrigger 
            value="projects" 
            className="group shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <FolderGit2 className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
            <span className="hidden sm:inline">Projects</span>
            <span className="sm:hidden text-[10px] group-data-[state=inactive]:hidden">Projects</span>
          </TabsTrigger>

          {/* Education Tab */}
          <TabsTrigger 
            value="education" 
            className="group shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <GraduationCap className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
            <span className="hidden sm:inline">Education</span>
            <span className="sm:hidden text-[10px] group-data-[state=inactive]:hidden">Education</span>
          </TabsTrigger>

          {/* Skills Tab */}
          <TabsTrigger 
            value="skills" 
            className="group shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <Wrench className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
            <span className="hidden sm:inline">Skills</span>
            <span className="sm:hidden text-[10px] group-data-[state=inactive]:hidden">Skills</span>
          </TabsTrigger>

          {/* Settings Tab */}
          <TabsTrigger 
            value="settings" 
            className="group shrink-0 flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-md font-medium transition-all duration-200 text-xs sm:text-sm
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <LayoutTemplate className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
            <span className="hidden sm:inline">Layout</span>
            <span className="sm:hidden text-[10px] group-data-[state=inactive]:hidden">Layout</span>
          </TabsTrigger>
        </TabsList>
    </>
  );
}