import { Skeleton } from "@/components/ui/skeleton";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";

export default function ResumeEditorLoading() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden relative bg-white dark:bg-zinc-950">
      <div className="max-w-[2000px] mx-auto h-[calc(100vh-120px)] pt-4 px-4 sm:px-6 md:px-8">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-xl border border-zinc-200/80 dark:border-zinc-800/80 overflow-hidden">
          {/* Editor Panel */}
          <ResizablePanel defaultSize={40} minSize={30}>
            <div className="flex flex-col h-full bg-white dark:bg-zinc-950">
              {/* Editor Header Skeleton */}
              <div className="sticky top-0 z-20 space-y-3 backdrop-blur-sm bg-white/90 dark:bg-zinc-950/90 border-b border-zinc-200 dark:border-zinc-800 p-3.5">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-7 w-44 rounded-md" />
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-20 rounded-md" />
                  </div>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-16 shrink-0 rounded-md" />
                  ))}
                </div>
              </div>

              {/* Form Fields Skeleton */}
              <div className="flex-1 overflow-hidden p-4 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-3 bg-zinc-50/60 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 p-4 rounded-xl">
                    <Skeleton className="h-5 w-28 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-9 w-full rounded-md" />
                      <Skeleton className="h-16 w-full rounded-md" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Chatbot Skeleton */}
              <div className="mt-auto p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-7 w-7 rounded-lg" />
                    <Skeleton className="h-4 w-32 rounded-md" />
                  </div>
                  <Skeleton className="h-9 w-full rounded-lg" />
                </div>
              </div>
            </div>
          </ResizablePanel>

          {/* Resize Handle */}
          <ResizableHandle withHandle className="bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors" />

          {/* Preview Panel */}
          <ResizablePanel defaultSize={60} minSize={40}>
            <div className="h-full p-4 bg-zinc-100/50 dark:bg-zinc-900/30 overflow-hidden flex items-center justify-center">
              <div className="w-[85%] max-w-[620px] aspect-[1/1.414] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-md p-8 space-y-6">
                {/* Header */}
                <div className="space-y-2">
                  <Skeleton className="h-6 w-52 mx-auto rounded-md" />
                  <div className="flex justify-center gap-3">
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                    <Skeleton className="h-3.5 w-28 rounded-md" />
                  </div>
                </div>

                {/* Sections */}
                <div className="space-y-6">
                  {/* Experience */}
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-28 rounded-md" />
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between">
                          <Skeleton className="h-3.5 w-40 rounded-md" />
                          <Skeleton className="h-3 w-20 rounded-md" />
                        </div>
                        <Skeleton className="h-3 w-full rounded-md" />
                        <Skeleton className="h-3 w-4/5 rounded-md" />
                      </div>
                    ))}
                  </div>

                  {/* Education */}
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-24 rounded-md" />
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <Skeleton className="h-3.5 w-36 rounded-md" />
                        <Skeleton className="h-3 w-16 rounded-md" />
                      </div>
                      <Skeleton className="h-3 w-3/4 rounded-md" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
