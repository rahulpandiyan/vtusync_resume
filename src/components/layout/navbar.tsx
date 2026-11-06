'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ChevronRight, 
  User as UserIcon, 
  Settings, 
  CreditCard, 
  FileText
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LogoutButton } from "@/components/auth/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarSrc } from "@/lib/avatar";
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

export function Navbar({ user }: NavbarProps) {
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

        {/* Mobile Logo (title removed — redundant with the page) */}
        <div className="flex lg:hidden items-center">
          <Logo asLink href="/home" className="scale-95" />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* User Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button 
                className="flex items-center rounded-full p-0.5 hover:ring-2 hover:ring-zinc-300 dark:hover:ring-zinc-700 transition-all focus:outline-none"
                aria-label="User menu"
              >
                <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-800">
                  <AvatarImage src={getAvatarSrc(user)} />
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