'use client';

import { cloneElement, isValidElement } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type AuthTab = "login" | "signup";

interface AuthDialogProps {
  children?: React.ReactNode;
  defaultTab?: AuthTab;
}

export function AuthDialog({ children, defaultTab = "login" }: AuthDialogProps) {
  const router = useRouter();
  const targetUrl = defaultTab === "login" ? "/login" : "/signup";

  const handleNavigate = () => {
    router.push(targetUrl);
  };

  if (!children) {
    return (
      <Link href={targetUrl} className="inline-block">
        <Button
          size="lg"
          className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 font-semibold
            text-base py-5 px-8 group relative transition-all duration-200
            rounded-lg shadow-sm active:scale-95"
          aria-label={defaultTab === "login" ? "Sign In" : "Start for Free"}
        >
          <span className="relative z-10 flex items-center justify-center">
            {defaultTab === "login" ? "Sign In" : "Start for Free"}
            <ArrowRight className="ml-2.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </Button>
      </Link>
    );
  }

  if (typeof children === "string") {
    return (
      <Link href={targetUrl} className="inline-block">
        {children}
      </Link>
    );
  }

  if (isValidElement(children)) {
    const child = children as React.ReactElement<{ onClick?: React.MouseEventHandler }>;

    return cloneElement(child, {
      ...child.props,
      onClick: (event: React.MouseEvent) => {
        child.props.onClick?.(event);
        if (!event.defaultPrevented) {
          handleNavigate();
        }
      },
    });
  }

  return (
    <span
      role="button"
      tabIndex={0}
      onClick={handleNavigate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleNavigate();
        }
      }}
      className="cursor-pointer"
    >
      {children}
    </span>
  );
}
