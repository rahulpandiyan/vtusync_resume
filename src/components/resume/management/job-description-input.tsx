'use client';

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Link2, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import LatticeLoader from "@/components/ui/lattice-loader";
import { crawlJobUrl, CrawledJobResult } from "@/utils/actions/jobs/crawler";

interface JobDescriptionInputProps {
  value: string;
  onChange: (value: string) => void;
  isInvalid: boolean;
  onExtractedDetails?: (details: {
    position_title: string;
    company_name: string;
    location: string;
    job_url: string;
  }) => void;
}

export function JobDescriptionInput({ 
  value, 
  onChange, 
  isInvalid,
  onExtractedDetails 
}: JobDescriptionInputProps) {
  const [urlInput, setUrlInput] = useState("");
  const [isCrawling, setIsCrawling] = useState(false);
  const [crawlError, setCrawlError] = useState<string | null>(null);
  const [extractedMeta, setExtractedMeta] = useState<{
    position_title: string;
    company_name: string;
  } | null>(null);

  // Check if current textarea value looks like a lone URL
  const looksLikeUrl = /^https?:\/\/[^\s]+$/i.test(value.trim());

  const handleCrawl = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsCrawling(true);
    setCrawlError(null);

    try {
      const result: CrawledJobResult = await crawlJobUrl(targetUrl);
      
      if (result.success && result.description) {
        onChange(result.description);
        setExtractedMeta({
          position_title: result.position_title,
          company_name: result.company_name,
        });

        if (onExtractedDetails) {
          onExtractedDetails({
            position_title: result.position_title,
            company_name: result.company_name,
            location: result.location,
            job_url: result.job_url,
          });
        }
        setUrlInput("");
      } else {
        setCrawlError(result.error || "Could not auto-extract details from this link. You can paste the description manually below.");
      }
    } catch (err) {
      setCrawlError((err as Error)?.message || "Failed to crawl link. Please paste the job description below.");
    } finally {
      setIsCrawling(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* URL Extractor Bar */}
      <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5 text-[#3861fb]" />
            <span>Job Posting Link (Auto-Crawler)</span>
          </label>
          <span className="text-[10px] text-zinc-400">
            LinkedIn, Indeed, Greenhouse, Lever, etc.
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="url"
              placeholder="https://company.com/careers/job-id..."
              value={urlInput}
              disabled={isCrawling}
              onChange={(e) => {
                setUrlInput(e.target.value);
                if (crawlError) setCrawlError(null);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleCrawl(urlInput);
                }
              }}
              className="w-full h-8 px-3 text-xs rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-[#3861fb] text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
            />
          </div>

          <Button
            type="button"
            size="sm"
            disabled={isCrawling || !urlInput.trim()}
            onClick={() => handleCrawl(urlInput)}
            className="h-8 px-3.5 bg-[#3861fb] hover:bg-[#3861fb]/90 text-white text-xs font-medium rounded-lg shrink-0 shadow-sm transition-all"
          >
            {isCrawling ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>Crawling...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Extract Details</span>
              </span>
            )}
          </Button>
        </div>

        {/* Crawling Status indicator */}
        {isCrawling && (
          <div className="pt-1 flex items-center justify-between text-xs text-[#3861fb]">
            <LatticeLoader
              status="working"
              label="Crawling page & extracting job criteria..."
              color="#3861fb"
              fontSize={12}
              cellSize={4}
              gap={1.5}
              showTimer={true}
            />
          </div>
        )}

        {/* Extracted Metadata Badge */}
        {extractedMeta && !isCrawling && (
          <div className="flex items-center gap-2 pt-1 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
            <span className="font-medium">
              Extracted: {extractedMeta.position_title || 'Role'} {extractedMeta.company_name ? `at ${extractedMeta.company_name}` : ''}
            </span>
          </div>
        )}

        {/* Crawl Error Alert */}
        {crawlError && !isCrawling && (
          <div className="flex items-start gap-2 pt-1 text-xs text-amber-600 dark:text-amber-400">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>{crawlError}</span>
          </div>
        )}
      </div>

      {/* Auto-detect banner when user pasted a link directly in the textarea */}
      {looksLikeUrl && !isCrawling && (
        <div className="p-2.5 rounded-lg bg-[#3861fb]/10 border border-[#3861fb]/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="h-4 w-4 text-[#3861fb] shrink-0" />
            <span className="text-xs text-zinc-800 dark:text-zinc-200 truncate">
              Detected job URL in input. Extract requirements with AI crawler?
            </span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => handleCrawl(value.trim())}
            className="h-7 px-2.5 text-xs bg-[#3861fb] hover:bg-[#3861fb]/90 text-white rounded-md shrink-0 shadow-sm"
          >
            <span>Auto Extract</span>
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Textarea for Job Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <label htmlFor="job-description" className="font-medium text-zinc-700 dark:text-zinc-300">
            Job Description & Responsibilities
          </label>
          {value.trim() && (
            <span className="text-[10px] text-zinc-400">
              {value.trim().length} characters
            </span>
          )}
        </div>

        <textarea
          id="job-description"
          placeholder="Paste full job description, responsibilities, and requirements here..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={6}
          className={cn(
            "w-full rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs",
            "focus:border-[#3861fb] focus:ring-2 focus:ring-[#3861fb]/20 focus:outline-none placeholder:text-zinc-400",
            "resize-y p-3.5 shadow-sm transition-all leading-relaxed",
            isInvalid && "border-red-500 ring-2 ring-red-500/20"
          )}
          required
        />
      </div>
    </div>
  );
}
