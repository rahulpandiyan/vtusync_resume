'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronRight, 
  Plus, 
  Sparkles, 
  User as UserIcon, 
  Settings, 
  CreditCard, 
  LogOut,
  SlidersHorizontal,
  FileText
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
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

export function Navbar({ user, isPro = false }: NavbarProps) {
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    if (path === "/home" || path === "/") return "Overview";
    if (path.startsWith("/resumes/new")) return "New Resume";
    if (path.startsWith("/resumes/")) return "Resume Editor";
    if (path.startsWith("/resumes")) return "My Resumes";
    if (path.startsWith("/profile")) return "Profile Builder";
    if (path.startsWith("/subscription")) return "Plan & Billing";
    if (path.startsWith("/resume-scanner")) return "Resume Scanner";
    if (path.startsWith("/settings")) return "Settings";
    return "Dashboard";
  };

  const userDisplayName = user?.user_metadata?.full_name || user?.user_metadata?.name || (user?.email ? user.email.split('@')[0] : 'Student');
  const userInitials = userDisplayName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-30 w-full h-14 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md px-4 sm:px-6">
      <div className="flex h-full items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Desktop Breadcrumb */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          <Link 
            href="/home" 
            className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-900 dark:text-zinc-100">
            {getPageTitle(pathname)}
          </span>
        </div>

        {/* Mobile Logo & Title */}
        <div className="flex lg:hidden items-center gap-3">
          <Logo asLink href="/home" className="scale-95" />
          <span className="text-xs font-semibold text-zinc-400">/</span>
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate max-w-[120px]">
            {getPageTitle(pathname)}
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Pro Status or Upgrade Pill */}
          {isPro ? (
            <Badge 
              variant="outline" 
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Pro Active
            </Badge>
          ) : (
            <Link href="/subscription" className="hidden sm:inline-flex">
              <Badge 
                variant="outline" 
                className="hover:bg-amber-500/10 cursor-pointer items-center gap-1 px-2.5 py-0.5 rounded-full border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400 text-[11px] font-semibold transition-all"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                Free Plan
              </Badge>
            </Link>
          )}

          {/* Quick Action Button */}
          <Link href="/resumes">
            <Button 
              size="sm" 
              className="h-8 px-3 rounded-lg text-xs font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-all shadow-sm active:scale-95"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              <span>Resume</span>
            </Button>
          </Link>

          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center rounded-full p-0.5 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-700 transition-all focus:outline-none"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-800">
                  <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
                  <AvatarFallback className="text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-1.5">
              <DropdownMenuLabel className="font-normal px-2 py-1.5">
                <div className="flex flex-col space-y-0.5">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-none truncate">
                    {userDisplayName}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                    {user?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center gap-2 cursor-pointer text-xs">
                  <UserIcon className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Profile Builder</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/resumes" className="flex items-center gap-2 cursor-pointer text-xs">
                  <FileText className="h-3.5 w-3.5 text-zinc-500" />
                  <span>My Resumes</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/subscription" className="flex items-center gap-2 cursor-pointer text-xs">
                  <CreditCard className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Plan & Billing</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer text-xs">
                  <Settings className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1" />
              <div className="px-1 py-1">
                <LogoutButton className="w-full justify-start h-8 px-2 text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md" />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}