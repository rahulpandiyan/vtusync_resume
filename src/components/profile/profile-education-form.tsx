'use client';

import { Education } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, GraduationCap, Calendar, MapPin, Award, BookOpen } from "lucide-react";
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
    onChange([
      ...education,
      {
        school: "",
        degree: "",
        field: "",
        location: "",
        date: "",
        gpa: undefined,
        achievements: []
      }
    ]);
  };

  const updateEducation = (index: number, field: keyof Education, value: Education[typeof field]) => {
    const updated = [...education];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeEducation = (index: number) => {
    onChange(education.filter((_, i) => i !== index));
  };

  if (education.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <GraduationCap className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No education records added</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mb-4">
          Add your college, degree, or diploma. VTU college names and branch accreditations match standard campus filters.
        </p>
        <Button
          type="button"
          onClick={addEducation}
          size="sm"
          className="bg-[#3861fb] text-white hover:bg-[#3861fb]/90 font-medium text-xs h-9 px-4 rounded-lg shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add First Degree
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={education.map((_, index) => `education-${index}`)}
      >
        {education.map((edu, index) => (
          <AccordionItem
            key={index}
            value={`education-${index}`}
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all rounded-xl overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1 text-left">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {edu.degree || edu.field ? (
                      `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`.trim()
                    ) : (
                      "Untitled Degree"
                    )}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {edu.school || "Institution not specified"}
                    </span>
                    {edu.location && <span>• {edu.location}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {edu.gpa && (
                    <Badge variant="outline" className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/10 rounded-md px-2 py-0.5">
                      GPA {edu.gpa}
                    </Badge>
                  )}
                  {edu.date && (
                    <Badge variant="secondary" className="text-[10px] font-normal text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-0.5">
                      {edu.date}
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-4">
                {/* Institution & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Institution / College / University
                    </Label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={edu.school}
                        onChange={(e) => updateEducation(index, 'school', e.target.value)}
                        placeholder="e.g. BMS College of Engineering / VTU"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Campus Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={edu.location}
                        onChange={(e) => updateEducation(index, 'location', e.target.value)}
                        placeholder="e.g. Bengaluru, Karnataka, India"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Degree & Field */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Degree / Program
                    </Label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        placeholder="e.g. Bachelor of Engineering (B.E.)"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Field of Study / Branch
                    </Label>
                    <Input
                      value={edu.field}
                      onChange={(e) => updateEducation(index, 'field', e.target.value)}
                      placeholder="e.g. Computer Science & Engineering"
                      className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                    />
                  </div>
                </div>

                {/* Date & GPA */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Graduation Timeline
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={edu.date}
                        onChange={(e) => updateEducation(index, 'date', e.target.value)}
                        placeholder="e.g. 2020 - 2024"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      GPA / CGPA (Optional)
                    </Label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        type="number"
                        step="0.01"
                        value={edu.gpa !== undefined ? edu.gpa : ''}
                        onChange={(e) => {
                          const val = e.target.value ? parseFloat(e.target.value) : undefined;
                          updateEducation(index, 'gpa', val);
                        }}
                        placeholder="e.g. 8.75 or 3.8"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Achievements & Activities */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Honors, Activities & Coursework
                    </Label>
                    <span className="text-[10px] text-zinc-400">One item per line</span>
                  </div>
                  <Textarea
                    value={edu.achievements?.join('\n') || ''}
                    onChange={(e) => {
                      const items = e.target.value.split('\n').filter(Boolean);
                      updateEducation(index, 'achievements', items);
                    }}
                    placeholder="• First Class with Distinction&#10;• VTU Rank Holder / Department Top 5%&#10;• Core Technical Committee Head, ACM Student Chapter"
                    rows={3}
                    className="text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb] resize-none"
                  />
                </div>

                {/* Footer action: Delete Degree */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Degree
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Button
        type="button"
        variant="outline"
        onClick={addEducation}
        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all h-9 text-xs font-medium rounded-xl"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Education
      </Button>
    </div>
  );
}
