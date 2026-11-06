import { ReactNode } from 'react';

/** Full-bleed editor window: it owns the whole viewport, outside the dashboard shell. */
export default function EditorRouteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-zinc-100 dark:bg-zinc-950">
      {children}
    </div>
  );
}
