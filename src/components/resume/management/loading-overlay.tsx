'use client';

import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";
import LatticeLoader from "@/components/ui/lattice-loader";

export const CREATION_STEPS = [
  { id: 'analyzing', label: 'Analyzing Job Description' },
  { id: 'formatting', label: 'Formatting Requirements' },
  { id: 'tailoring', label: 'Tailoring Resume Content' },
  { id: 'finalizing', label: 'Finalizing Resume' },
] as const;

export type CreationStep = typeof CREATION_STEPS[number]['id'];

interface LoadingOverlayProps {
  currentStep: CreationStep;
}

export function LoadingOverlay({ currentStep }: LoadingOverlayProps) {
  const currentStepIndex = CREATION_STEPS.findIndex(step => step.id === currentStep);
  const progress = ((currentStepIndex + 1) / CREATION_STEPS.length) * 100;

  return (
    <div className="absolute inset-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full space-y-6 p-6 sm:p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800/90 shadow-2xl">
        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            <span>Calibrating Tailored Resume</span>
            <span className="font-mono text-[#3861fb]">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-1.5 bg-zinc-100 dark:bg-zinc-800 [&>div]:bg-[#3861fb]" />
        </div>

        {/* Steps */}
        <div className="space-y-2">
          {CREATION_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isCompleted = index < currentStepIndex;
            
            return (
              <div
                key={step.id}
                className={cn(
                  "flex items-center justify-between p-2.5 rounded-xl transition-all duration-300 border",
                  isActive && "bg-[#3861fb]/[0.06] border-[#3861fb]/30 shadow-sm",
                  isCompleted && "border-transparent text-zinc-500 dark:text-zinc-400 bg-zinc-50/60 dark:bg-zinc-800/40",
                  !isActive && !isCompleted && "border-transparent text-zinc-400 opacity-60"
                )}
              >
                <div className="flex items-center gap-2.5">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  ) : isActive ? (
                    <div className="h-2 w-2 rounded-full bg-[#3861fb] animate-pulse" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-zinc-300 dark:bg-zinc-700" />
                  )}
                  <span className={cn(
                    "text-xs font-medium",
                    isActive && "text-zinc-900 dark:text-zinc-100 font-semibold",
                    isCompleted && "text-zinc-600 dark:text-zinc-400"
                  )}>
                    {step.label}
                  </span>
                </div>

                {isActive && (
                  <LatticeLoader
                    status="working"
                    label=""
                    showTimer={true}
                    color="#3861fb"
                    fontSize={11}
                    cellSize={4}
                    gap={1.5}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Current action description */}
        <div className="text-center pt-1">
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {currentStep === 'analyzing' && "Extracting essential competencies & keywords..."}
            {currentStep === 'formatting' && "Mapping qualifications against target job criteria..."}
            {currentStep === 'tailoring' && "Optimizing bullet points for maximum ATS readability..."}
            {currentStep === 'finalizing' && "Assembling calibrated resume preview..."}
          </p>
        </div>
      </div>
    </div>
  );
}
