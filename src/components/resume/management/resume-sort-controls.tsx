'use client';

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ArrowUp, ArrowDown, Calendar, Type, Briefcase, ChevronDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export type SortOption = 'name' | 'jobTitle' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

const sortOptions = [
  { value: 'createdAt', label: 'Date Created', icon: Calendar },
  { value: 'name', label: 'Resume Name', icon: Type },
  { value: 'jobTitle', label: 'Target Role', icon: Briefcase },
];

interface ResumeSortControlsProps {
  sortParam?: string;
  directionParam?: string;
  currentSort?: SortOption;
  currentDirection?: SortDirection;
  onSortChange?: (sort: SortOption) => void;
  onDirectionToggle?: () => void;
}

export function ResumeSortControls({ 
  sortParam = 'sort',
  directionParam = 'direction',
  currentSort: propCurrentSort,
  currentDirection: propCurrentDirection,
  onSortChange: propOnSortChange,
  onDirectionToggle: propOnDirectionToggle,
}: ResumeSortControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSort = propCurrentSort || (searchParams.get(sortParam) as SortOption) || 'createdAt';
  const direction = propCurrentDirection || (searchParams.get(directionParam) as SortDirection) || 'desc';

  function handleSortChange(sort: SortOption) {
    if (propOnSortChange) {
      propOnSortChange(sort);
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set(sortParam, sort);
    if (sort !== currentSort) {
      params.set(directionParam, 'asc');
    }
    router.push(`?${params.toString()}`);
  }

  function toggleDirection() {
    if (propOnDirectionToggle) {
      propOnDirectionToggle();
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set(directionParam, direction === 'asc' ? 'desc' : 'asc');
    router.push(`?${params.toString()}`);
  }

  const activeOption = sortOptions.find(opt => opt.value === currentSort) || sortOptions[0];

  return (
    <div className="flex items-center gap-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size="sm"
            className="h-9 px-3 gap-1.5 text-xs font-medium border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg shadow-sm"
          >
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-400" />
            <span className="text-zinc-500 dark:text-zinc-400 hidden sm:inline">Sort:</span>
            <span className="text-zinc-800 dark:text-zinc-200 font-semibold">{activeOption.label}</span>
            <ChevronDown className="h-3 w-3 text-zinc-400 opacity-60 ml-0.5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 p-1">
          {sortOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = option.value === currentSort;
            return (
              <DropdownMenuItem
                key={option.value}
                onClick={() => handleSortChange(option.value as SortOption)}
                className={`text-xs font-medium cursor-pointer rounded-md ${
                  isSelected ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold' : ''
                }`}
              >
                <Icon className="mr-2 h-3.5 w-3.5 text-zinc-500" />
                <span>{option.label}</span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button
        variant="outline"
        size="sm"
        onClick={toggleDirection}
        className="h-9 w-9 p-0 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg shadow-sm"
        title={direction === 'asc' ? "Ascending (click for descending)" : "Descending (click for ascending)"}
      >
        {direction === 'asc' ? (
          <ArrowUp className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
        ) : (
          <ArrowDown className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
        )}
      </Button>
    </div>
  );
}
