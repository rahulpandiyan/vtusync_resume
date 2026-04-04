import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";


interface SplitContentProps {
  imageSrc: string;
  heading: string;
  description: string;
  imageOverflowRight?: boolean;
  className?: string;
  children?: React.ReactNode;
  bulletPoints?: string[];
  badgeText?: string;
  badgeGradient?: string;
}

export function SplitContent({
  imageSrc,
  heading,
  description,
  imageOverflowRight = false,
  className,
  children,
  bulletPoints,
  badgeText,
}: SplitContentProps) {
  return (
    <div className={cn(
      "relative w-full overflow-hidden py-16 lg:py-24",
      className
    )}>
      <div className="relative w-full px-4 sm:px-6 lg:px-12">
        <div className={cn(
          "grid gap-16 lg:gap-32 items-center",
          "lg:grid-cols-2"
        )}>
          {/* Content Section */}
          <div className={cn(
            "relative flex flex-col gap-6",
            imageOverflowRight ? "lg:order-last lg:pl-16" : "lg:order-first lg:pr-16",
            "order-first text-center lg:text-left"
          )}>
            {/* Badge */}
            {badgeText && (
              <div className="inline-flex self-center lg:self-start px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                {badgeText}
              </div>
            )}
            
            {/* Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-zinc-900 dark:text-zinc-100">
              {heading}
            </h2>
            
            {/* Description */}
            <p className="text-base sm:text-lg text-zinc-500 font-medium leading-relaxed">
              {description}
            </p>

            {/* Bullet points */}
            {bulletPoints && bulletPoints.length > 0 && (
              <div className="space-y-4 pt-2">
                {bulletPoints.map((point, idx) => (
                  <div key={idx} className="flex items-center gap-3 justify-center lg:justify-start">
                    <CheckCircle2 className="w-5 h-5 text-zinc-900 dark:text-zinc-100 flex-shrink-0" />
                    <span className="text-sm sm:text-base font-medium text-zinc-600 dark:text-zinc-400">{point}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Optional children */}
            {children && (
              <div className="mt-4">
                {children}
              </div>
            )}
          </div>

          {/* Image Section */}
          <div className={cn(
            "relative group",
            imageOverflowRight ? "lg:order-first" : "lg:order-last",
            "order-last"
          )}>
            <div className="relative aspect-video w-full overflow-hidden bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl transition-all duration-300 hover:shadow-2xl">
              <Image
                src={imageSrc}
                alt={heading}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={100}
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 