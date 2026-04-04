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
      "flex h-full",
      // isBaseResume 
      //   ? "bg-gradient-to-br from-rose-50/50 via-sky-50/50 to-violet-50/50"
      //   : "bg-gradient-to-br from-pink-100/80 via-rose-50/80 to-pink-100/80"
    )}>
      {/* <BackgroundEffects isBaseResume={isBaseResume} /> */}
      
      <div className="w-full max-w-7xl mx-auto px-0 sm:px-6 py-0 sm:py-8 h-[calc(100vh-64px)] sm:h-full">
          <ResizablePanels
            isBaseResume={isBaseResume}
            editorPanel={editorPanel}
            previewPanel={previewPanel}
          />
      </div>
    </main>
  );
} 