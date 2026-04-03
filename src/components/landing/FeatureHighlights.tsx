"use client"
import React from 'react';
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { SplitContent } from '../ui/split-content';
import { AuthDialog } from "@/components/auth/auth-dialog";
import { Button } from "@/components/ui/button";

const FeatureHighlights = () => {
  // Trusted by logos
  const companies = [
    { name: "Google", logo: "/logos/google.png" },
    { name: "Microsoft", logo: "/logos/microsoft.webp" },
    { name: "Amazon", logo: "/logos/amazon.png" },
    { name: "Meta", logo: "/logos/meta.png" },
    { name: "Netflix", logo: "/logos/netflix.png" },
  ];

  // Statistics
  const stats = [
    { value: "500+", label: "Resumes Generated" },
    { value: "89%", label: "Interview Rate" },
    { value: "4.9/5", label: "User Rating" },
    { value: "10 min", label: "Build Time" },
  ];

  return (
    <section className="py-24 md:py-32 px-6 relative bg-white dark:bg-zinc-950 max-w-7xl mx-auto overflow-hidden">
      {/* Heading section */}
      <div className="relative z-10 max-w-4xl mx-auto text-center mb-24">
        <div className="flex justify-center gap-3 mb-8">
          <span className="px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Performance
          </span>
          <span className="px-3 py-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Precision
          </span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold leading-[0.95] tracking-tight mb-8 text-zinc-900 dark:text-zinc-100">
          The Resume Builder <br className="hidden md:block" /> That Gets You Hired
        </h2>
        
        <p className="text-base md:text-lg text-zinc-500 max-w-2xl mx-auto font-medium leading-relaxed">
          Smart AI tools that optimize your resume for each job, increasing your interview chances by up to <span className="text-zinc-900 dark:text-zinc-100 font-bold">3x</span>. Built for precision and speed.
        </p>

        {/* Statistics bento grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="v-card p-8 flex flex-col items-center justify-center text-center space-y-2 bg-zinc-50/50 dark:bg-zinc-900/50"
            >
              <p className="text-4xl font-bold tracking-tighter text-zinc-900 dark:text-zinc-100">{stat.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Features Section */}
      <div className="flex flex-col space-y-8" id="features">
        <SplitContent
          imageSrc="/SS Chat.png"
          heading="AI Resume Assistant"
          description="Get real-time feedback and suggestions from our advanced AI assistant. Optimize your resume content with industry-specific insights."
          badgeText="Intelligent Analysis"
          bulletPoints={[
            "Context-aware bullet points",
            "Keyword density optimization",
            "Action verb suggestions"
          ]}
        />

        <SplitContent
          imageSrc="/Dashboard Image.png"
          heading="Unified Dashboard"
          description="Manage all your resumes in one place. Create base profiles and generate tailored versions for specific job descriptions in seconds."
          badgeText="Efficient Management"
          imageOverflowRight={true}
          bulletPoints={[
            "Tailored version control",
            "Instant PDF generation",
            "Job application tracking"
          ]}
        />
      </div>
      
      {/* Social proof */}
      <div className="mt-32 border-t border-zinc-100 dark:border-zinc-900 pt-24 text-center">
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-12">Trusted by professionals from</h3>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 max-w-4xl mx-auto opacity-40 grayscale contrast-125 dark:invert">
          {companies.map((company, index) => (
            <div key={index} className="w-24 h-8 relative">
              <Image 
                src={company.logo} 
                alt={company.name} 
                fill
                className="object-contain" 
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* CTA section */}
      <div className="mt-32 text-center pb-20">
        <div className="max-w-4xl mx-auto p-12 md:p-24 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-zinc-100 to-transparent dark:from-zinc-800/10 opacity-50" />
          
          <div className="relative z-10 space-y-8">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Ready to land your <br className="hidden md:block" /> dream job?
            </h2>
            <p className="text-base md:text-lg font-medium text-zinc-500 max-w-xl mx-auto">
              Join thousands of professionals who have accelerated their career with ResuSync.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <AuthDialog>
                <Button size="lg" className="h-12 px-12 text-sm font-semibold tracking-tight w-full sm:w-auto">
                  Get Started Free
                </Button>
              </AuthDialog>
              <Link href="https://github.com/rahul/resusync">
                <Button variant="outline" size="lg" className="h-12 px-12 text-sm font-semibold tracking-tight w-full sm:w-auto bg-transparent">
                  Star on GitHub
                </Button>
              </Link>
            </div>
            
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 pt-4 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
              Free forever for individuals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureHighlights;
