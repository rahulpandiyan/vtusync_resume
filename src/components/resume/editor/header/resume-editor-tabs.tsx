'use client';

import { 
  User, 
  Briefcase, 
  FolderGit2, 
  GraduationCap, 
  Wrench, 
  LayoutTemplate,
  Award,
  FileText
} from "lucide-react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

export function ResumeEditorTabs() {
  return (
    <div className="my-3 w-full">
      <TabsList className="w-full bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-auto flex overflow-x-auto scrollbar-hide gap-1 shadow-sm justify-start sm:justify-between min-h-[40px]">
        {/* Basic Info Tab */}
        <TabsTrigger 
          value="basic" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <User className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-[#3861fb]" />
          <span>Info</span>
        </TabsTrigger>

        {/* Work Tab */}
        <TabsTrigger 
          value="work" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Briefcase className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-[#3861fb]" />
          <span>Work</span>
        </TabsTrigger>

        {/* Projects Tab */}
        <TabsTrigger 
          value="projects" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <FolderGit2 className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-[#3861fb]" />
          <span>Projects</span>
        </TabsTrigger>

        {/* Education Tab */}
        <TabsTrigger 
          value="education" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <GraduationCap className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-[#3861fb]" />
          <span>Education</span>
        </TabsTrigger>

        {/* Skills Tab */}
        <TabsTrigger 
          value="skills" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Wrench className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-[#3861fb]" />
          <span>Skills</span>
        </TabsTrigger>

        {/* Settings / Design Tab */}
        <TabsTrigger 
          value="settings" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <LayoutTemplate className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-[#3861fb]" />
          <span>Layout</span>
        </TabsTrigger>

        {/* Resume Score Tab */}
        <TabsTrigger 
          value="resume-score" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <Award className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-amber-500" />
          <span>Score</span>
        </TabsTrigger>

        {/* Cover Letter Tab */}
        <TabsTrigger 
          value="cover-letter" 
          className="group shrink-0 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all text-xs
            data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm
            data-[state=inactive]:text-zinc-500 dark:data-[state=inactive]:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
        >
          <FileText className="h-3.5 w-3.5 text-zinc-400 group-data-[state=active]:text-[#3861fb]" />
          <span>Letter</span>
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
