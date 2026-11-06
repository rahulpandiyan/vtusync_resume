'use client';

import { cn } from "@/lib/utils";
import { Copy, Brain } from "lucide-react";
import { ComponentPropsWithoutRef } from "react";

interface ImportMethodRadioItemProps extends ComponentPropsWithoutRef<'input'> {
  title: string;
  description: string;
  icon: React.ReactNode;
  checked?: boolean;
  id: string;
}

function ImportMethodRadioItem({
  title,
  description,
  icon,
  id,
  ...props
}: ImportMethodRadioItemProps) {
  return (
    <label htmlFor={id} className="h-full cursor-pointer">
      <input
        type="radio"
        className="sr-only peer"
        id={id}
        {...props}
      />
      <div
        tabIndex={0}
        className={cn(
          "flex flex-col items-center justify-center rounded-xl p-4",
          "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm h-full",
          "hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40",
          "transition-all duration-200",
          "peer-checked:border-[#3861fb] peer-checked:bg-[#3861fb]/[0.03] peer-checked:ring-2 peer-checked:ring-[#3861fb]/20",
          "focus:outline-none focus:ring-2 focus:ring-[#3861fb]/30"
        )}
      >
        <div className="flex flex-col items-center text-center">
          <div className="h-9 w-9 rounded-lg bg-[#3861fb]/10 text-[#3861fb] flex items-center justify-center mb-2.5">
            {icon}
          </div>
          <div className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 mb-1">{title}</div>
          <span className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{description}</span>
        </div>
      </div>
    </label>
  );
}

interface ImportMethodRadioGroupProps {
  value: 'import-profile' | 'ai';
  onChange: (value: 'import-profile' | 'ai') => void;
}

export function ImportMethodRadioGroup({ value, onChange }: ImportMethodRadioGroupProps) {
  return (
    <div className="grid grid-cols-2 gap-3.5">
      <ImportMethodRadioItem
        name="tailorOption"
        value="ai"
        id="ai-tailor"
        checked={value === 'ai'}
        onChange={() => onChange('ai')}
        title="Tailor with AI"
        description="Let AI analyze the job description and calibrate your resume for maximum ATS alignment"
        icon={<Brain className="h-4 w-4" />}
      />
      
      <ImportMethodRadioItem
        name="tailorOption"
        value="import-profile"
        id="manual-tailor"
        checked={value === 'import-profile'}
        onChange={() => onChange('import-profile')}
        title="Copy Base Resume"
        description="Create a clean duplicate of your base resume and link it to this specific role"
        icon={<Copy className="h-4 w-4" />}
      />
    </div>
  );
}
