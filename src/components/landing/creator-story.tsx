"use client"
import Image from "next/image";
import { motion } from "framer-motion";

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
                  alt="Alex, creator of ResuSync"
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
                  Hi, I&apos;m Alex! I&apos;m a Computer Science student at UBC, 
                  and like many of you, I&apos;ve experienced the stress of the tech job hunt.
                </p>
                
                <p>
                  I built ResuSync to be the tool I wished I had: a powerful, AI-driven resume builder that&apos;s 100% transparent and accessible to everyone. No hidden fees, no gatekeeping—just a better way to get hired.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a 
                    href="https://x.com/alexfromvan" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-md bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-950 text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    Follow on X
                  </a>
                  <a 
                    href="https://github.com/olyaiy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 px-6 py-2.5 rounded-md bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-800 text-sm font-semibold transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900 active:scale-95"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub
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