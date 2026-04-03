'use client';

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  asLink?: boolean;
}

export function Logo({ className, asLink = true }: LogoProps) {
  const logoContent = (
    <div className={cn("flex items-center gap-2 group", className)}>
      <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-950 font-bold text-lg select-none transition-all group-hover:scale-105 active:scale-95">
        R
      </div>
      <span className="text-xl font-bold tracking-tight flex items-center">
        <span className="text-zinc-900 dark:text-zinc-50">Resu</span>
        <span className="text-zinc-400 dark:text-zinc-500 font-medium">Sync</span>
      </span>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" aria-label="ResuSync Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}