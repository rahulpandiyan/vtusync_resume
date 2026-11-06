import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { EditorWorkspace } from "./editor-workspace";
import type { Resume, Job } from "@/lib/types";

interface EditorLayoutProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
  resume: Resume;
  job?: Job | null;
  viewMode?: 'split' | 'form' | 'preview';
}

export function EditorLayout({
  editorPanel,
  previewPanel,
  resume,
  job,
  viewMode = 'split',
}: EditorLayoutProps) {
  return (
    <main className={cn("flex h-full min-h-0 overflow-hidden w-full min-w-0")}>
      <EditorWorkspace
        isBaseResume={resume.is_base_resume}
        resume={resume}
        job={job}
        editorPanel={editorPanel}
        previewPanel={previewPanel}
        viewMode={viewMode}
      />
    </main>
  );
}
