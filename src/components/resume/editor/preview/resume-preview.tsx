/**
 * Resume Preview Component
 * 
 * This component generates a PDF resume using @react-pdf/renderer and displays it using react-pdf.
 * It supports two variants: base and tailored resumes, with consistent styling and layout.
 * The PDF is generated client-side and updates whenever the resume data changes.
 */

"use client";

import { Resume } from "@/lib/types";
import { Document, Page, pdfjs } from 'react-pdf';
import { useState, useEffect, memo, useMemo, useCallback, useRef } from 'react';
import { pdf } from '@react-pdf/renderer';
import { ResumePDFDocument } from './resume-pdf-document';
import { useDebouncedValue } from '@/hooks/use-debounced-value';

// Import required CSS for react-pdf
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Cache for storing generated PDFs
const pdfCache = new Map<string, { url: string; timestamp: number }>();

// Cache cleanup interval (5 minutes)
const CACHE_CLEANUP_INTERVAL = 5 * 60 * 1000;

// Cache expiration time (30 minutes)
const CACHE_EXPIRATION_TIME = 30 * 60 * 1000;

/**
 * Generate a simple hash from the resume content
 * This is used as a cache key for PDF generation
 */
function generateResumeHash(resume: Resume): string {
  const content = JSON.stringify({
    basic: {
      name: `${resume.first_name} ${resume.last_name}`,
      contact: [resume.email, resume.phone_number, resume.location, resume.website, resume.linkedin_url, resume.github_url],
    },
    sections: {
      skills: resume.skills,
      experience: resume.work_experience,
      projects: resume.projects,
      education: resume.education,
    },
    settings: resume.document_settings,
  });
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

/**
 * Cleanup expired cache entries
 */
function cleanupCache() {
  const now = Date.now();
  for (const [hash, { url, timestamp }] of pdfCache.entries()) {
    if (now - timestamp > CACHE_EXPIRATION_TIME) {
      URL.revokeObjectURL(url);
      pdfCache.delete(hash);
    }
  }
}

// Setup cache cleanup interval
if (typeof window !== 'undefined') {
  setInterval(cleanupCache, CACHE_CLEANUP_INTERVAL);
}

// Add custom styles for PDF annotations to ensure links are clickable
const customStyles = `
  .react-pdf__Page__annotations {
    pointer-events: auto !important;
    z-index: 10 !important;
  }
  .react-pdf__Page__annotations.annotationLayer {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
`;

interface ResumePreviewProps {
  resume: Resume;
  variant?: 'base' | 'tailored';
  containerWidth: number;  // This is now expected to be a percentage (0-100)
  showWatermark?: boolean;
  onPageCountChange?: (count: number) => void;
}

/**
 * ResumePreview Component
 * 
 * Displays a PDF preview of the resume using react-pdf.
 * Handles PDF generation and responsive display.
 */
export const ResumePreview = memo(function ResumePreview({ 
  resume, 
  variant = 'base', 
  containerWidth, 
  showWatermark = false,
  onPageCountChange
}: ResumePreviewProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const debouncedWidth = useDebouncedValue(containerWidth, 100);
  const generationRef = useRef(0);
  // Hydration guard: the measured width is only safe to apply after mount.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Convert percentage to pixels based on parent container.
  // Before mount (server + first client render) we use a stable default so
  // the server HTML and the first client render match (avoids hydration mismatch).
  const getPixelWidth = useCallback(() => {
    if (typeof window === 'undefined') return 480;
    if (!mounted) return 480;
    const width = debouncedWidth || 0;
    return Math.max(width, 280);
  }, [debouncedWidth, mounted]);

  // Generate resume hash for caching
  const resumeHash = useMemo(() => generateResumeHash(resume), [resume]);

  // Add styles to document head
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = customStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Generate or retrieve PDF from cache
  useEffect(() => {
    const generationId = ++generationRef.current;
    let currentUrl: string | null = null;

    async function generatePDF() {
      // Check cache first
      const cached = pdfCache.get(resumeHash);
      if (cached) {
        if (generationRef.current !== generationId) return;
        currentUrl = cached.url;
        setUrl(cached.url);
        return;
      }

      // Generate new PDF if not in cache
      const blob = await pdf(<ResumePDFDocument resume={resume} variant={variant} showWatermark={showWatermark} />).toBlob();
      if (generationRef.current !== generationId) return;
      const newUrl = URL.createObjectURL(blob);
      currentUrl = newUrl;
      
      // Store in cache with timestamp
      pdfCache.set(resumeHash, { url: newUrl, timestamp: Date.now() });
      setUrl(newUrl);
    }

    setNumPages(0);
    generatePDF();

    const genRef = generationRef;
    // Cleanup function
    return () => {
      if (genRef.current === generationId && currentUrl && !pdfCache.has(resumeHash)) {
        URL.revokeObjectURL(currentUrl);
      }
    };
  }, [resumeHash, variant, resume, showWatermark]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      // Final cleanup of this component's URL if not in cache
      if (url && !pdfCache.has(resumeHash)) {
        URL.revokeObjectURL(url);
      }
    };
  }, [resumeHash, url]);

  // Add state for text layer visibility
  const [shouldRenderTextLayer, setShouldRenderTextLayer] = useState(false);

  // Modify Page component to conditionally render text layer
  function onDocumentLoadSuccess({ numPages: loadedPages }: { numPages: number }): void {
    setNumPages(loadedPages);
    onPageCountChange?.(loadedPages);
    // Enable text layer after document is stable
    setTimeout(() => setShouldRenderTextLayer(true), 1000);
  }

  function onDocumentLoadError(): void {
    setNumPages(0);
    onPageCountChange?.(0);
    setShouldRenderTextLayer(false);
  }

  // Disable text layer during updates
  useEffect(() => {
    setShouldRenderTextLayer(false);
  }, [resumeHash, variant]);

  // Show loading state while PDF is being generated
  if (!url) {
    return (
      <div 
        style={{ width: getPixelWidth() }}
        className="mx-auto aspect-[1/1.414] bg-white dark:bg-zinc-900 rounded-sm shadow-xl p-8 animate-pulse flex flex-col justify-between"
      >
        <div className="space-y-4">
          <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mx-auto" />
          <div className="flex justify-center gap-3">
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
          </div>
          <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-4" />
          <div className="space-y-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-28" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-4/5" />
          </div>
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-32" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
            <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
          </div>
        </div>
      </div>
    );
  }

  // Display the generated PDF using react-pdf
  return (
    <div className="relative w-full flex flex-col items-center justify-start">
        <Document
          key={url ?? 'resume-preview'}
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          className="relative flex flex-col items-center"
          externalLinkTarget="_blank"
          loading={
            <div 
              style={{ width: getPixelWidth() }}
              className="mx-auto aspect-[1/1.414] bg-white dark:bg-zinc-900 rounded-sm shadow-xl p-8 animate-pulse flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3 mx-auto" />
                <div className="flex justify-center gap-2">
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                  <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                </div>
              </div>
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              className="mb-6 shadow-2xl shadow-zinc-950/15 dark:shadow-black/70 ring-1 ring-zinc-900/5 dark:ring-white/10 rounded-sm bg-white overflow-hidden transition-shadow duration-200"
              width={getPixelWidth()}
              renderAnnotationLayer={true}
              renderTextLayer={shouldRenderTextLayer}
            />
          ))}
        </Document>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function to determine if re-render is needed
  return (
    prevProps.resume === nextProps.resume &&
    prevProps.variant === nextProps.variant &&
    prevProps.containerWidth === nextProps.containerWidth &&
    prevProps.showWatermark === nextProps.showWatermark
  );
}); 