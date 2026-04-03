'use client';

import { Skill, Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImportFromProfileDialog } from "../../management/dialogs/import-from-profile-dialog";
import { useState, KeyboardEvent } from 'react';

interface SkillsFormProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
  profile: Profile;
}

export function SkillsForm({
  skills,
  onChange,
  profile
}: SkillsFormProps) {
  const [newSkills, setNewSkills] = useState<{ [key: number]: string }>({});

  const reorderIndexMap = <T,>(map: Record<number, T>, from: number, to: number): Record<number, T> => {
    const updated: Record<number, T> = {};

    Object.entries(map).forEach(([key, value]) => {
      const idx = Number(key);

      if (idx === from) {
        updated[to] = value;
      } else if (from < to && idx > from && idx <= to) {
        updated[idx - 1] = value;
      } else if (from > to && idx >= to && idx < from) {
        updated[idx + 1] = value;
      } else {
        updated[idx] = value;
      }
    });

    return updated;
  };

  const addSkillCategory = () => {
    onChange([{
      category: "",
      items: []
    }, ...skills]);
  };

  const updateSkillCategory = (index: number, field: keyof Skill, value: string | string[]) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const removeSkillCategory = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const moveSkillCategory = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= skills.length) return;

    const reorder = <T,>(map: Record<number, T>) => reorderIndexMap(map, index, newIndex);

    const updated = [...skills];
    const [item] = updated.splice(index, 1);
    updated.splice(newIndex, 0, item);

    setNewSkills((prev) => reorder(prev));
    onChange(updated);
  };

  const addSkill = (categoryIndex: number) => {
    const skillToAdd = newSkills[categoryIndex]?.trim();
    if (!skillToAdd) return;

    const updated = [...skills];
    const currentItems = updated[categoryIndex].items || [];
    if (!currentItems.includes(skillToAdd)) {
      updated[categoryIndex] = {
        ...updated[categoryIndex],
        items: [...currentItems, skillToAdd]
      };
      onChange(updated);
    }
    setNewSkills({ ...newSkills, [categoryIndex]: '' });
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>, categoryIndex: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(categoryIndex);
    }
  };

  const removeSkill = (categoryIndex: number, skillIndex: number) => {
    const updated = skills.map((skill, idx) => {
      if (idx === categoryIndex) {
        return {
          ...skill,
          items: skill.items.filter((_, i) => i !== skillIndex)
        };
      }
      return skill;
    });
    onChange(updated);
  };

  const handleImportFromProfile = (importedSkills: Skill[]) => {
    onChange([...importedSkills, ...skills]);
  };

  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="@container">
        <div className={cn(
          "flex flex-col @[400px]:flex-row gap-2",
          "transition-all duration-300 ease-in-out"
        )}>
          <Button 
            variant="outline" 
            className={cn(
              "flex-1 h-9 min-w-[120px]",
              "bg-white dark:bg-zinc-950",
              "border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900",
              "text-zinc-900 dark:text-zinc-100",
              "transition-all duration-200",
              "rounded-lg",
              "whitespace-nowrap text-[11px] @[300px]:text-sm"
            )}
            onClick={addSkillCategory}
          >
            <Plus className="h-4 w-4 mr-2 shrink-0" />
            Add Skill Category
          </Button>

          <ImportFromProfileDialog<Skill>
            profile={profile}
            onImport={handleImportFromProfile}
            type="skills"
            buttonClassName={cn(
              "flex-1 mb-0 h-9 min-w-[120px]",
              "whitespace-nowrap text-[11px] @[300px]:text-sm",
              "bg-white dark:bg-zinc-950",
              "border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-900",
              "text-zinc-900 dark:text-zinc-100 rounded-lg"
            )}
          />
        </div>
      </div>

      {skills.map((skill, index) => (
        <Card 
          key={index} 
          className={cn(
            "relative group transition-all duration-200",
            "bg-white dark:bg-zinc-950",
            "border border-zinc-200 dark:border-zinc-800 rounded-xl",
            "shadow-sm"
          )}
        >
          <CardContent className="p-3 sm:p-4 space-y-3 sm:space-y-4">
            <div className="space-y-2 sm:space-y-3">
              {/* Category Name and Delete Button Row */}
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="relative group flex-1">
                  <Input
                    value={skill.category}
                    onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                    className={cn(
                      "text-sm font-medium h-9",
                      "bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg",
                      "focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600",
                      "transition-colors",
                      "placeholder:text-zinc-400"
                    )}
                    placeholder="Category Name"
                  />
                  <div className="absolute -top-2 left-2 px-1 bg-white dark:bg-zinc-950 text-[7px] sm:text-[9px] font-medium text-zinc-500 uppercase">
                    CATEGORY
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeSkillCategory(index)}
                  className="text-zinc-400 hover:text-red-500 transition-colors duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Skills Display */}
              <div className="space-y-2 sm:space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {skill.items.map((item, skillIndex) => (
                    <Badge
                      key={skillIndex}
                      variant="secondary"
                      className={cn(
                          "bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 py-0.5",
                          "transition-all duration-200 group/badge cursor-default text-[10px] sm:text-xs"
                      )}
                    >
                      {item}
                      <button
                        onClick={() => removeSkill(index, skillIndex)}
                        className="ml-1.5 hover:text-red-500 opacity-50 hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* New Skill Input */}
                <div className="relative group flex gap-2">
                  <Input
                    value={newSkills[index] || ''}
                    onChange={(e) => setNewSkills({ ...newSkills, [index]: e.target.value })}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    className={cn(
                      "h-9 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg",
                      "focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600",
                      "transition-colors",
                      "placeholder:text-zinc-400",
                      "text-[10px] sm:text-xs"
                    )}
                    placeholder="Type a skill and press Enter or click +"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addSkill(index)}
                    className="h-9 px-2 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <div className="absolute -top-2 left-2 px-1 bg-white dark:bg-zinc-950 text-[7px] sm:text-[9px] font-medium text-zinc-500 uppercase">
                    ADD SKILL
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveSkillCategory(index, -1)}
                disabled={index === 0}
                className={cn(
                  "h-6 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
                  "bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "border border-zinc-200 dark:border-zinc-800 rounded-md",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveSkillCategory(index, 1)}
                disabled={index === skills.length - 1}
                className={cn(
                  "h-6 w-8 text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100",
                  "bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                  "border border-zinc-200 dark:border-zinc-800 rounded-md",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 
