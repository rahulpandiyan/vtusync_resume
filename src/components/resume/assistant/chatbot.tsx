'use client';

import React, { useCallback, useState } from 'react';
import { useChat } from 'ai/react';
import { Card } from "@/components/ui/card";
import { Bot, Trash2, Pencil, ChevronDown, RefreshCw, Sparkles } from "lucide-react";
import { Education, Project, Resume, Skill, WorkExperience, Job } from '@/lib/types';
import { Message } from 'ai';
import { cn, withBasePath } from '@/lib/utils';
import { ToolInvocation } from 'ai';
import { MemoizedMarkdown } from '@/components/ui/memoized-markdown';
import { Suggestion } from './suggestions';
import { SuggestionSkeleton } from './suggestion-skeleton';
import ChatInput from './chat-input';
import { LoadingDots } from '@/components/ui/loading-dots';
import LatticeLoader from '@/components/ui/lattice-loader';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { WholeResumeSuggestion } from './suggestions';
import { QuickSuggestions } from './quick-suggestions';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ApiKeyErrorAlert } from '@/components/ui/api-key-error-alert';
import { Textarea } from '@/components/ui/textarea';
import { useApiKeys, useDefaultModel } from '@/hooks/use-api-keys';
import { useCustomPrompts } from '@/hooks/use-custom-prompts';
import { useCustomProviders } from '@/hooks/use-custom-providers';

interface ChatBotProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[typeof field]) => void;
  job?: Job | null;
}

function ScrollToBottom() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  return (
    !isAtBottom && (
      <button
        className="absolute z-50 rounded-full p-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-md hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all left-[50%] -translate-x-1/2 bottom-3"
        onClick={() => scrollToBottom()}
      >
        <ChevronDown className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-300" />
      </button>
    )
  );
}

export default function ChatBot({ resume, onResumeChange, job }: ChatBotProps) {
  const router = useRouter();
  const [accordionValue, setAccordionValue] = React.useState<string>("");
  
  const { apiKeys } = useApiKeys();
  const { defaultModel } = useDefaultModel();
  const { customPrompts } = useCustomPrompts();
  const { customProviders } = useCustomProviders();
  
  const [originalResume, setOriginalResume] = React.useState<Resume | null>(null);
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);

  const config = {
    model: defaultModel,
    apiKeys,
    customPrompts: Object.keys(customPrompts).length > 0 ? customPrompts : undefined,
    customProviders,
  };
  
  const { messages, error, append, isLoading, addToolResult, stop, setMessages } = useChat({
    api: withBasePath('/api/chat'),
    body: {
      target_role: resume.target_role,
      resume: resume,
      config,
      job: job,
    },
    maxSteps: 5,
    onResponse() {
      setIsInitialLoading(false);
    },
    onError() {
      setIsInitialLoading(false);
    },
    async onToolCall({ toolCall }) {
      if (toolCall.toolName === 'getResume') {
        const params = toolCall.args as { sections: string[] };
        
        const personalInfo = {
          first_name: resume.first_name,
          last_name: resume.last_name,
          email: resume.email,
          phone_number: resume.phone_number,
          location: resume.location,
          website: resume.website,
          linkedin_url: resume.linkedin_url,
          github_url: resume.github_url,
        };

        const sectionMap = {
          personal_info: personalInfo,
          work_experience: resume.work_experience,
          education: resume.education,
          skills: resume.skills,
          projects: resume.projects,
        };

        const result = params.sections.includes('all')
          ? { ...sectionMap, target_role: resume.target_role }
          : params.sections.reduce((acc, section) => ({
              ...acc,
              [section]: sectionMap[section as keyof typeof sectionMap]
            }), {});
        
        addToolResult({ toolCallId: toolCall.toolCallId, result });
        return result;
      }

      if (toolCall.toolName === 'suggest_work_experience_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_project_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_skill_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'suggest_education_improvement') {
        return toolCall.args;
      }

      if (toolCall.toolName === 'modifyWholeResume') {
        const updates = toolCall.args as {
          basic_info?: Partial<{
            first_name: string;
            last_name: string;
            email: string;
            phone_number: string;
            location: string;
            website: string;
            linkedin_url: string;
            github_url: string;
          }>;
          work_experience?: WorkExperience[];
          education?: Education[];
          skills?: Skill[];
          projects?: Project[];
        };
        
        setOriginalResume({ ...resume });
        
        if (updates.basic_info) {
          Object.entries(updates.basic_info).forEach(([key, value]) => {
            if (value !== undefined) {
              onResumeChange(key as keyof Resume, value);
            }
          });
        }

        const sections = {
          work_experience: updates.work_experience,
          education: updates.education,
          skills: updates.skills,
          projects: updates.projects,
        };

        Object.entries(sections).forEach(([key, value]) => {
          if (value !== undefined) {
            onResumeChange(key as keyof Resume, value);
          }
        });

        const result = { success: true };
        addToolResult({ toolCallId: toolCall.toolCallId, result });
        return result;
      }
    },
    onFinish() {
      setIsInitialLoading(false);
    },
  });

  const handleSubmit = useCallback((message: string) => {
    setIsInitialLoading(true);
    setAccordionValue("chat");
    append({ 
      content: message.replace(/\s+$/, ''),
      role: 'user',
    });
  }, [append]);

  const handleDelete = (id: string) => {
    setMessages(messages.filter(message => message.id !== id));
  };

  const handleEdit = (id: string, content: string) => {
    setEditingMessageId(id);
    setEditContent(content);
  };

  const handleSaveEdit = (id: string) => {
    setMessages(messages.map(message => 
      message.id === id 
        ? { ...message, content: editContent }
        : message
    ));
    setEditingMessageId(null);
    setEditContent("");
  };

  const handleClearChat = useCallback(() => {
    setMessages([]);
    setOriginalResume(null);
    setEditingMessageId(null);
    setEditContent("");
  }, [setMessages]);

  return (
    <Card className="flex flex-col w-full mx-auto bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 shadow-md rounded-xl overflow-hidden relative">
      <Accordion
        type="single"
        collapsible
        value={accordionValue}
        onValueChange={setAccordionValue}
        className="relative z-10"
      >
        <AccordionItem value="chat" className="border-none py-0 my-0 flex flex-col-reverse">
          {/* Accordion Trigger (Always Visible Bar) */}
          <div className="relative">
            <AccordionTrigger className="px-3 py-2 hover:no-underline group transition-all data-[state=open]:border-t border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex items-center justify-between w-full pr-8">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded-md bg-[#3861fb]/10 text-[#3861fb]">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    AI Resume Copilot
                  </span>
                  {(isLoading || isInitialLoading) ? (
                    <span className="inline-flex items-center ml-2">
                      <LatticeLoader status="working" label="Thinking" color="#3861fb" fontSize={11} cellSize={3.5} gap={1} showTimer={true} />
                    </span>
                  ) : (
                    <span className="text-[10px] text-zinc-400 hidden sm:inline">
                      • Ask for suggestions, bullet rewrites, or ATS scoring
                    </span>
                  )}
                </div>
              </div>
            </AccordionTrigger>

            {/* Clear History Button */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  className={cn(
                    "absolute right-10 top-1/2 -translate-y-1/2",
                    "h-7 w-7 p-0 rounded-md",
                    "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800",
                    "transition-colors",
                    (accordionValue !== "chat" || isAlertOpen) && "hidden",
                  )}
                  disabled={messages.length === 0}
                  aria-label="Clear chat history"
                  variant="ghost"
                  size="sm"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl sm:max-w-[400px]">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Clear Chat History
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-zinc-500">
                    This will remove all messages in this session. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-xs h-8">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearChat}
                    className="bg-red-600 hover:bg-red-700 text-white text-xs h-8"
                  >
                    Clear Chat
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Expanded Drawer Content */}
          <AccordionContent className="space-y-3 pb-2">
            <StickToBottom className="h-[30vh] sm:h-[35vh] max-h-[350px] px-3 sm:px-4 relative custom-scrollbar overflow-y-auto" resize="smooth" initial="smooth">
              <StickToBottom.Content className="flex flex-col custom-scrollbar space-y-2.5">
                {messages.length === 0 ? (
                  <QuickSuggestions onSuggestionClick={handleSubmit} />
                ) : (
                  <>
                    {messages.map((m: Message, index) => (
                      <React.Fragment key={index}>
                        {m.content && (
                          <div className="my-1.5">
                            <div className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={cn(
                                "rounded-xl px-3.5 py-2 max-w-[85%] text-xs relative group",
                                m.role === 'user' ? [
                                  "bg-[#3861fb]",
                                  "text-white",
                                  "ml-auto"
                                ] : [
                                  "bg-zinc-100 dark:bg-zinc-800",
                                  "border border-zinc-200/80 dark:border-zinc-700/80",
                                  "text-zinc-900 dark:text-zinc-100"
                                ]
                              )}>
                                {editingMessageId === m.id ? (
                                  <div className="flex flex-col gap-2">
                                    <Textarea
                                      value={editContent}
                                      onChange={(e) => setEditContent(e.target.value)}
                                      className="w-full min-h-[80px] p-2 text-xs rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
                                    />
                                    <button
                                      onClick={() => handleSaveEdit(m.id)}
                                      className="self-end px-2.5 py-1 rounded-md text-xs bg-[#3861fb] text-white hover:bg-[#3861fb]/90"
                                    >
                                      Save
                                    </button>
                                  </div>
                                ) : (
                                  <MemoizedMarkdown id={m.id} content={m.content} />
                                )}

                                <div className="absolute -bottom-4 left-1 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    onClick={() => handleDelete(m.id)}
                                    className="text-zinc-400 hover:text-red-500"
                                    aria-label="Delete message"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                  <button
                                    onClick={() => handleEdit(m.id, m.content)}
                                    className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                                    aria-label="Edit message"
                                  >
                                    <Pencil className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                          const { toolName, toolCallId, state, args } = toolInvocation;
                          switch (state) {
                            case 'partial-call':
                            case 'call':
                              return (
                                <div key={toolCallId} className="my-1.5 max-w-[90%]">
                                  {toolName === 'getResume' ? (
                                    <div className="rounded-lg px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                                      <LatticeLoader status="working" label="Analyzing resume content" color="#3861fb" fontSize={11} cellSize={3.5} gap={1} showTimer={true} />
                                    </div>
                                  ) : toolName === 'modifyWholeResume' ? (
                                    <div className="rounded-lg px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                                      Preparing resume modifications...
                                    </div>
                                  ) : toolName.startsWith('suggest_') ? (
                                    <SuggestionSkeleton />
                                  ) : null}
                                </div>
                              );

                            case 'result':
                              const toolConfig = {
                                suggest_work_experience_improvement: {
                                  type: 'work_experience' as const,
                                  field: 'work_experience',
                                  content: 'improved_experience',
                                },
                                suggest_project_improvement: {
                                  type: 'project' as const,
                                  field: 'projects',
                                  content: 'improved_project',
                                },
                                suggest_skill_improvement: {
                                  type: 'skill' as const,
                                  field: 'skills',
                                  content: 'improved_skill',
                                },
                                suggest_education_improvement: {
                                  type: 'education' as const,
                                  field: 'education',
                                  content: 'improved_education',
                                },
                                modifyWholeResume: {
                                  type: 'whole_resume' as const,
                                  field: 'all',
                                  content: null,
                                },
                              } as const;
                              const config = toolConfig[toolName as keyof typeof toolConfig];

                              if (!config) return null;

                              if (toolName === 'getResume') {
                                return (
                                  <div key={toolCallId} className="my-1 max-w-[90%]">
                                    <div className="rounded-lg px-3 py-1.5 text-xs bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400">
                                      Analyzed Resume ({args.sections?.join(', ') || 'all'}) ✓
                                    </div>
                                  </div>
                                );
                              }

                              if (config.type === 'whole_resume') {
                                return (
                                  <div key={toolCallId} className="my-1 max-w-[90%]">
                                    <WholeResumeSuggestion
                                      onReject={() => {
                                        if (originalResume) {
                                          Object.keys(originalResume).forEach((key) => {
                                            if (key !== 'id' && key !== 'created_at' && key !== 'updated_at') {
                                              onResumeChange(key as keyof Resume, originalResume[key as keyof Resume]);
                                            }
                                          });
                                          setOriginalResume(null);
                                        }
                                      }}
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div key={toolCallId} className="my-1 max-w-[90%]">
                                  <Suggestion
                                    type={config.type}
                                    content={args[config.content]}
                                    currentContent={resume[config.field][args.index]}
                                    onAccept={() => onResumeChange(config.field, 
                                      resume[config.field].map((item: WorkExperience | Education | Project | Skill, i: number) => 
                                        i === args.index ? args[config.content] : item
                                      )
                                    )}
                                    onReject={() => {}}
                                  />
                                </div>
                              );

                            default:
                              return null;
                          }
                        })}

                        {((isInitialLoading && index === messages.length - 1 && m.role === 'user') ||
                          (isLoading && index === messages.length - 1 && m.role === 'assistant')) && (
                          <div className="my-1">
                            <div className="rounded-xl px-3 py-1.5 w-fit bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                              <LatticeLoader status="working" label="Thinking" color="#3861fb" fontSize={12} cellSize={4} gap={1.5} showTimer={true} />
                            </div>
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </>
                )}
              
                {error && (
                  error.message === "Rate limit exceeded. Try again later." ? (
                    <div className="rounded-lg p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
                      <p>Rate limit reached. Please try again in a few hours.</p>
                    </div>
                  ) : (
                    <ApiKeyErrorAlert 
                      error={error} 
                      router={router} 
                    />
                  )
                )}
              </StickToBottom.Content>

              <ScrollToBottom />
            </StickToBottom>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Input Bar */}
      <ChatInput
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onStop={stop}
      />
    </Card>
  );
}
