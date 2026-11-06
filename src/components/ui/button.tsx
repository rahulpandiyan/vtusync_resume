import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 sm:[&_svg]:size-4 [&_svg]:shrink-0 select-none cursor-pointer active:scale-[0.98]",
  {
    variants: {
      variant: {
        // High-contrast modern default (Zinc/Monochrome — matching app header and buttons)
        default:
          "bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 shadow-xs border border-zinc-800/10 dark:border-zinc-200/10",
        
        // Brand blue accent
        brand:
          "bg-[#3861fb] text-white hover:bg-[#2c53f0] shadow-xs hover:shadow-sm border border-blue-400/20",

        // Secondary neutral
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700/80 shadow-none border border-transparent",

        // Subtle outline
        outline:
          "border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 shadow-2xs",

        // Destructive
        destructive:
          "bg-red-600 text-white hover:bg-red-700 shadow-xs border border-red-500/20",

        // Minimal ghost
        ghost:
          "hover:bg-zinc-100 text-zinc-700 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100",

        // Text link
        link:
          "text-[#3861fb] underline-offset-4 hover:underline p-0 h-auto font-medium",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-6 text-sm sm:text-base",
        icon: "h-9 w-9",
        "icon-sm": "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
