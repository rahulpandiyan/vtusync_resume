import type { Metadata } from "next";
import { ResumeScanner } from "@/components/resume/scanner/resume-scanner";

export const metadata: Metadata = {
  title: "ATS Resume Scanner & Keyword Matcher | ResuSync",
  description:
    "Audit your resume against ATS screeners, check keyword density, and evaluate job fit with our instant on-device scanner.",
};

export default function ResumeScannerPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      <ResumeScanner />
    </div>
  );
}
