"use client"
import Image from "next/image";
import { motion } from "framer-motion";
import { Instagram, Globe } from "lucide-react";
export function CreatorStory() {
  return (
    <section className="py-24 md:py-32 relative bg-white dark:bg-zinc-950 scroll-mt-20" id="creator-story">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section heading */}
        <div className="text-center mb-20">
          <div className="flex justify-center mb-8">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
              The Story
            </span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
            Meet the creator
          </h2>
        </div>
        
        <div className="grid md:grid-cols-[400px_1fr] gap-12 md:gap-20 items-center">
          {/* Image Area */}
          <div className="relative mx-auto md:mx-0">
            <div className="relative aspect-square w-64 md:w-96 bg-zinc-50 dark:bg-zinc-900 p-2 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-xl">
              <div className="relative w-full h-full rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
                <Image
                  src="/alex.webp"
                  alt="Rahul, creator of ResuSync"
                  fill
                  sizes="(max-width: 768px) 256px, 384px"
                  className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  priority
                />
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="relative">
            <div className="space-y-8">
              <h3 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Why I built ResuSync
              </h3>
              
              <div className="space-y-6 text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                <p>
                  Hi, I&apos;m Rahul! I&apos;m a Computer Science student at VVIT, 
                  and like many of you, I&apos;ve experienced the stress of the tech job hunt.
                </p>
                
                <p>
                  I built ResuSync to be the tool I wished I had: a powerful, AI-driven resume builder that&apos;s 100% transparent and accessible to everyone. No hidden fees, no gatekeeping—just a better way to get hired.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="https://www.instagram.com/theonlyrahul.1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-md bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a 
                    href="https://vtusync.in" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-95"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 