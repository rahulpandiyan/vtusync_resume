import { cn } from "@/lib/utils";

interface BackgroundEffectsProps {
  className?: string;
  isBaseResume?: boolean;
}

export function BackgroundEffects({ className }: BackgroundEffectsProps) {
  return (
    <div className={cn("fixed inset-0 z-0 pointer-events-none overflow-hidden h-[calc(100vh)]", className)}>
      {/* Subtle clean neutral background */}
      <div className="absolute inset-0 bg-zinc-50/60 dark:bg-zinc-950/80" />
      
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:24px_24px] opacity-40 dark:opacity-20" />
    </div>
  );
}
