'use client';

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { WorkExperience } from "@/lib/types";
import { useState } from 'react';

const DIFF_HIGHLIGHT_CLASSES = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1 rounded-sm";

interface WorkExperienceSuggestionProps {
  currentWork: WorkExperience;
  modifiedField: keyof WorkExperience;
  newValue: WorkExperience[keyof WorkExperience];
}

interface DescriptionPoint {
  text: string;
  isNew: boolean;
}

function getHighlightClass<T>(currentValue: T, newValue: T, fieldValue: T): string {
  return JSON.stringify(currentValue) !== JSON.stringify(newValue) && fieldValue === newValue 
    ? DIFF_HIGHLIGHT_CLASSES 
    : '';
}

export function WorkExperienceSuggestion({ 
  currentWork,
  modifiedField,
  newValue
}: WorkExperienceSuggestionProps) {
  const [isExpanded] = useState(true);
  
  // Merge the modification with original work experience
  const suggestedWork = {
    ...currentWork,
    [modifiedField]: newValue
  };

  // Safe description comparison
  const descriptionComparison = (current: string[] = [], suggested: string[] = []): DescriptionPoint[] => {
    const safeCurrent = Array.isArray(current) ? current : [];
    const safeSuggested = Array.isArray(suggested) ? suggested : [];
    
    return safeSuggested.map((point = '', index) => {
      const currentPoint = safeCurrent[index] || '';
      return {
        text: point,
        isNew: point !== currentPoint,
      };
    });
  };

  const highlightedDescription = modifiedField === 'description'
    ? descriptionComparison(
        currentWork?.description ?? [],
        (newValue as string[])
      )
    : (currentWork.description ?? []).map((point) => ({
        text: point,
        isNew: false,
      }));

  return (
    <Card className={cn(
      "group relative overflow-hidden",
      "border border-zinc-200 dark:border-zinc-800",
      "bg-white dark:bg-zinc-900",
      "shadow-sm",
      "transition-all duration-300 ease-in-out",
      "hover:shadow-md"
    )}>
      <div className="relative p-3.5">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className={cn(
              "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
              getHighlightClass(currentWork.position, suggestedWork.position, suggestedWork.position)
            )}>
              {suggestedWork.position}
            </h3>
            <p className={cn(
              "text-xs text-zinc-600 dark:text-zinc-400",
              getHighlightClass(currentWork.company, suggestedWork.company, suggestedWork.company)
            )}>
              {suggestedWork.company}
            </p>
          </div>
          <span className={cn(
            "text-[10px] text-zinc-500",
            getHighlightClass(currentWork.date, suggestedWork.date, suggestedWork.date)
          )}>
            {suggestedWork.date}
          </span>
        </div>

        {/* Location */}
        {suggestedWork.location && (
          <p className={cn(
            "text-xs text-zinc-500 mt-1",
            getHighlightClass(currentWork.location, suggestedWork.location, suggestedWork.location)
          )}>
            {suggestedWork.location}
          </p>
        )}

        {/* Description */}
        {isExpanded && highlightedDescription && (
          <div className="space-y-1.5 mt-2">
            {highlightedDescription.map((point, index) => (
              <div key={index} className="flex items-start gap-1.5">
                <span className="text-zinc-400 mt-0.5 text-xs">•</span>
                <p className={cn("text-xs text-zinc-700 dark:text-zinc-300", point.isNew ? DIFF_HIGHLIGHT_CLASSES : "")}>
                  {point.text || 'No description provided'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
