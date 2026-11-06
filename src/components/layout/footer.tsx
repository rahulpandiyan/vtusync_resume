import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

interface FooterProps {
  variant?: 'fixed' | 'static';
}

export function Footer({ variant = 'static' }: FooterProps) {
  if (variant === 'fixed') {
    return (
      <footer className="h-14 w-full border-t border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md z-50 fixed bottom-0 left-0 right-0 safe-bottom">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex h-full items-center justify-between gap-4">
          <p className="text-xs font-medium text-zinc-500">
            © 2025 ResuSync · Powered by VTUSync
          </p>
          <div className="flex items-center gap-4">
            <Link href="mailto:help@vtusync.in" className="text-xs font-medium text-zinc-500 hover:text-zinc-950 dark:hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 py-16 sm:py-20 px-4 sm:px-6 bg-white dark:bg-zinc-950 relative z-20 mt-12 sm:mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-12 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-zinc-950 dark:text-zinc-50 leading-none">
              ResuSync
            </h2>
            <p className="text-sm text-zinc-500 mt-2 font-medium">
              Free AI-powered resume engineering for software developers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {[
              { icon: Twitter, href: "#", label: "Twitter" },
              { icon: Github, href: "https://github.com/rahul/resusync", label: "GitHub" },
              { icon: Linkedin, href: "#", label: "LinkedIn" },
              { icon: Mail, href: "mailto:help@vtusync.in", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <Link 
                key={label} 
                href={href} 
                aria-label={label}
                className="w-9 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-zinc-950 dark:hover:text-white hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors btn-press"
              >
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>© 2025 ResuSync · An open-source project by VTUSync</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="mailto:help@vtusync.in" className="hover:text-zinc-950 dark:hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
