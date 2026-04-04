import Link from "next/link";
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
        <h1 className="text-5xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] leading-[0.9] text-zinc-900 dark:text-zinc-50 animate-in fade-in slide-in-from-bottom-4 duration-1200 delay-100">
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

      </div>
    </section>
  );
} 