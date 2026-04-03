'use client'
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AuthDialog } from "@/components/auth/auth-dialog";

import { usePathname, useRouter } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

function NavLink({ href, children, className, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      
      if (pathname !== '/') {
        router.push(`/${href}`);
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    onClick?.();
  };

  return (
    <a
      href={href.startsWith('#') && pathname !== '/' ? `/${href}` : href}
      onClick={handleClick}
      className={cn(
        "text-sm font-medium text-muted-foreground/90 hover:text-foreground transition-colors duration-200",
        className
      )}
    >
      {children}
    </a>
  );
}

const navItems = [
  { href: "#features", label: "Features" },
  { href: "/how-it-works", label: "How it Works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#creator-story", label: "About" },
  { href: "/blog", label: "Blog" },
];

export function NavLinks() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        {navItems.map((item) => (
          <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
        ))}
        <AuthDialog>
          <Button size="sm" className="h-8 px-4 text-xs font-semibold">
            Get Started
          </Button>
        </AuthDialog>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] border-l border-zinc-200 dark:border-zinc-800 p-0 bg-white dark:bg-zinc-950">
            <div className="p-6 flex flex-col gap-1">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                  Menu
                </SheetTitle>
              </SheetHeader>

              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="px-3 py-3 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  {item.label}
                </NavLink>
              ))}

              <div className="h-px bg-zinc-100 dark:bg-zinc-900 my-2" />

              <NavLink
                href="/privacy"
                onClick={() => setIsOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Privacy Policy
              </NavLink>
              <NavLink
                href="/terms"
                onClick={() => setIsOpen(false)}
                className="px-3 py-3 rounded-lg text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                Terms of Service
              </NavLink>

              <div className="h-px bg-zinc-100 dark:bg-zinc-900 my-4" />

              <AuthDialog>
                <Button
                  className="w-full h-11 text-sm font-semibold"
                  onClick={() => setIsOpen(false)}
                >
                  Get Started Free
                </Button>
              </AuthDialog>

              <p className="text-center text-xs text-zinc-400 mt-4">
                ResuSync · Powered by VTUSync
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}