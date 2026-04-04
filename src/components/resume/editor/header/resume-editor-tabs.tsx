'use client';

import { User, Briefcase, FolderGit2, GraduationCap, Wrench, LayoutTemplate } from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeEditorTabs() {
  return (
    <>
      {/* Enhanced second row with Resume Score and Cover Letter */}
      <div className="my-2">
        <TabsList className="h-full w-full relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-lg overflow-hidden grid grid-cols-2 gap-0.5 p-0.5 shadow-lg">
          
          {/* Resume Score */}
          <TabsTrigger 
            value="resume-score" 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all duration-200
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
              <svg className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <span className="text-sm">
              Resume Score
            </span>
          </TabsTrigger>

          {/* Cover Letter */}
          <TabsTrigger 
            value="cover-letter" 
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all duration-200
              data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
              data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
          >
            <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
              <svg className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <line x1="10" y1="9" x2="8" y2="9"/>
              </svg>
            </div>
            <span className="text-sm">
              Cover Letter
            </span>
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsList className="h-full w-full relative bg-white/80 backdrop-blur-xl border border-white/40 rounded-lg flex overflow-x-auto scrollbar-hide items-center gap-1 p-1 shadow-lg justify-start sm:justify-center">
        {/* Basic Info Tab */}
        <TabsTrigger 
          value="basic" 
          className="group shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md font-medium transition-all duration-200
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
        >
          <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
            <User className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
          </div>
          <span className="text-xs">
            Basic Info
          </span>
        </TabsTrigger>

        {/* Work Tab */}
        <TabsTrigger 
          value="work" 
          className="group shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md font-medium transition-all duration-200
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
        >
          <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
            <Briefcase className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
          </div>
          <span className="text-xs">
            Work
          </span>
        </TabsTrigger>

        {/* Projects Tab */}
        <TabsTrigger 
          value="projects" 
          className="group shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md font-medium transition-all duration-200
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
        >
          <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
            <FolderGit2 className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
          </div>
          <span className="text-xs">
            Projects
          </span>
        </TabsTrigger>

        {/* Education Tab */}
        <TabsTrigger 
          value="education" 
          className="group shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md font-medium transition-all duration-200
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
        >
          <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
            <GraduationCap className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
          </div>
          <span className="text-xs">
            Education
          </span>
        </TabsTrigger>

        {/* Skills Tab */}
        <TabsTrigger 
          value="skills" 
          className="group shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md font-medium transition-all duration-200
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
        >
          <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
            <Wrench className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
          </div>
          <span className="text-xs">
            Skills
          </span>
        </TabsTrigger>

        {/* Settings Tab */}
        <TabsTrigger 
          value="settings" 
          className="group shrink-0 flex items-center gap-1.5 px-2 py-1 rounded-md font-medium transition-all duration-200
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 data-[state=inactive]:hover:text-zinc-900 dark:data-[state=inactive]:hover:text-zinc-100"
        >
          <div className="p-1 rounded-md transition-colors duration-200 group-data-[state=active]:bg-zinc-100 dark:group-data-[state=active]:bg-zinc-800">
            <LayoutTemplate className="h-3.5 w-3.5 text-zinc-500 group-data-[state=active]:text-zinc-900 dark:group-data-[state=active]:text-zinc-100 transition-colors" />
          </div>
          <span className="text-xs">
            Layout
          </span>
        </TabsTrigger>
      </TabsList>

    
    </>
  );
} 