'use client';

import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/auth/logout-button";

export function Navbar() {
  return (
    <nav className="h-14 border-b border-zinc-100 dark:border-zinc-900 sticky top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-[100] transition-all lg:hidden">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo asLink href="/home" className="scale-90 origin-left" />
        </div>
        
        <div className="flex items-center gap-2">
          <LogoutButton className="h-8 text-xs px-3 font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 border-none" />
        </div>
      </div>
    </nav>
  );
} 