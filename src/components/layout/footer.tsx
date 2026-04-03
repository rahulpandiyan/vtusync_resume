import Link from "next/link";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

interface FooterProps {
  variant?: 'fixed' | 'static';
}

export function Footer({ variant = 'fixed' }: FooterProps) {
  if (variant === 'fixed') {
    return (
      <footer className="h-14 w-full border-t border-zinc-100 dark:border-zinc-900 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-6 flex h-full items-center justify-between gap-4">
          <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            © 2025 ResuSync
          </p>
          <div className="flex items-center gap-6">
            <Link href="mailto:support@resusync.ai" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
              Support
            </Link>
            <div className="flex items-center gap-4">
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
    <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex flex-col gap-1">
            <h1 className="text-4xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50">ResuSync</h1>
            <p className="text-sm font-semibold tracking-wide uppercase text-zinc-500">Powered By VTUSync</p>
          </div>
          <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
            The world&apos;s most advanced AI-powered resume platform. Built for professionals who value precision and speed.
          </p>
          <div className="flex gap-4">
            {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
              <Link key={i} href="#" className="w-9 h-9 flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:border-zinc-400 dark:hover:border-zinc-600 transition-all">
                <Icon className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Product</h4>
          <ul className="space-y-3">
            {['Features', 'Templates', 'How it works'].map(item => (
              <li key={item}>
                <Link href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Legal</h4>
          <ul className="space-y-3">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <li key={item}>
                <Link href="#" className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-zinc-100 dark:border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="text-xs font-medium text-zinc-400 dark:text-zinc-500">
          © 2025 ResuSync Engine. All rights reserved.
        </p>
        <div className="flex gap-8">
          <Link href="#" className="text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Status
          </Link>
          <Link href="#" className="text-xs font-medium text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  );
} 