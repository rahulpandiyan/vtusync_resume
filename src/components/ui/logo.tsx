'use client';

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  asLink?: boolean;
  href?: string;
  badge?: string;
  iconOnly?: boolean;
}

export function Logo({ className, asLink = true, href = "/", badge, iconOnly }: LogoProps) {
  const logoContent = (
    <div className={cn("flex items-center gap-2.5 group cursor-pointer select-none", className)}>
      <div className="relative flex items-center justify-center w-8 h-8 rounded-full border border-zinc-200/80 dark:border-zinc-800 bg-zinc-900 shadow-sm overflow-hidden shrink-0 transition-transform duration-200 group-hover:scale-105">
        <Image
          src="/favicon-16x16.png"
          alt="ResuSync Logo"
          width={28}
          height={28}
          className="w-full h-full object-cover scale-110"
        />
      </div>
      {!iconOnly && (
        <div className="flex items-center gap-2">
          <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            ResuSync
          </span>
          {badge && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {badge}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link href={href} aria-label="ResuSync Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
