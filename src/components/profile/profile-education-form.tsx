'use client';

import { Education } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProfileEducationFormProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export function ProfileEducationForm({ education, onChange }: ProfileEducationFormProps) {
  const addEducation = () => {
    onChange([...education, {
      school: "",
      degree: "",
      field: "",
      location: "",
      date: "",
      gpa: undefined,
      achievements: []
    }]);
  };

  const updateEducation = (index: number, field: keyof Education, value: Education[typeof field]) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={education.map((_, index) => `education-${index}`)}
      >
        {education.map((edu, index) => (
          <AccordionItem
            key={index}
            value={`education-${index}`}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 rounded-md overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {edu.degree ? `${edu.degree} ` : ''}{edu.field ? `in ${edu.field} ` : ''}{edu.school ? `at ${edu.school}` : 'New Education'}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {edu.date && <span>{edu.date}</span>}
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4">
                {/* School Name and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative group flex-1">
                    <Input
                      value={edu.school}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      className="text-base bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-zinc-400 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400"
                      placeholder="Institution Name"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      Institution
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="text-zinc-400 hover:text-red-500 transition-colors duration-300 h-9 w-9"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* Location */}
                <div className="relative group">
                  <Input
                    value={edu.location}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                      focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                      transition-colors placeholder:text-zinc-400 text-sm"
                    placeholder="City, Country"
                  />
                  <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                    Location
                  </div>
                </div>

                {/* Degree and Field Row */}
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="relative group flex-1">
                    <Input
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400 text-sm"
                      placeholder="Bachelor's, Master's, etc."
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      Degree
                    </div>
                  </div>
                  <div className="relative group flex-1">
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400 text-sm"
                      placeholder="Field of Study"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      Field of Study
                    </div>
                  </div>
                </div>

                {/* Date and GPA Row */}
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="relative group flex-1">
                    <Input
                      type="text"
                      value={edu.date}
                      onChange={(e) => updateEducation(index, 'date', e.target.value)}
                      className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400 text-sm"
                      placeholder="e.g., '2019 - 2023' or '2020 - Present'"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      Date
                    </div>
                  </div>
                  <div className="relative group md:w-1/3">
                    <Input
                      type="text"
                      value={edu.gpa || ''}
                      onChange={(e) => updateEducation(index, 'gpa', e.target.value || undefined)}
                      className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400 text-sm"
                      placeholder="0.00"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      GPA (Optional)
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Achievements & Activities</Label>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">One achievement per line</span>
                  </div>
                  <Textarea
                    value={edu.achievements?.join('\n')}
                    onChange={(e) => updateEducation(index, 'achievements', 
                      e.target.value.split('\n').filter(Boolean)
                    )}
                    placeholder="• Dean's List 2020-2021&#10;• President of Computer Science Club&#10;• First Place in Hackathon 2022"
                    className="min-h-[100px] bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md
                      focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                      transition-colors placeholder:text-zinc-400 text-sm"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button 
        variant="outline" 
        onClick={addEducation}
        className="w-full bg-zinc-50 dark:bg-zinc-900 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 h-9 text-sm"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Education
      </Button>
    </div>
  );
} 