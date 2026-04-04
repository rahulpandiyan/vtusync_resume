import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { ResizablePanels } from "./ResizablePanels";

interface EditorLayoutProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
}

export function EditorLayout({
  isBaseResume,
  editorPanel,
  previewPanel
}: EditorLayoutProps) {
  return (
    <main className={cn(
      "flex h-full min-h-0 overflow-hidden w-full min-w-0",
    )}>
      <div className="w-full h-full overflow-hidden flex flex-col py-0 sm:py-2">
          <ResizablePanels
            isBaseResume={isBaseResume}
            editorPanel={editorPanel}
            previewPanel={previewPanel}
          />
      </div>
    </main>
  );
} 