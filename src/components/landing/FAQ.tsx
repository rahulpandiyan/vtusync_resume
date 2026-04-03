"use client"

import React, { useRef } from 'react';
import { motion, useInView } from "framer-motion";
import { HelpCircle, Sparkles } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

export function FAQ() {
  // FAQ data
  const faqItems: FAQItem[] = [
    {
      question: "How does the AI tailor my resume?",
      answer: "Our AI analyzes job descriptions and automatically adjusts your content, keywords, and formatting to match what recruiters and ATS systems are looking for."
    },
    {
      question: "Is it really free?",
      answer: "Yes! Our free plan includes 2 base resumes and 5 tailored resumes using your own API keys. You can also self-host the entire platform."
    },
    {
      question: "What makes ResuSync different?",
      answer: "ResuSync is open-source, flexible, and specifically designed for tech professionals who want full control over their data and AI providers."
    },
    {
      question: "Will it pass ATS systems?",
      answer: "Absolutely! Our templates are built from the ground up to be easily parsed and highly ranked by all major Applicant Tracking Systems."
    }
  ];

  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-32 px-4 relative bg-white dark:bg-zinc-950 scroll-mt-20" 
      id="faq"
    >
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-16">
        <div className="flex justify-center mb-8">
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-zinc-100 dark:bg-zinc-900 text-zinc-500 border border-zinc-200 dark:border-zinc-800">
            Support
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-zinc-900 dark:text-zinc-50">
          Need help?
        </h2>
        
        <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
          Quick answers to help you start building your resume today.
        </p>
      </div>
      
      <div className="relative z-10 max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem 
              key={index}
              value={`item-${index}`} 
              className="px-6 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <AccordionTrigger className="text-left hover:no-underline py-5 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100 transition-colors">
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-zinc-400 flex-shrink-0" />
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-2xl">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
} 