'use client';

import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface SettingsButtonProps {
  className?: string;
  onAllowedNavigation?: () => void;
}

export function SettingsButton({ className, onAllowedNavigation }: SettingsButtonProps) {
  const handleClick = () => {
    onAllowedNavigation?.();
  };

  return (
    <Link 
      href="/settings" 
      onClick={handleClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1",
        "text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
        "transition-colors duration-200",
        className
      )}
    >
      <Settings className="h-4 w-4" />
      <span className="hidden sm:inline">Settings</span>
    </Link>
  );
}
