import { Button } from "@/components/ui/button";
import { Sparkles, Star, Briefcase, FileSearch } from "lucide-react";

interface QuickSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    text: "Rate my Resume out of 10",
    icon: Star,
  },
  {
    text: "Improve work experience bullet points",
    icon: Briefcase,
  },
  {
    text: "Critique my resume for ATS compliance",
    icon: FileSearch,
  },
];

export function QuickSuggestions({ onSuggestionClick }: QuickSuggestionsProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
        <Sparkles className="h-3.5 w-3.5 text-[#3861fb]" />
        <span className="font-medium">Suggested AI prompts</span>
      </div>

      <div className="flex flex-wrap justify-center gap-2 max-w-[500px]">
        {suggestions.map((suggestion) => {
          const Icon = suggestion.icon;
          return (
            <Button
              key={suggestion.text}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion.text)}
              className="h-8 px-3 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 rounded-lg shadow-sm transition-all"
            >
              <Icon className="mr-1.5 h-3.5 w-3.5 text-zinc-400" />
              <span>{suggestion.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
