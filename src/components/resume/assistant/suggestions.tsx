'use client';

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Sparkles } from "lucide-react";
import { WorkExperience, Project, Skill, Education } from "@/lib/types";
import { useState } from 'react';
import Tiptap from "@/components/ui/tiptap";

const DIFF_HIGHLIGHT_CLASSES = "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1 rounded-sm";

type SuggestionContent = WorkExperience | Project | Skill | Education;

interface SuggestionProps {
  type: 'work_experience' | 'project' | 'skill' | 'education';
  content: SuggestionContent;
  currentContent: SuggestionContent | null;
  onAccept: () => void;
  onReject: () => void;
}

interface WholeResumeSuggestionProps {
  onReject: () => void;
}

interface WorkExperienceSuggestionProps {
  content: WorkExperience;
  currentContent: WorkExperience | null;
}

function WorkExperienceSuggestion({ content: work, currentContent: currentWork }: WorkExperienceSuggestionProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className={cn(
            "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
            !currentWork || currentWork.position !== work.position && DIFF_HIGHLIGHT_CLASSES
          )}>
            {work.position.replace(/\*\*/g, '')}
          </h3>
          <p className={cn(
            "text-xs text-zinc-600 dark:text-zinc-400",
            !currentWork || currentWork.company !== work.company && DIFF_HIGHLIGHT_CLASSES
          )}>
            {work.company}
          </p>
        </div>
        <span className={cn(
          "text-[10px] text-zinc-500",
          !currentWork || currentWork.date !== work.date && DIFF_HIGHLIGHT_CLASSES
        )}>
          {work.date}
        </span>
      </div>
      <div className="space-y-1.5">
        {work.description.map((point, index) => {
          const currentPoint = currentWork?.description?.[index];
          const comparedWords = currentPoint 
            ? compareDescriptions(currentPoint, point)
            : [{ text: point.replace(/\*\*/g, ''), isNew: true, isBold: false, isStart: true, isEnd: true }];

          return (
            <div key={index} className="flex items-start gap-1.5">
              <span className="text-zinc-400 mt-0.5 text-xs">•</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 flex-1 flex flex-wrap">
                {comparedWords.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className={cn(
                      "inline-flex items-center",
                      word.isStart && "rounded-l-sm pl-1",
                      word.isEnd && "rounded-r-sm pr-1",
                      wordIndex < comparedWords.length - 1 && "mr-1",
                      word.isNew && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1 mx-0",
                    )}
                  >
                    {word.isBold ? (
                      <strong>{word.text}</strong>
                    ) : (
                      word.text
                    )}
                  </span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface ProjectSuggestionProps {
  content: Project;
  currentContent: Project | null;
}

function ProjectSuggestion({ content: project, currentContent: currentProject }: ProjectSuggestionProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-start">
        <h3 className={cn(
          "text-sm font-semibold text-zinc-900 dark:text-zinc-100",
          !currentProject || currentProject.name !== project.name && DIFF_HIGHLIGHT_CLASSES
        )}>
          {project.name}
        </h3>
        {project.date && (
          <span className={cn(
            "text-xs text-zinc-500",
            !currentProject || currentProject.date !== project.date && DIFF_HIGHLIGHT_CLASSES
          )}>
            {project.date}
          </span>
        )}
      </div>
      <div className="space-y-2">
        {project.description.map((point, index) => {
          const currentPoint = currentProject?.description?.[index];
          const comparedWords = currentPoint 
            ? compareDescriptions(currentPoint, point)
            : [{ text: point.replace(/\*\*/g, ''), isNew: true, isBold: false, isStart: true, isEnd: true }];

          return (
            <div key={index} className="flex items-start gap-1.5">
              <span className="text-zinc-400 mt-0.5 text-xs">•</span>
              <p className="text-xs text-zinc-700 dark:text-zinc-300 flex-1 flex flex-wrap">
                {comparedWords.map((word, wordIndex) => (
                  <span
                    key={wordIndex}
                    className={cn(
                      "inline-flex items-center",
                      word.isNew && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
                      word.isStart && "rounded-l-sm pl-1",
                      word.isEnd && "rounded-r-sm pr-1",
                      wordIndex < comparedWords.length - 1 && "mr-1",
                      word.isNew && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1 mx-0",
                    )}
                  >
                    {word.isBold ? (
                      <strong>{word.text}</strong>
                    ) : (
                      word.text
                    )}
                  </span>
                ))}
              </p>
            </div>
          );
        })}
      </div>
      {project.technologies && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className={cn(
                "px-2 py-0.5 text-xs rounded-full border text-zinc-700 dark:text-zinc-300",
                !currentProject || isNewItem(currentProject.technologies, project.technologies, tech)
                  ? DIFF_HIGHLIGHT_CLASSES
                  : "bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
              )}
            >
              {tech.replace(/\*\*/g, '')}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface SkillSuggestionProps {
  content: Skill;
  currentContent: Skill | null;
}

function SkillSuggestion({ content: skill, currentContent: currentSkill }: SkillSuggestionProps) {
  return (
    <div className="space-y-3">
      {/* Category Header */}
      <div className="flex-1">
        <Tiptap
          content={skill.category}
          onChange={() => {}}
          readOnly={true}
          variant="skill"
          className={cn(
            "text-xs font-semibold tracking-wide",
            "bg-transparent",
            "border-none shadow-none",
            !currentSkill || currentSkill.category !== skill.category && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 px-2 py-1 rounded-md"
          )}
        />
      </div>

      {/* Skills Grid */}
      <div className="flex flex-wrap gap-2">
        {skill.items.map((item, index) => {
          const isNew = !currentSkill || isNewItem(currentSkill.items, skill.items, item);
          
          return (
            <div
              key={index}
              className={cn(
                "relative group transition-all duration-300",
                "rounded-lg overflow-hidden",
                isNew ? [
                  "bg-emerald-50/80 dark:bg-emerald-950/30",
                  "border border-emerald-200 dark:border-emerald-850",
                  "shadow-sm",
                ] : [
                  "bg-zinc-50 dark:bg-zinc-800/60",
                  "border border-zinc-200/80 dark:border-zinc-700/80",
                  "shadow-sm",
                ],
                "hover:-translate-y-0.5 hover:shadow-md"
              )}
            >
              <div className="relative px-3 py-1.5">
                <Tiptap
                  content={item}
                  onChange={() => {}}
                  readOnly={true}
                  variant="skill"
                  className={cn(
                    "border-none shadow-none p-0",
                    "text-xs",
                    "bg-transparent",
                    isNew ? "text-emerald-700 dark:text-emerald-300" : "text-zinc-700 dark:text-zinc-300"
                  )}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface EducationSuggestionProps {
  content: Education;
  currentContent: Education | null;
}

function EducationSuggestion({ content: education, currentContent: currentEducation }: EducationSuggestionProps) {
  return (
    <div className="space-y-2 w-full">
      <div className="flex justify-between items-start">
        <div>
          <h3 className={cn(
            "font-semibold text-xs text-zinc-900 dark:text-zinc-100",
            !currentEducation || (currentEducation.degree !== education.degree || currentEducation.field !== education.field) && DIFF_HIGHLIGHT_CLASSES
          )}>
            <span>
              {education.degree.split(/(\*\*.*?\*\*)/).map((part, i) => 
                part.startsWith('**') && part.endsWith('**') ? 
                  <strong key={i}>{part.slice(2, -2)}</strong> : 
                  part
              )}
            </span>
            {' in '}
            <span>
              {education.field.split(/(\*\*.*?\*\*)/).map((part, i) => 
                part.startsWith('**') && part.endsWith('**') ? 
                  <strong key={i}>{part.slice(2, -2)}</strong> : 
                  part
              )}
            </span>
          </h3>
          <p className={cn(
            "text-xs text-zinc-600 dark:text-zinc-400",
            !currentEducation || currentEducation.school !== education.school && DIFF_HIGHLIGHT_CLASSES
          )}>
            {education.school.replace(/\*\*/g, '')}
          </p>
        </div>
        <span className={cn(
          "text-[10px] text-zinc-500",
          !currentEducation || currentEducation.date !== education.date && DIFF_HIGHLIGHT_CLASSES
        )}>
          {education.date.replace(/\*\*/g, '')}
        </span>
      </div>
      {education.achievements && (
        <div className="space-y-1.5">
          {education.achievements.map((achievement, index) => {
            const currentAchievement = currentEducation?.achievements?.[index];
            const comparedWords = currentAchievement 
              ? compareDescriptions(currentAchievement, achievement)
              : [{ text: achievement.replace(/\*\*/g, ''), isNew: true, isBold: false, isStart: true, isEnd: true }];

            return (
              <div key={index} className="flex items-start gap-1.5">
                <span className="text-zinc-400 mt-0.5 text-xs">•</span>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 flex-1 flex flex-wrap">
                  {comparedWords.map((word, wordIndex) => (
                    <span
                      key={wordIndex}
                      className={cn(
                        "inline-flex items-center",
                        word.isNew && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300",
                        word.isStart && "rounded-l-sm pl-1",
                        word.isEnd && "rounded-r-sm pr-1",
                        wordIndex < comparedWords.length - 1 && "mr-1",
                        word.isNew && "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 px-1 mx-0",
                      )}
                    >
                      {word.isBold ? (
                        <strong>{word.text}</strong>
                      ) : (
                        word.text
                      )}
                    </span>
                  ))}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function compareDescriptions(current: string, suggested: string): {
  text: string;
  isNew: boolean;
  isBold: boolean;
  isStart: boolean;
  isEnd: boolean;
}[] {
  const cleanText = (text: string): string => {
    return text.trim().replace(/\s+/g, ' ');
  };

  const splitText = (text: string): string[] => {
    const parts = text.split(/(\*\*[^*]+\*\*)/).filter(Boolean);
    return parts.flatMap(part => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return [part];
      }
      return part.split(/\s+/).filter(Boolean);
    });
  };

  const currentText = cleanText(current);
  const suggestedText = cleanText(suggested);
  
  const currentWords = splitText(currentText);
  const suggestedWords = splitText(suggestedText);
  
  return suggestedWords.map((word, index) => {
    const isBold = word.startsWith('**') && word.endsWith('**');
    const cleanedWord = isBold ? word.slice(2, -2) : word;
    
    const isNew = !currentWords.some(currentWord => {
      const currentIsBold = currentWord.startsWith('**') && currentWord.endsWith('**');
      const currentCleaned = currentIsBold ? currentWord.slice(2, -2) : currentWord;
      return currentCleaned === cleanedWord;
    });
    
    const prevWord = index > 0 ? suggestedWords[index - 1] : null;
    const nextWord = index < suggestedWords.length - 1 ? suggestedWords[index + 1] : null;
    
    const prevIsNew = prevWord ? !currentWords.includes(prevWord) : false;
    const nextIsNew = nextWord ? !currentWords.includes(nextWord) : false;
    
    return {
      text: cleanedWord,
      isNew,
      isBold,
      isStart: isNew && !prevIsNew,
      isEnd: isNew && !nextIsNew
    };
  });
}

function isNewItem<T>(current: T[] | undefined, suggested: T[] | undefined, item: T): boolean {
  if (!current) return true;
  return !current.includes(item);
}

export function Suggestion({ type, content, currentContent, onAccept, onReject }: SuggestionProps) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  const handleAccept = () => {
    setStatus('accepted');
    onAccept();
  };

  const handleReject = () => {
    setStatus('rejected');
    onReject();
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'accepted':
        return {
          card: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
          icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
          iconColor: "text-emerald-600 dark:text-emerald-400",
          label: "text-emerald-700 dark:text-emerald-300",
          text: "Accepted"
        };
      case 'rejected':
        return {
          card: "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800",
          icon: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
          iconColor: "text-red-600 dark:text-red-400",
          label: "text-red-700 dark:text-red-300",
          text: "Rejected"
        };
      default:
        return {
          card: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
          icon: "bg-[#3861fb]/10 text-[#3861fb]",
          iconColor: "text-[#3861fb]",
          label: "text-zinc-900 dark:text-zinc-100",
          text: "AI Suggestion"
        };
    }
  };

  const statusStyles = getStatusStyles();

  const renderContent = () => {
    switch (type) {
      case 'work_experience':
        return <WorkExperienceSuggestion content={content as WorkExperience} currentContent={currentContent as WorkExperience | null} />;
      case 'project':
        return <ProjectSuggestion content={content as Project} currentContent={currentContent as Project | null} />;
      case 'skill':
        return <SkillSuggestion content={content as Skill} currentContent={currentContent as Skill | null} />;
      case 'education':
        return <EducationSuggestion content={content as Education} currentContent={currentContent as Education | null} />;
    }
  };

  return (
    <Card className={cn(
      "group relative overflow-hidden",
      "border p-3 rounded-xl",
      statusStyles.card,
      "shadow-sm hover:shadow-md transition-all duration-300"
    )}>
      <div className="relative space-y-2.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn("p-1 rounded-md", statusStyles.icon)}>
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <span className={cn("font-medium text-xs", statusStyles.label)}>{statusStyles.text}</span>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-50/80 dark:bg-zinc-950/60 rounded-lg p-3 border border-zinc-200/80 dark:border-zinc-800/80">
          {renderContent()}
        </div>

        {/* Action Buttons */}
        {status === 'pending' && (
          <div className="flex justify-end gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReject}
              className="h-7 px-3 text-xs border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:border-red-200 rounded-md"
            >
              <X className="mr-1 h-3 w-3" />
              <span>Reject</span>
            </Button>

            <Button
              size="sm"
              onClick={handleAccept}
              className="h-7 px-3 text-xs bg-[#3861fb] hover:bg-[#3861fb]/90 text-white rounded-md shadow-sm"
            >
              <Check className="mr-1 h-3 w-3" />
              <span>Accept</span>
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

export function WholeResumeSuggestion({ onReject }: WholeResumeSuggestionProps) {
  const [status, setStatus] = useState<'pending' | 'accepted' | 'rejected'>('pending');

  const handleAccept = () => {
    setStatus('accepted');
  };

  const handleReject = () => {
    setStatus('rejected');
    onReject();
  };

  const statusStyles = {
    pending: {
      card: "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
      icon: "bg-[#3861fb]/10 text-[#3861fb]",
      label: "text-zinc-900 dark:text-zinc-100",
      text: "Modified Resume"
    },
    accepted: {
      card: "bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
      icon: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400",
      label: "text-emerald-700 dark:text-emerald-300",
      text: "Changes Accepted"
    },
    rejected: {
      card: "bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-800",
      icon: "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400",
      label: "text-red-700 dark:text-red-300",
      text: "Changes Rejected"
    }
  }[status];

  return (
    <Card className={cn(
      "group relative overflow-hidden p-3 rounded-xl border",
      statusStyles.card,
      "shadow-sm transition-all duration-300"
    )}>
      <div className="flex items-center gap-2 mb-2">
        <div className={cn("p-1 rounded-md", statusStyles.icon)}>
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className={cn("font-medium text-xs", statusStyles.label)}>
          {statusStyles.text}
        </span>
      </div>

      {status === 'pending' && (
        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReject}
            className="h-7 px-3 text-xs border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-red-600 hover:border-red-200 rounded-md"
          >
            <X className="mr-1 h-3 w-3" />
            <span>Undo Changes</span>
          </Button>

          <Button
            size="sm"
            onClick={handleAccept}
            className="h-7 px-3 text-xs bg-[#3861fb] hover:bg-[#3861fb]/90 text-white rounded-md shadow-sm"
          >
            <Check className="mr-1 h-3 w-3" />
            <span>Keep Changes</span>
          </Button>
        </div>
      )}
    </Card>
  );
}
