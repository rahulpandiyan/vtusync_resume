import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactNode, useRef, useState, useEffect, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { FileEdit, Eye } from "lucide-react";

interface ResizablePanelsProps {
  isBaseResume: boolean;
  editorPanel: ReactNode;
  previewPanel: (width: number) => ReactNode;
}

export function ResizablePanels({
  isBaseResume,
  editorPanel,
  previewPanel
}: ResizablePanelsProps) {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const [mobileWidth, setMobileWidth] = useState(0);
  const [previewWidth, setPreviewWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const editorPanelRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<HTMLDivElement>(null);

  const updatePanelWidths = useCallback(() => {
    if (previewPanelRef.current) {
      const width = previewPanelRef.current.clientWidth;
      const scrollbarWidth = 16;
      const padding = 8;
      setPreviewWidth(Math.max(width - scrollbarWidth - padding, 280));
    }
  }, []);

  useEffect(() => {
    updatePanelWidths();
    
    const resizeObserver = new ResizeObserver(() => {
      updatePanelWidths();
    });

    if (previewPanelRef.current) {
      resizeObserver.observe(previewPanelRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [updatePanelWidths]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const updateMobileWidth = () => {
      setMobileWidth(window.innerWidth);
    };

    updateMobileWidth();
    
    const resizeObserver = new ResizeObserver(updateMobileWidth);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full relative flex flex-col min-w-0 w-full">
      {/* Mobile-Specific UI */}
      <div className="lg:hidden flex flex-col h-full bg-white dark:bg-zinc-950 overflow-hidden relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col h-full">
          {/* Mobile Navigation Header */}
          <div className="shrink-0 z-40 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 p-2">
            <TabsList className="grid w-full grid-cols-2 h-12 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-xl">
              <TabsTrigger 
                value="edit" 
                className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all"
              >
                <FileEdit className="h-4 w-4" />
                <span>Edit</span>
              </TabsTrigger>
              <TabsTrigger 
                value="preview" 
                className="flex items-center justify-center gap-2 text-sm font-semibold rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all"
              >
                <Eye className="h-4 w-4" />
                <span>Preview</span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {/* Scrollable Content Area */}
          <div className="flex-1 relative min-w-0 flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
             <TabsContent value="edit" className="flex-1 m-0 p-0 focus-visible:ring-0 data-[state=inactive]:hidden">
               <div className="h-full flex flex-col overflow-hidden">
                   {editorPanel}
                 </div>
             </TabsContent>
             
             <TabsContent value="preview" className="flex-1 m-0 overflow-y-auto focus-visible:ring-0 bg-zinc-50 dark:bg-zinc-950 data-[state=inactive]:hidden">
               <div className="h-full w-full flex items-start justify-center p-2">
                   {previewPanel(Math.max(mobileWidth - 32, 280))}
               </div>
             </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Desktop Resizable View */}
      <div className="hidden lg:block h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className={cn(
            "relative h-full rounded-lg",
            isBaseResume
              ? "border-purple-200/40"
              : "border-pink-300/50"
          )}
        >
          {/* Editor Panel */}
          <ResizablePanel 
            defaultSize={40} 
            minSize={30} 
            maxSize={70}
            onResize={updatePanelWidths}
          >
            <div ref={editorPanelRef} className="h-full w-full overflow-hidden">
              {editorPanel}
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle 
            withHandle 
            className={cn(
              isBaseResume
                ? "bg-purple-100/50 hover:bg-purple-200/50"
                : "bg-pink-200/50 hover:bg-pink-300/50 shadow-sm shadow-pink-200/20"
            )}
          />

          {/* Preview Panel */}
          <ResizablePanel 
            defaultSize={60} 
            minSize={30} 
            maxSize={70}
            onResize={updatePanelWidths}
            className={cn(
              "shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] overflow-hidden",
              isBaseResume
                ? "shadow-purple-200/50"
                : "shadow-pink-200/50"
            )}
          >
            <div ref={previewPanelRef} className="h-full w-full overflow-y-auto">
              {previewPanel(previewWidth)}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}