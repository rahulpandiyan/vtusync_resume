import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-24 pb-16 md:pt-36 md:pb-24 px-6 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-100/50 to-transparent dark:from-zinc-900/50 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-10 relative z-10">
        {/* Release Badge */}
        <div className="flex justify-center animate-in fade-in slide-in-from-bottom-3 duration-1000">
          <div className="px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
            </span>
            ResuSync v2.0
          </div>
        </div>

        {/* Impactful Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.9] text-zinc-900 dark:text-zinc-50 animate-in fade-in slide-in-from-bottom-4 duration-1200 delay-100">
          Build your future<br />with AI
        </h1>

        {/* Clean Description */}
        <p className="text-base md:text-xl text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1400 delay-200">
          Create ATS-optimized tech resumes in under 10 minutes. <br className="hidden md:block" />
          <span className="text-zinc-900 dark:text-zinc-100 font-semibold">3x your interview chances</span> with AI-powered tailoring.
        </p>

        {/* Sleek CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1600 delay-300">
          <AuthDialog>
            <Button size="lg" className="h-12 px-10 text-sm font-semibold tracking-tight w-full sm:w-auto">
              Create My Resume
            </Button>
          </AuthDialog>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-12 px-10 text-sm font-semibold tracking-tight w-full sm:w-auto bg-transparent">
              See Features
            </Button>
          </Link>
        </div>

        {/* Minimalist Mockup Representation */}
        <div className="pt-20 px-4 animate-in fade-in slide-in-from-bottom-8 duration-2000 delay-500">
          <div className="relative max-w-4xl mx-auto group">
            {/* Main Window Mockup */}
            <div className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden aspect-[16/10]">
              {/* Toolbar */}
              <div className="h-10 border-b border-zinc-100 dark:border-zinc-900 flex items-center px-4 gap-2 bg-zinc-50/50 dark:bg-zinc-900/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                </div>
                <div className="mx-auto w-48 h-5 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md" />
              </div>
              
              {/* Content Mock */}
              <div className="p-8 flex gap-8 h-full">
                {/* Sidebar Mock */}
                <div className="w-1/4 space-y-4 border-r border-zinc-100 dark:border-zinc-900 pr-8">
                  <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-900 rounded-md" />
                  <div className="h-4 w-3/4 bg-zinc-50 dark:bg-zinc-900/50 rounded-md" />
                  <div className="pt-8 space-y-3">
                    <div className="h-2 w-full bg-zinc-50 dark:bg-zinc-900/30 rounded-full" />
                    <div className="h-2 w-full bg-zinc-50 dark:bg-zinc-900/30 rounded-full" />
                    <div className="h-2 w-2/3 bg-zinc-50 dark:bg-zinc-900/30 rounded-full" />
                  </div>
                </div>
                
                {/* Editor Mock */}
                <div className="flex-1 space-y-8">
                  <div className="h-10 w-1/3 bg-zinc-100 dark:bg-zinc-900 rounded-lg" />
                  <div className="space-y-4">
                    <div className="h-3 w-full bg-zinc-50 dark:bg-zinc-900/40 rounded-full" />
                    <div className="h-3 w-full bg-zinc-50 dark:bg-zinc-900/40 rounded-full" />
                    <div className="h-3 w-[85%] bg-zinc-50 dark:bg-zinc-900/40 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-24 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-100 dark:border-zinc-800" />
                    <div className="h-24 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-zinc-100 dark:border-zinc-800" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xl -z-10 rotate-12 transition-transform group-hover:rotate-6 duration-500" />
            <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-lg -z-10 -rotate-6 transition-transform group-hover:rotate-0 duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
} 