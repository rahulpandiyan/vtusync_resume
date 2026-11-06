'use client';

import { Skill } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Wrench, Sparkles, Tags } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React from "react";

interface ProfileSkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export function ProfileSkillsForm({ skills, onChange }: ProfileSkillsFormProps) {
  const [skillInputs, setSkillInputs] = React.useState<{ [key: number]: string }>(
    Object.fromEntries(skills.map((s, i) => [i, s.items?.join(', ') || '']))
  );

  React.useEffect(() => {
    setSkillInputs(
      Object.fromEntries(skills.map((s, i) => [i, s.items?.join(', ') || '']))
    );
  }, [skills]);

  const addSkill = () => {
    onChange([
      ...skills,
      {
        category: "",
        items: []
      }
    ]);
  };

  const updateSkill = (index: number, field: keyof Skill, value: Skill[typeof field]) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkill = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500 mb-3">
          <Wrench className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No skill categories added</h3>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-sm mb-4">
          Organize your technical proficiencies by category (e.g., Languages, Frameworks, Cloud, Databases). The AI matches these directly against ATS job keywords.
        </p>
        <Button
          type="button"
          onClick={addSkill}
          size="sm"
          className="bg-[#3861fb] text-white hover:bg-[#3861fb]/90 font-medium text-xs h-9 px-4 rounded-lg shadow-sm"
        >
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add First Category
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Accordion 
        type="multiple" 
        className="space-y-3"
        defaultValue={skills.map((_, index) => `skill-${index}`)}
      >
        {skills.map((skill, index) => (
          <AccordionItem
            key={index}
            value={`skill-${index}`}
            className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all rounded-xl overflow-hidden shadow-sm"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center justify-between gap-3 flex-1 text-left">
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                    {skill.category || "Untitled Category"}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate max-w-[320px]">
                    {skill.items && skill.items.length > 0 
                      ? skill.items.join(" • ") 
                      : "No skills listed yet"}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="secondary" className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 rounded-md px-2 py-0.5">
                    {skill.items?.length || 0} {skill.items?.length === 1 ? 'skill' : 'skills'}
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="px-5 pb-5 pt-2 border-t border-zinc-100 dark:border-zinc-800/60 space-y-4">
                {/* Category Name */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                    Category Name
                  </Label>
                  <div className="relative">
                    <Tags className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
                    <Input
                      value={skill.category}
                      onChange={(e) => updateSkill(index, 'category', e.target.value)}
                      placeholder="e.g. Programming Languages, Frameworks, Cloud & DevOps, Databases"
                      className="pl-9 h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                    />
                  </div>
                </div>

                {/* Skills Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Skills in this Category
                    </Label>
                    <span className="text-[10px] text-zinc-400">Separate with commas</span>
                  </div>
                  <Input
                    value={skillInputs[index] || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSkillInputs(prev => ({ ...prev, [index]: val }));
                      const list = val.split(',').map(s => s.trim()).filter(Boolean);
                      updateSkill(index, 'items', list);
                    }}
                    onBlur={(e) => {
                      const list = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                      updateSkill(index, 'items', list);
                      setSkillInputs(prev => ({ ...prev, [index]: list.join(', ') }));
                    }}
                    placeholder="e.g. TypeScript, Python, Java, C++, Go"
                    className="h-9 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
                  />

                  {/* Visual chips preview */}
                  {skill.items && skill.items.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {skill.items.map((item, iIdx) => (
                        <Badge
                          key={iIdx}
                          variant="secondary"
                          className="text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 px-2.5 py-1 rounded-md"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer action: Delete Category */}
                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(index)}
                    className="h-8 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 px-2.5 rounded-lg"
                  >
                    <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                    Remove Category
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
        onClick={addSkill}
        className="w-full bg-zinc-50 dark:bg-zinc-900/40 border-dashed border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all h-9 text-xs font-medium rounded-xl"
      >
        <Plus className="h-3.5 w-3.5 mr-1.5" />
        Add Skill Category
      </Button>
    </div>
  );
}
