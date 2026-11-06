'use client';

import React, { useState } from "react";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputActions,
  PromptInputAction,
} from "@/components/ui/prompt-kit";
import { Button } from "@/components/ui/button";
import { ArrowUp, Square, FileText, Target } from "lucide-react";
import type { Job } from "@/lib/types";

interface ChatInputProps {
  isLoading: boolean;
  onSubmit: (message: string) => void;
  onStop: () => void;
  job?: Job | null;
}

export default function ChatInput({ 
  isLoading, 
  onSubmit, 
  onStop,
  job
}: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSubmit(text.trim());
      setText("");
    }
  };

  return (
    <div className="w-full select-none border-t border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-3xl mx-auto space-y-2 p-3 sm:p-4">
        {/* Prompt Kit Prompt Input */}
        <PromptInput
          value={text}
          onValueChange={setText}
          onSubmit={handleSend}
          isLoading={isLoading}
          maxHeight={180}
          className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm rounded-2xl p-2.5 transition-all focus-within:border-[#3861fb]/70 focus-within:ring-2 focus-within:ring-[#3861fb]/15"
        >
          <PromptInputTextarea
            placeholder="Ask SyncAI Copilot to analyze, rewrite bullets, or calibrate for ATS... (Enter to send)"
            className="text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 px-1 py-1 focus-visible:ring-0"
          />

          <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/80">
            {/* Active Context Indicators */}
            <PromptInputActions className="gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                <FileText className="h-3 w-3 text-[#3861fb]" />
                <span>Resume Live Context</span>
              </span>
              {job && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium bg-[#3861fb]/10 text-[#3861fb] dark:text-[#7aa5f5]">
                  <Target className="h-3 w-3" />
                  <span className="truncate max-w-[120px] sm:max-w-[160px]">{job.position_title}</span>
                </span>
              )}
            </PromptInputActions>

            {/* Send / Stop Controls */}
            <PromptInputActions className="gap-1.5 shrink-0">
              {isLoading ? (
                <PromptInputAction tooltip="Stop generating">
                  <Button
                    type="button"
                    size="icon"
                    onClick={onStop}
                    className="h-8 w-8 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm transition-transform active:scale-95"
                  >
                    <Square className="h-3.5 w-3.5 fill-current" />
                  </Button>
                </PromptInputAction>
              ) : (
                <PromptInputAction tooltip="Send message (Enter)">
                  <Button
                    type="button"
                    size="icon"
                    onClick={handleSend}
                    disabled={!text.trim()}
                    className="h-8 w-8 rounded-full bg-[#3861fb] hover:bg-[#2b50ea] text-white shadow-sm disabled:opacity-40 transition-all active:scale-95"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                </PromptInputAction>
              )}
            </PromptInputActions>
          </div>
        </PromptInput>
      </div>
    </div>
  );
}
