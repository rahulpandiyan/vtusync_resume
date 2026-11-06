'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { DashboardSidebar, MobileNav } from '@/components/dashboard/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { useSidebarCollapse } from '@/components/dashboard/sidebar-collapse';

interface DashboardShellProps {
  user: {
    email?: string | null;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      name?: string;
    };
  } | null;
  isPro?: boolean;
  children: ReactNode;
}

export function DashboardShell({ user, isPro = false, children }: DashboardShellProps) {
  const { collapsed } = useSidebarCollapse();

  return (
    <div className="flex min-h-screen bg-zinc-50/50 dark:bg-zinc-950 antialiased text-zinc-900 dark:text-zinc-100 selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 print:block">
      <DashboardSidebar user={user} isPro={isPro} />
      <div
        className={cn(
          'flex-1 flex flex-col pb-20 lg:pb-0 min-w-0 transition-[padding-left] duration-200 print:pl-0',
          collapsed ? 'lg:pl-16' : 'lg:pl-64'
        )}
      >
        <Navbar user={user} isPro={isPro} />
        <main className="flex-1 w-full relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 w-full min-h-full">
            {children}
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
