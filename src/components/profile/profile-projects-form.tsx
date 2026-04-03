'use client';

import { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProfileProjectsFormProps {
  projects: Project[];
  onChange: (projects: Project[]) => void;
}

export function ProfileProjectsForm({ projects, onChange }: ProfileProjectsFormProps) {
  const [techInputs, setTechInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(projects.map((p, i) => [i, p.technologies?.join(', ') || '']))
  );

  React.useEffect(() => {
    setTechInputs(Object.fromEntries(
      projects.map((p, i) => [i, p.technologies?.join(', ') || ''])
    ));
  }, [projects]);

  const addProject = () => {
    onChange([...projects, {
      name: "",
      description: [],
      technologies: [],
      url: "",
      github_url: "",
      date: ""
    }]);
  };

  const updateProject = (index: number, field: keyof Project, value: string | string[]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={projects.map((_, index) => `project-${index}`)}
      >
        {projects.map((project, index) => (
          <AccordionItem
            key={index}
            value={`project-${index}`}
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 rounded-md overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1">
                <div className="flex-1 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {project.name || "Untitled Project"}
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  {project.date && <span>{project.date}</span>}
                  {project.technologies && project.technologies.length > 0 && (
                    <span className="max-w-[200px] truncate">
                      {project.technologies.join(", ")}
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-4 pb-4 pt-2 space-y-4">
                {/* Project Name and Delete Button Row */}
                <div className="flex items-center justify-between gap-3">
                  <div className="relative group flex-1">
                    <Input
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      className="text-base bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 dark:focus:border-zinc-600 focus:ring-zinc-400 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400"
                      placeholder="Project Name"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      Project Name
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="text-zinc-400 hover:text-red-500 transition-colors duration-300 h-9 w-9"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>

                {/* URLs Row */}
                <div className="flex flex-col md:flex-row md:items-start gap-3 text-gray-600">
                  <div className="relative group flex-1">
                    <Input
                      type="url"
                      value={project.url || ''}
                      onChange={(e) => updateProject(index, 'url', e.target.value)}
                      className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400 text-sm"
                      placeholder="https://your-project.com"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      Live URL
                    </div>
                  </div>
                  <div className="relative group flex-1">
                    <Input
                      type="url"
                      value={project.github_url || ''}
                      onChange={(e) => updateProject(index, 'github_url', e.target.value)}
                      className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                        focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                        transition-colors placeholder:text-zinc-400 text-sm"
                      placeholder="https://github.com/username/project"
                    />
                    <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                      GitHub URL
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Technologies & Tools Used</Label>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Separate with commas</span>
                  </div>
                  <Input
                    value={techInputs[index] || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      setTechInputs(prev => ({ ...prev, [index]: newValue }));
                      
                      if (newValue.endsWith(',')) {
                        const technologies = newValue
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean);
                        updateProject(index, 'technologies', technologies);
                      } else {
                        const technologies = newValue
                          .split(',')
                          .map(t => t.trim())
                          .filter(Boolean);
                        updateProject(index, 'technologies', technologies);
                      }
                    }}
                    onBlur={(e) => {
                      const technologies = e.target.value
                        .split(',')
                        .map(t => t.trim())
                        .filter(Boolean);
                      updateProject(index, 'technologies', technologies);
                      setTechInputs(prev => ({ 
                        ...prev, 
                        [index]: technologies.join(', ') 
                      }));
                    }}
                    placeholder="React, TypeScript, Node.js, etc."
                    className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                      focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                      transition-colors placeholder:text-zinc-400 text-sm"
                  />
                </div>

                {/* Dates Row */}
                <div className="relative group">
                  <Input
                    type="text"
                    value={project.date || ''}
                    onChange={(e) => updateProject(index, 'date', e.target.value)}
                    className="w-full bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                      focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                      transition-colors placeholder:text-zinc-400 text-sm"
                    placeholder="e.g., 'Jan 2023 - Present' or 'Summer 2023'"
                  />
                  <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
                    Date
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-baseline">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Description</Label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const updated = [...projects];
                        updated[index].description = [...updated[index].description, ""];
                        onChange(updated);
                      }}
                      className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors h-7 text-xs"
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Point
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {project.description.map((desc, descIndex) => (
                      <div key={descIndex} className="flex gap-2 items-start">
                        <div className="flex-1">
                          <Input
                            value={desc}
                            onChange={(e) => {
                              const updated = [...projects];
                              updated[index].description[descIndex] = e.target.value;
                              onChange(updated);
                            }}
                            placeholder="Describe a key feature or achievement"
                            className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-md h-9
                              focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                              transition-colors placeholder:text-zinc-400 text-sm"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...projects];
                            updated[index].description = updated[index].description.filter((_, i) => i !== descIndex);
                            onChange(updated);
                          }}
                          className="text-zinc-400 hover:text-red-500 transition-colors duration-300 h-9 w-9"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {project.description.length === 0 && (
                      <div className="text-xs text-zinc-500 italic">
                        Add points to describe your project&apos;s features and achievements
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button 
        variant="outline" 
        className="w-full bg-zinc-50 dark:bg-zinc-900 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 h-9 text-sm"
        onClick={addProject}
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Project
      </Button>
    </div>
  );
} 