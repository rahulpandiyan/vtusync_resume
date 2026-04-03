import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

interface FooterProps {
  variant?: 'fixed' | 'static';
}

export function Footer({ variant = 'fixed' }: FooterProps) {
  if (variant === 'fixed') {
    return (
      <footer className="h-14 w-full border-t border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex h-full items-center justify-between gap-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            © 2025 ResuSync · Powered by VTUSync
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="mailto:help@vtusync.in" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors hidden sm:block">
              Support
            </Link>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <Link key={i} href="#" className="text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative z-10 bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-16 sm:py-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Big Brand Name */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 leading-none">
            ResuSync
          </h2>
          <p className="text-sm sm:text-base font-semibold tracking-widest uppercase text-zinc-400 dark:text-zinc-500 mt-2">
            Powered By VTUSync
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand description + socials */}
          <div className="sm:col-span-2 space-y-5">
            <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
              The world&apos;s most advanced AI-powered resume platform. Built for professionals who value precision and speed.
            </p>
            <div className="flex gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <Link key={i} href={i === 3 ? "mailto:help@vtusync.in" : "#"} className="w-9 h-9 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Product</h4>
            <ul className="space-y-3">
              {[
                { label: 'Features', href: '#features' },
                { label: 'How it works', href: '/how-it-works' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Blog', href: '/blog' },
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="mailto:help@vtusync.in" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}