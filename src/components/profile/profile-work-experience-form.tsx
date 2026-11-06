'use client';

import { WorkExperience } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Briefcase, Calendar, MapPin, Building2, Code2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProfileWorkExperienceFormProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export function ProfileWorkExperienceForm({ experiences, onChange }: ProfileWorkExperienceFormProps) {
  const addExperience = () => {
    onChange([
      ...experiences,
      {
        company: "",
        position: "",
        location: "",
        date: "",
        description: [""],
        technologies: []
      }
    ]);
  };

  const updateExperience = (index: number, field: keyof WorkExperience, value: string | string[]) => {
    const updated = [...experiences];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeExperience = (index: number) => {
    onChange(experiences.filter((_, i) => i !== index));
  };

  const [techInputs, setTechInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(experiences.map((exp, i) => [i, exp.technologies?.join(', ') || '']))
  );

  React.useEffect(() => {
    setTechInputs(
      Object.fromEntries(experiences.map((exp, i) => [i, exp.technologies?.join(', ') || '']))
    );
  }, [experiences]);

  if (experiences.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <Briefcase className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No work experience added</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mb-4">
          Add internships, full-time positions, or co-ops. These form the core evidence for your ATS resume score.
        </p>
        <Button
          type="button"
          onClick={addExperience}
          size="sm"
          className="bg-[#3861fb] text-white hover:bg-[#3861fb]/90 font-medium text-xs h-9 px-4 rounded-lg shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add First Experience
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={experiences.map((_, index) => `experience-${index}`)}
      >
        {experiences.map((exp, index) => (
          <AccordionItem
            key={index}
            value={`experience-${index}`}
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all rounded-xl overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1 text-left">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {exp.position || "Untitled Position"}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5 mt-0.5">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">
                      {exp.company || "Company not specified"}
                    </span>
                    {exp.location && <span>• {exp.location}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {exp.date && (
                    <Badge variant="secondary" className="text-[10px] font-normal text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-0.5">
                      {exp.date}
                    </Badge>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-4">
                {/* Header row: Position & Delete button */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Position Title
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={exp.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        placeholder="e.g. Software Engineer Intern"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Company / Organization
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={exp.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        placeholder="e.g. Infosys, Cisco, Startup"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Date Range
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={exp.date}
                        onChange={(e) => updateExperience(index, 'date', e.target.value)}
                        placeholder="e.g. Jan 2023 - Present"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Location
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={exp.location}
                        onChange={(e) => updateExperience(index, 'location', e.target.value)}
                        placeholder="e.g. Bengaluru, India or Remote"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Technologies Used */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Technologies & Tools
                    </Label>
                    <span className="text-[10px] text-zinc-400">Separate with commas</span>
                  </div>
                  <div className="relative">
                    <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <Input
                      value={techInputs[index] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setTechInputs(prev => ({ ...prev, [index]: val }));
                        const list = val.split(',').map(s => s.trim()).filter(Boolean);
                        updateExperience(index, 'technologies', list);
                      }}
                      onBlur={(e) => {
                        const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        updateExperience(index, 'technologies', list);
                        setTechInputs(prev => ({ ...prev, [index]: list.join(', ') }));
                      }}
                      placeholder="e.g. React, Next.js, Node.js, AWS, PostgreSQL"
                      className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                    />
                  </div>

                  {exp.technologies && exp.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.technologies.map((tech, tIdx) => (
                        <Badge
                          key={tIdx}
                          variant="secondary"
                          className="text-[11px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded-md"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Responsibilities & Achievements */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Responsibilities & Achievements
                      </Label>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Start each bullet with an active verb (e.g. Built, Optimized, Spearheaded).
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...experiences];
                        updated[index].description = [...(updated[index].description || []), ""];
                        onChange(updated);
                      }}
                      className="h-7 text-xs font-medium px-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Bullet
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {(exp.description || []).map((desc, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0 ml-1" />
                        <Input
                          value={desc}
                          onChange={(e) => {
                            const updated = [...experiences];
                            updated[index].description[dIdx] = e.target.value;
                            onChange(updated);
                          }}
                          placeholder="e.g. Developed RESTful APIs reducing latency by 28%..."
                          className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...experiences];
                            updated[index].description = updated[index].description.filter((_, i) => i !== dIdx);
                            onChange(updated);
                          }}
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {(exp.description || []).length === 0 && (
                      <p className="text-xs text-zinc-400 italic py-1">
                        No bullets added. Click &quot;Add Bullet&quot; to describe your impact.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer action: Delete Position */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Role
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
        onClick={addExperience}
        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all h-9 text-xs font-medium rounded-xl"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Work Experience
      </Button>
    </div>
  );
}
