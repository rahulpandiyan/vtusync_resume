'use client';

import { cloneElement, isValidElement } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AuthTab, useAuthDialog } from "@/components/auth/auth-dialog-provider";

interface AuthDialogProps {
  children?: React.ReactNode;
  defaultTab?: AuthTab;
}

export function AuthDialog({ children, defaultTab = "signup" }: AuthDialogProps) {
  const { openDialog } = useAuthDialog();

  const handleOpen = () => {
    openDialog(defaultTab);
  };

  if (!children) {
    return (
      <Button
        size="lg"
        onClick={handleOpen}
        className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-semibold
          text-lg py-6 px-10 group relative transition-all duration-300
          rounded-md shadow-sm active:scale-95"
        aria-label="Open authentication dialog"
      >
        <span className="relative z-10 flex items-center justify-center">
          Start for Free
          <ArrowRight className="ml-2.5 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </span>
      </Button>
    );
  }

  if (typeof children === "string") {
    return (
      <button type="button" onClick={handleOpen}>
        {children}
      </button>
    );
  }

  if (isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler }>;

    return cloneElement(child, {
      ...child.props,
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented) {
          handleOpen();
        }
      },
    });
  }

  return (
    <span role="button" tabIndex={0} onClick={handleOpen} onKeyDown={(event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleOpen();
      }
    }}>
      {children}
    </span>
  );
}
