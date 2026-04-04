'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  FileText, 
  User, 
  Settings, 
  Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/auth/logout-button";

const menuItems = [
  {
    label: "Home",
    icon: Home,
    href: "/home",
  },
  {
    label: "My Resumes",
    icon: FileText,
    href: "/resumes",
  },
  {
    label: "Profile",
    icon: User,
    href: "/profile",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-4 py-8 z-50">
      <div className="px-2 mb-10 text-zinc-900 dark:text-zinc-100">
        <Logo className="scale-100 origin-left" />
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50" 
                  : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900/50 dark:hover:text-zinc-100"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
        <Link 
          href="/subscription" 
          className="flex items-center gap-3 px-4 py-2.5 rounded-md bg-zinc-900 text-zinc-50 text-sm font-semibold hover:bg-zinc-800 transition-all dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Crown className="h-4 w-4" />
          <span>Upgrade to Pro</span>
        </Link>
        <LogoutButton className="w-full h-10 justify-start px-3 rounded-md text-sm font-medium text-zinc-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-all" />
      </div>
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-around px-2 z-50">
      {menuItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200",
              isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
            )}
          >
            <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
            <span className={cn(
              "text-[10px] font-medium",
              isActive ? "text-zinc-900 dark:text-zinc-50" : "text-zinc-400"
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
