'use client';

import { Profile } from "@/lib/types";
import { User, Briefcase, GraduationCap, Code, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProfileRowProps {
  profile: Profile;
}

export function ProfileRow({ profile }: ProfileRowProps) {
  return (
    <div className="relative border-b border-zinc-100 dark:border-zinc-900 pb-10 mb-10">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        {/* Left section with avatar, name and stats */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-8 flex-1 min-w-0">
          {/* Avatar and Name group */}
          <div className="flex items-center gap-5">
            <div className="shrink-0 h-16 w-16 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center transition-all hover:bg-zinc-200 dark:hover:bg-zinc-800">
              <User className="h-8 w-8 text-zinc-900 dark:text-zinc-100" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none">
                {profile.first_name} {profile.last_name}
              </h3>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                Professional Profile
              </p>
            </div>
          </div>

          <div className="h-10 w-px bg-zinc-100 dark:bg-zinc-800 hidden lg:block mx-2" />

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-3">
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
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 transition-all hover:border-zinc-300 dark:hover:border-zinc-700"
              >
                <stat.icon className="h-4 w-4 text-zinc-400" />
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{stat.count}</span>
                  <span className="text-[10px] font-semibold text-zinc-400">{stat.label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Button */}
        <Link href="/profile" className="shrink-0 w-full md:w-auto">  
          <Button
            variant="outline"
            className="w-full md:w-auto h-10 px-6 rounded-md border-zinc-200 dark:border-zinc-800 font-semibold text-sm hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            <Pencil className="h-3.5 w-3.5 mr-2" />
            Edit Profile
          </Button>
        </Link>
      </div>
    </div>
  );
} 