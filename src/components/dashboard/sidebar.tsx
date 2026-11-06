'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  UserCheck, 
  Settings, 
  Crown,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CreditCard,
  ChevronsUpDown,
  User as UserIcon,
  LogOut,
  ScanSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SidebarProps {
  user?: {
    email?: string | null;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
      name?: string;
    };
  } | null;
  isPro?: boolean;
}

const navSections = [
  {
    title: "Platform",
    items: [
      {
        label: "Overview",
        icon: LayoutDashboard,
        href: "/home",
      },
      {
        label: "My Resumes",
        icon: FileText,
        href: "/resumes",
      },
      {
        label: "Profile Builder",
        icon: UserCheck,
        href: "/profile",
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        label: "Resume Scanner",
        icon: ScanSearch,
        href: "/resume-scanner",
      },
      {
        label: "Plan & Billing",
        icon: CreditCard,
        href: "/subscription",
      },
      {
        label: "Settings",
        icon: Settings,
        href: "/settings",
      },
    ],
  },
];

export function DashboardSidebar({ user, isPro = false }: SidebarProps) {
  const pathname = usePathname();

  const userDisplayName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Student');
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 px-3.5 py-4 z-40 select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 pt-1 pb-4 border-b border-zinc-100 dark:border-zinc-900">
        <Logo asLink href="/home" badge="v2.0" />
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 space-y-6 pt-5 overflow-y-auto pr-1 -mr-1 scrollbar-none">
        {navSections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h4 className="px-3 text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
              {section.title}
            </h4>
            <div className="space-y-1 pt-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                      isActive 
                        ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-sm" 
                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/60 hover:text-zinc-900 dark:hover:text-zinc-100"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-4 w-4 transition-transform duration-150 group-hover:scale-105",
                        isActive 
                          ? "text-white dark:text-zinc-900" 
                          : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
                      )} />
                      <span>{item.label}</span>
                    </div>

                    {isActive && (
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 dark:bg-emerald-600 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Pro / Account Section */}
      <div className="mt-auto pt-3 space-y-2.5 border-t border-zinc-100 dark:border-zinc-900">
        {/* Pro Status Banner */}
        {isPro ? (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-zinc-800 dark:text-zinc-200">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-semibold">Pro Plan Active</span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
              Unlimited ATS resumes & multi-model AI.
            </p>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 text-white shadow-md border border-zinc-700/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-5 w-5 rounded-md bg-amber-400/20 text-amber-400 flex items-center justify-center">
                <Crown className="h-3.5 w-3.5" />
              </div>
              <span className="text-xs font-bold tracking-tight text-zinc-100">Upgrade to Pro</span>
            </div>
            <p className="text-[11px] text-zinc-300 leading-snug mb-2.5">
              Unlimited AI resumes, ATS scoring & custom job matching.
            </p>
            <Link 
              href="/subscription" 
              className="inline-flex items-center justify-center w-full py-1.5 px-3 rounded-lg bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-bold transition-all shadow-sm active:scale-[0.98]"
            >
              <span>Unlock Unlimited</span>
              <ChevronRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
        )}

        {/* Shadcn UI Sidebar User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-left border border-zinc-200/60 dark:border-zinc-800/60 focus:outline-none focus:ring-1 focus:ring-zinc-400 group">
              <Avatar className="h-8 w-8 rounded-lg shrink-0 border border-zinc-200 dark:border-zinc-800">
                <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                <AvatarFallback className="rounded-lg text-xs font-bold bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-xs leading-tight min-w-0">
                <span className="truncate font-semibold text-zinc-900 dark:text-zinc-100">
                  {userDisplayName}
                </span>
                <span className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                  {user?.email || 'Student Account'}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto h-4 w-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-1.5" align="start" side="top" sideOffset={8}>
            <DropdownMenuLabel className="font-normal px-2 py-1.5">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-none truncate">
                  {userDisplayName}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="my-1" />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-xs px-2 py-1.5 rounded-md">
                <UserIcon className="h-3.5 w-3.5 text-zinc-500" />
                <span>Profile Builder</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/resumes" className="flex items-center gap-2 cursor-pointer text-xs px-2 py-1.5 rounded-md">
                <FileText className="h-3.5 w-3.5 text-zinc-500" />
                <span>My Resumes</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/subscription" className="flex items-center gap-2 cursor-pointer text-xs px-2 py-1.5 rounded-md">
                <CreditCard className="h-3.5 w-3.5 text-zinc-500" />
                <span>Plan & Billing</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex items-center gap-2 cursor-pointer text-xs px-2 py-1.5 rounded-md">
                <Settings className="h-3.5 w-3.5 text-zinc-500" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1" />
            <div className="p-1">
              <LogoutButton 
                showText={true} 
                className="w-full justify-start h-8 px-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-700 rounded-md"
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  const mobileItems = [
    { label: "Home", icon: LayoutDashboard, href: "/home" },
    { label: "Resumes", icon: FileText, href: "/resumes" },
    { label: "Scanner", icon: ScanSearch, href: "/resume-scanner" },
    { label: "Profile", icon: UserCheck, href: "/profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <div className="lg:hidden fixed bottom-3 left-1/2 -translate-x-1/2 w-[94%] max-w-sm h-14 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl rounded-full flex items-center justify-around px-2 z-50">
      {mobileItems.map((item) => {
        const isActive = pathname === item.href || (item.href !== "/home" && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all duration-200 active:scale-95",
              isActive 
                ? "text-zinc-900 dark:text-zinc-50 font-semibold" 
                : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
            )}
          >
            <item.icon className={cn("h-4 w-4 transition-transform duration-200", isActive && "scale-110")} />
            <span className="text-[9px] mt-0.5 tracking-tight font-medium">
              {item.label}
            </span>
            {isActive && (
              <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            )}
          </Link>
        );
      })}
    </div>
  );
}