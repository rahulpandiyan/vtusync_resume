"use client";

import React from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  const faqItems: FAQItem[] = [
    {
      question: "Why does ResuSync strictly enforce a single-column layout?",
      answer: "Enterprise ATS scanners (Workday, Greenhouse, Taleo) parse documents left-to-right, top-to-bottom. Multi-column layouts cause parsers to read across columns, merging unrelated job titles and skills together. Single-column layouts achieve 99%+ parsing accuracy across all major platforms."
    },
    {
      question: "How does the AI keyword tailoring work?",
      answer: "When you paste a target job description, ResuSync extracts essential technical requirements (libraries, architecture patterns, and domain competencies). It then suggests STAR-formatted bullet points (Situation, Task, Action, Result) matching those keywords using your real experience."
    },
    {
      question: "Can I bring my own OpenAI, Anthropic, or Gemini API keys?",
      answer: "Yes! ResuSync fully supports BYO API keys. You can connect your own key from OpenAI, Anthropic, or Google Gemini and generate unlimited tailored resumes with zero platform charges."
    },
    {
      question: "Are the exported PDFs watermarked?",
      answer: "No. ResuSync never adds watermarks or forced branding to your generated resumes. Whether on the free BYO key tier or the Pro tier, you receive clean, professional, unwatermarked PDF documents."
    },
    {
      question: "Is my personal career data private and secure?",
      answer: "Yes. Your resume data is stored securely in your private Supabase database instance. We never sell candidate data or use your private resumes to train public AI models."
    }
  ];

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 max-w-4xl mx-auto scroll-mt-20" id="faq">
      
      <div className="text-center space-y-3.5 mb-14">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800">
          <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
          <span>CLARIFICATIONS</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-zinc-50 leading-[1.12]">
          Frequently answered questions.
        </h2>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-normal">
          Technical details on ATS parsing, model privacy, and document generation.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqItems.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="px-6 rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors shadow-sm"
          >
            <AccordionTrigger className="text-left py-4 sm:py-5 text-base sm:text-lg font-semibold text-zinc-950 dark:text-zinc-50 hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="pb-5 text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-normal">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

    </section>
  );
}
