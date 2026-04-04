import { cn } from "@/lib/utils";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { ReactNode, useRef, useState, useEffect } from "react";
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
  const [previewSize, setPreviewSize] = useState(60);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPercentageRef = useRef(60); // Store last percentage

  // Add function to calculate pixel width
  const updatePixelWidth = () => {
    const containerWidth = containerRef.current?.clientWidth || 0;
    const pixelWidth = Math.floor((containerWidth * lastPercentageRef.current) / 100);
    setPreviewSize(pixelWidth);
  };

  useEffect(() => {
    // Handle window resize
    const handleResize = () => updatePixelWidth();
    window.addEventListener('resize', handleResize);

    // Initial calculation
    updatePixelWidth();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div ref={containerRef} className="h-full relative flex flex-col">
      {/* Mobile Tab View */}
      <div className="lg:hidden flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 sm:rounded-xl sm:border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <Tabs defaultValue="edit" className="flex flex-col h-full">
          <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex justify-center">
            <TabsList className="grid w-full max-w-[400px] grid-cols-2 h-10 p-1 bg-zinc-100 dark:bg-zinc-800">
              <TabsTrigger value="edit" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <FileEdit className="h-3.5 w-3.5" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <Eye className="h-3.5 w-3.5" />
                Preview
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="edit" className="flex-1 overflow-y-auto m-0 p-0 focus-visible:ring-0">
             <div className="p-0 sm:p-6 pb-32">
                {editorPanel}
             </div>
          </TabsContent>
          
          <TabsContent value="preview" className="flex-1 overflow-y-auto m-0 p-0 focus-visible:ring-0 bg-zinc-100 dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="p-0 flex flex-col items-center justify-start min-h-full pb-32 scale-[0.95] origin-top sm:scale-100">
              {previewPanel(previewSize)}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop Resizable View */}
      <div className="hidden lg:block h-full">
        <ResizablePanelGroup
          direction="horizontal"
          className={cn(
            "relative h-full rounded-lg  ",
            isBaseResume
              ? "border-purple-200/40"
              : "border-pink-300/50"
          )}
        >
          {/* Editor Panel */}
          <ResizablePanel defaultSize={40} minSize={30} maxSize={70}>
            {editorPanel}
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
            onResize={(size) => {
              lastPercentageRef.current = size;
              updatePixelWidth();
            }}
            className={cn(
              "shadow-[0_0_30px_-5px_rgba(0,0,0,0.3)] overflow-y-scroll",
              isBaseResume
                ? "shadow-purple-200/50"
                : "shadow-pink-200/50"
            )}
          >
            {previewPanel(previewSize)}
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}