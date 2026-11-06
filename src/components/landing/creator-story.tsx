"use client";

import Image from "next/image";
import { Instagram, Globe, GraduationCap, Code2, Users } from "lucide-react";
import Magnet from "@/components/Magnet";

export function CreatorStory() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 max-w-6xl mx-auto scroll-mt-20" id="about">
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 p-6 sm:p-10 md:p-12 overflow-hidden relative shadow-sm">
        
        <div className="grid md:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Creator Portrait Column */}
          <div className="md:col-span-5 flex flex-col items-center md:items-start space-y-4">
            <Magnet magnetStrength={2} padding={20} tilt={8} scale={1.02}>
              <div className="relative aspect-square w-48 sm:w-60 md:w-64 rounded-2xl overflow-hidden border border-zinc-200/80 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm cursor-pointer">
                <Image
                  src="/alex.webp"
                  alt="Rahul, creator of ResuSync"
                  fill
                  sizes="(max-width: 768px) 192px, 256px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  priority
                  unoptimized
                />
              </div>
            </Magnet>
            
            {/* Quick Badges */}
            <div className="flex flex-wrap gap-2 text-xs text-zinc-600 dark:text-zinc-400 font-medium justify-center md:justify-start">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
                <GraduationCap className="w-3.5 h-3.5 text-zinc-500" />
                VVIT CS Student
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-zinc-800 border border-zinc-200/80 dark:border-zinc-700 shadow-sm">
                <Code2 className="w-3.5 h-3.5 text-blue-600" />
                VTUSync Builder
              </span>
            </div>
          </div>

          {/* Narrative Column */}
          <div className="md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>THE FOUNDER STORY</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-snug">
              Built by a CS student to solve real tech hiring friction.
            </h2>

            <div className="space-y-3 text-xs sm:text-sm md:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              <p>
                Hi, I&apos;m Rahul! While studying Computer Science at VVIT, I watched talented classmates with incredible coding projects get ghosted or rejected simply because automated ATS software couldn&apos;t parse two-column templates or match the exact syntax in job requisitions.
              </p>
              <p>
                Most commercial resume tools locked simple downloads behind recurring monthly billing traps. I built ResuSync to give developers the unfair advantage they deserve: clean, single-column UTF-8 layouts with AI-powered keyword alignment that passes ATS filters on the very first try.
              </p>
            </div>

            {/* Subtle, refined Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.instagram.com/theonlyrahul.1"
                target="_blank"
                rel="noopener noreferrer"
                className="subtle-3d-btn inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Instagram className="w-4 h-4 text-white" />
                Instagram @theonlyrahul.1
              </a>
              <a
                href="https://vtusync.in"
                target="_blank"
                rel="noopener noreferrer"
                className="subtle-3d-btn-white inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold cursor-pointer"
              >
                <Globe className="w-4 h-4 text-zinc-700 dark:text-zinc-300" />
                VTUSync.in
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
