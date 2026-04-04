import { ReactNode } from "react";

export default function ResumeEditorLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen lg:h-[calc(100vh-2px)] w-full overflow-hidden relative">
      <div className="relative z-10 w-full h-full flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
} 