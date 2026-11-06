'use client';

import { Project } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, FolderGit2, Globe, Github, Calendar, Code2, ExternalLink } from "lucide-react";
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
    setTechInputs(
      Object.fromEntries(projects.map((p, i) => [i, p.technologies?.join(', ') || '']))
    );
  }, [projects]);

  const addProject = () => {
    onChange([
      ...projects,
      {
        name: "",
        description: [""],
        technologies: [],
        url: "",
        github_url: "",
        date: ""
      }
    ]);
  };

  const updateProject = (index: number, field: keyof Project, value: Project[typeof field]) => {
    const updated = [...projects];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeProject = (index: number) => {
    onChange(projects.filter((_, i) => i !== index));
  };

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <FolderGit2 className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No projects added</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mb-4">
          Highlight capstone, full-stack, AI, or open-source projects. Recruiter ATS filters rank resumes with verified live and GitHub URLs higher.
        </p>
        <Button
          type="button"
          onClick={addProject}
          size="sm"
          className="bg-[#3861fb] text-white hover:bg-[#3861fb]/90 font-medium text-xs h-9 px-4 rounded-lg shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add First Project
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={projects.map((_, index) => `project-${index}`)}
      >
        {projects.map((project, index) => (
          <AccordionItem
            key={index}
            value={`project-${index}`}
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all rounded-xl overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1 text-left">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {project.name || "Untitled Project"}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                    {project.date && <span>{project.date}</span>}
                    {project.technologies && project.technologies.length > 0 && (
                      <span className="truncate max-w-[240px] text-zinc-400">
                        • {project.technologies.slice(0, 3).join(", ")}
                        {project.technologies.length > 3 && ` +${project.technologies.length - 3}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {project.url && (
                    <span 
                      onClick={(e) => { e.stopPropagation(); window.open(project.url, '_blank'); }}
                      className="p-1 hover:text-[#3861fb] text-zinc-400 transition-colors cursor-pointer"
                      title="Open Live URL"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </span>
                  )}
                  {project.github_url && (
                    <span 
                      onClick={(e) => { e.stopPropagation(); window.open(project.github_url, '_blank'); }}
                      className="p-1 hover:text-zinc-900 dark:hover:text-zinc-100 text-zinc-400 transition-colors cursor-pointer"
                      title="Open GitHub Repo"
                    >
                      <Github className="h-3.5 w-3.5" />
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-4">
                {/* Project Name & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Project Title
                    </Label>
                    <div className="relative">
                      <FolderGit2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={project.name}
                        onChange={(e) => updateProject(index, 'name', e.target.value)}
                        placeholder="e.g. Distributed Cache & KV Store"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Timeline / Date
                    </Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        value={project.date || ''}
                        onChange={(e) => updateProject(index, 'date', e.target.value)}
                        placeholder="e.g. Oct 2023 - Nov 2023"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Live URL & GitHub URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Live Deployment URL
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        type="url"
                        value={project.url || ''}
                        onChange={(e) => updateProject(index, 'url', e.target.value)}
                        placeholder="https://myproject.vercel.app"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      GitHub Repository URL
                    </Label>
                    <div className="relative">
                      <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                      <Input
                        type="url"
                        value={project.github_url || ''}
                        onChange={(e) => updateProject(index, 'github_url', e.target.value)}
                        placeholder="https://github.com/username/project"
                        className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                      />
                    </div>
                  </div>
                </div>

                {/* Technologies */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Technologies & Libraries
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
                        updateProject(index, 'technologies', list);
                      }}
                      onBlur={(e) => {
                        const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                        updateProject(index, 'technologies', list);
                        setTechInputs(prev => ({ ...prev, [index]: list.join(', ') }));
                      }}
                      placeholder="e.g. Next.js, Go, Redis, Docker, Tailwind CSS"
                      className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                    />
                  </div>

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {project.technologies.map((tech, tIdx) => (
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

                {/* Key Features & Impact Bullets */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                        Features & Engineering Impact
                      </Label>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        Describe architectural decisions, performance benchmarks, or user adoption metrics.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const updated = [...projects];
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
                    {(project.description || []).map((desc, dIdx) => (
                      <div key={dIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0 ml-1" />
                        <Input
                          value={desc}
                          onChange={(e) => {
                            const updated = [...projects];
                            const descArr = [...(updated[index].description || [])];
                            descArr[dIdx] = e.target.value;
                            updated[index].description = descArr;
                            onChange(updated);
                          }}
                          placeholder="e.g. Implemented RAFT consensus protocol achieving 99.9% uptime across 5 nodes..."
                          className="h-8 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const updated = [...projects];
                            updated[index].description = (updated[index].description || []).filter((_, i) => i !== dIdx);
                            onChange(updated);
                          }}
                          className="h-8 w-8 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md shrink-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                    {(project.description || []).length === 0 && (
                      <p className="text-xs text-zinc-400 italic py-1">
                        No bullets added. Click &quot;Add Bullet&quot; to describe what you engineered.
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer action: Delete Project */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Project
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
        onClick={addProject}
        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all h-9 text-xs font-medium rounded-xl"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Project
      </Button>
    </div>
  );
}
