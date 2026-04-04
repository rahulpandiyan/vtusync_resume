'use client';

import { Profile } from "@/lib/types";
import { User, Briefcase, GraduationCap, Code, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileRowProps {
  profile: Profile;
}

export function ProfileRow({ profile }: ProfileRowProps) {
  return (
    <div className="relative border-b border-zinc-100 dark:border-zinc-900 pb-4 sm:pb-6 mb-4 sm:mb-6">
      <div className="flex flex-col gap-4">
        {/* Top Row: Avatar, Name, and Edit Button */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 h-12 w-12 sm:h-14 sm:w-14 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800">
              <User className="h-6 w-6 sm:h-7 sm:w-7 text-zinc-900 dark:text-zinc-100" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none truncate">
                {profile.first_name} {profile.last_name}
              </h3>
              <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400 truncate">
                Professional Profile
              </p>
            </div>
          </div>
          <Link href="/profile" className="shrink-0">  
            <Button
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 px-3 sm:px-4 rounded-md border-zinc-200 dark:border-zinc-800 font-semibold text-xs sm:text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
            >
              <Pencil className="h-3 w-3 sm:h-3.5 sm:w-3.5 mr-1.5 sm:mr-2" />
              <span className="hidden xs:inline">Edit</span>
            </Button>
          </Link>
        </div>

        {/* Stats Row - Horizontal scroll on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {[
            { 
              icon: Briefcase, 
              label: "Experience", 
              count: profile.work_experience.length,
            },
            { 
              icon: GraduationCap, 
              label: "Education", 
              count: profile.education.length,
            },
            { 
              icon: Code, 
              label: "Projects", 
              count: profile.projects.length,
            },
          ].map((stat) => (
            <div 
              key={stat.label} 
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all hover:border-zinc-300 dark:hover:border-zinc-700 shrink-0"
            >
              <stat.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-zinc-400" />
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{stat.count}</span>
                <span className="text-[9px] sm:text-[10px] font-medium text-zinc-400 hidden xs:inline">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 