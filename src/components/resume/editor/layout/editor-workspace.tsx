'use client';

import { ReactNode, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileEdit, Eye, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorRail } from "./editor-rail";
import type { Resume, Job } from "@/lib/types";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import ChatBot from "../../assistant/chatbot";
import ResumeScorePanel from "../panels/resume-score-panel";
import { useEditorSection } from "../section-context";
import { useResumeContext } from "../resume-editor-context";

interface EditorWorkspaceProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
  rail?: ReactNode;
  resume: Resume;
  job?: Job | null;
  viewMode?: 'split' | 'form' | 'preview';
}

/**
 * Modern Responsive Resume Editor Workspace:
 *   Desktop (lg+) → Section Rail (collapsible) | Field Pane | Live Preview Stage with View Modes
 *   Mobile (< lg) → Smooth segmented control (Editor / Preview) + Bottom Sheets for SyncAI & ATS Score
 */
export function EditorWorkspace({
  editorPanel,
  previewPanel,
  resume,
  job,
  viewMode = 'split',
}: EditorWorkspaceProps) {
  const { isSyncAiOpen, setIsSyncAiOpen, isScoreOpen, setIsScoreOpen } = useEditorSection();
  const { dispatch } = useResumeContext();

  const [activeTab, setActiveTab] = useState<string>("edit");
  const [mobileWidth, setMobileWidth] = useState(390);
  const [isRailCollapsed, setIsRailCollapsed] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const [previewWidth, setPreviewWidth] = useState(600);

  useEffect(() => {
    const updateMobile = () => setMobileWidth(window.innerWidth);
    updateMobile();
    const ro = new ResizeObserver(updateMobile);
    ro.observe(document.body);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const measure = () => {
      if (previewRef.current) {
        const w = previewRef.current.clientWidth;
        setPreviewWidth(Math.max(w, 280));
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (previewRef.current) ro.observe(previewRef.current);
    return () => ro.disconnect();
  }, [viewMode, isRailCollapsed]);

  return (
    <div className="relative flex h-full min-w-0 w-full flex-col overflow-hidden">
      {/* Mobile: Editor / Preview segmented control */}
      <div className="shrink-0 border-b border-zinc-200 bg-white px-3 pb-2 pt-2 dark:border-zinc-800 dark:bg-zinc-950 lg:hidden print:hidden select-none">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid h-10 w-full grid-cols-2 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-900">
            <TabsTrigger
              value="edit"
              className="flex h-full items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
            >
              <FileEdit className="h-3.5 w-3.5" />
              <span>Editor</span>
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="flex h-full items-center justify-center gap-1.5 rounded-md text-xs font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-100"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="m-0 h-[calc(100dvh-108px)] data-[state=inactive]:hidden">
            {editorPanel}
          </TabsContent>
          <TabsContent value="preview" className="m-0 h-[calc(100dvh-108px)] overflow-hidden data-[state=inactive]:hidden">
            <div className="h-full w-full">
              {previewPanel(Math.max(mobileWidth, 280))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Workspace: Collapsible Rail | Form Pane | Preview Stage */}
      <div className="hidden h-full min-h-0 min-w-0 flex-1 lg:flex overflow-hidden">
        {/* Section rail */}
        <aside
          className={cn(
            "shrink-0 min-h-0 border-r border-zinc-200 bg-zinc-50/80 dark:border-zinc-800 dark:bg-zinc-900/40 print:hidden transition-all duration-200 select-none",
            isRailCollapsed ? "w-14" : "w-52"
          )}
        >
          <div className="flex h-full flex-col overflow-y-auto">
            <EditorRail
              resume={resume}
              isCollapsed={isRailCollapsed}
              onToggleCollapse={() => setIsRailCollapsed((c) => !c)}
            />
          </div>
        </aside>

        {/* Field pane */}
        <div
          className={cn(
            "min-h-0 overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-200",
            viewMode === 'preview' && "hidden",
            viewMode === 'form' && "flex-1 flex justify-center",
            viewMode === 'split' && "w-[460px] xl:w-[500px] 2xl:w-[540px] shrink-0 border-r border-zinc-200 dark:border-zinc-800"
          )}
        >
          <div className={cn("h-full w-full", viewMode === 'form' && "max-w-2xl")}>
            {editorPanel}
          </div>
        </div>

        {/* Preview stage */}
        <div
          ref={previewRef}
          className={cn(
            "min-h-0 min-w-0 flex-1 bg-zinc-100/80 dark:bg-zinc-950 flex flex-col relative print:overflow-visible transition-all duration-200",
            viewMode === 'form' && "hidden"
          )}
        >
          {previewPanel(previewWidth)}
        </div>
      </div>

      {/* Mobile Floating Action Pills (SyncAI & ATS Score) */}
      <div className="lg:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 print:hidden pointer-events-auto">
        <button
          onClick={() => setIsScoreOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white/95 dark:bg-zinc-900/95 border border-zinc-200/90 dark:border-zinc-800 shadow-lg text-xs font-semibold text-zinc-800 dark:text-zinc-200 backdrop-blur-md active:scale-95 transition-all"
        >
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>Score</span>
        </button>

        <button
          onClick={() => setIsSyncAiOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#3861fb] text-white shadow-lg text-xs font-semibold hover:bg-[#2b50ea] active:scale-95 transition-all shadow-[#3861fb]/25"
        >
          <span className="relative flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-white">
            <Image
              src="/favicon-16x16.png"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-cover"
            />
          </span>
          <span>SyncAI</span>
        </button>
      </div>

      {/* Mobile Bottom Sheet: SyncAI Copilot */}
      <Sheet open={isSyncAiOpen} onOpenChange={setIsSyncAiOpen}>
        <SheetContent
          side="bottom"
          className="h-[88dvh] max-h-[88dvh] p-0 flex flex-col bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 rounded-t-3xl overflow-hidden shadow-2xl"
        >
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <ChatBot
              resume={resume}
              onResumeChange={(field, val) => dispatch({ type: 'UPDATE_FIELD', field, value: val })}
              job={job}
              standalone={true}
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* Mobile Bottom Sheet: ATS Resume Score */}
      <Sheet open={isScoreOpen} onOpenChange={setIsScoreOpen}>
        <SheetContent
          side="bottom"
          className="h-[85dvh] max-h-[85dvh] p-0 flex flex-col bg-white dark:bg-zinc-950 border-t border-zinc-200 dark:border-zinc-800 rounded-t-3xl overflow-hidden shadow-2xl"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500">
                <Award className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">ATS Resume Score</h3>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">Recruiter pass-rate & role calibration</p>
              </div>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 pb-12 custom-scrollbar">
            <ResumeScorePanel resume={resume} job={job} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
