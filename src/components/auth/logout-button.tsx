'use client';

import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { logout } from "@/app/auth/login/actions";

interface LogoutButtonProps {
  className?: string;
  showText?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  children?: React.ReactNode;
}

export function LogoutButton({ 
  className, 
  showText = true, 
  variant = "ghost",
  children 
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      setIsLoading(true);
      await logout();
    } catch {
      toast({
        title: "Error signing out",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      className={cn(
        "flex items-center gap-2 transition-colors duration-150",
        className
      )}
      onClick={handleLogout}
      disabled={isLoading}
      title="Sign out"
    >
      <LogOut className={cn("h-4 w-4 shrink-0", isLoading && "animate-spin")} />
      {children ? (
        children
      ) : showText ? (
        <span>{isLoading ? 'Signing out...' : 'Sign out'}</span>
      ) : null}
    </Button>
  );
}