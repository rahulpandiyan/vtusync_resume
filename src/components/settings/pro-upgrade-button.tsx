'use client';

import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProUpgradeButtonProps {
  className?: string;
}

export function ProUpgradeButton({ className }: ProUpgradeButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn("relative group", className)}
    >
      <Link 
        href="/subscription" 
        className={cn(
          "relative flex items-center gap-1.5 px-4 py-1.5",
          "bg-zinc-900 dark:bg-zinc-50",
          "text-zinc-50 dark:text-zinc-900 font-medium rounded-lg",
          "shadow-sm hover:shadow-md",
          "transition-all duration-200",
          "hover:bg-zinc-800 dark:hover:bg-zinc-200",
          "text-sm"
        )}
      >
        <Sparkles className="h-4 w-4" />
        <span>Upgrade to Pro</span>
      </Link>
    </motion.div>
  );
} 