'use client';

import React, { useCallback, useState } from 'react';
import { useChat } from 'ai/react';
import { Bot, Trash2, Pencil, RefreshCw, Sparkles, Copy, Check, ThumbsUp, ThumbsDown, Brain } from "lucide-react";
import { Education, Project, Resume, Skill, WorkExperience, Job } from '@/lib/types';
import { Message as AIMessage } from 'ai';
import { cn, withBasePath } from '@/lib/utils';
import { ToolInvocation } from 'ai';
import { MemoizedMarkdown } from '@/components/ui/memoized-markdown';
import { Suggestion, WholeResumeSuggestion } from './suggestions';
import { SuggestionSkeleton } from './suggestion-skeleton';
import ChatInput from './chat-input';
import { QuickSuggestions } from './quick-suggestions';
import LatticeLoader from '@/components/ui/lattice-loader';
import {
  ChatContainerRoot,
  ChatContainerContent,
  ScrollButton,
  Message,
  MessageContent,
  MessageActions,
  MessageAction,
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ui/prompt-kit";
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
import { Button } from "@/components/ui/button";
import { useApiKeys, useDefaultModel } from '@/hooks/use-api-keys';
import { useCustomPrompts } from '@/hooks/use-custom-prompts';
import { useCustomProviders } from '@/hooks/use-custom-providers';
import { useRouter } from "next/navigation";
import Image from 'next/image';
import { toast } from 'sonner';

interface ChatBotProps {
  resume: Resume;
  onResumeChange: (field: keyof Resume, value: Resume[typeof field]) => void;
  job?: Job | null;
  standalone?: boolean;
}

export default function ChatBot({ resume, onResumeChange, job, standalone = true }: ChatBotProps) {
  const router = useRouter();
  const { apiKeys } = useApiKeys();
  const { defaultModel } = useDefaultModel();
  const { customPrompts } = useCustomPrompts();
  const { customProviders } = useCustomProviders();
  
  const [originalResume, setOriginalResume] = React.useState<Resume | null>(null);
  const [isInitialLoading, setIsInitialLoading] = React.useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isAlertOpen, setIsAlertOpen] = React.useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

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
    toast.success("Chat history cleared.");
  }, [setMessages]);

  const handleCopyMessage = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    toast.success("Copied to clipboard.");
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className={cn(
      "flex flex-col w-full h-full bg-white dark:bg-zinc-950 overflow-hidden relative",
      !standalone && "max-h-[600px] border border-zinc-200/80 dark:border-zinc-800 rounded-xl"
    )}>
      {/* Top Header Bar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-zinc-50/60 px-4 dark:border-zinc-800 dark:bg-zinc-900/40">
        <div className="flex items-center gap-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#3861fb]/10 text-[#3861fb]">
            <Image
              src="/favicon-16x16.png"
              alt=""
              width={16}
              height={16}
              className="h-4 w-4 object-contain"
            />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
          </div>
          <div>
            <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>SyncAI Copilot</span>
              <span className="text-[10px] font-semibold text-[#3861fb] bg-[#3861fb]/10 px-1.5 py-0.2 rounded-full">
                AI
              </span>
              {(isLoading || isInitialLoading) && (
                <span className="inline-flex items-center ml-1.5">
                  <LatticeLoader status="working" label="Thinking" color="#3861fb" fontSize={10} cellSize={3} gap={1} showTimer={true} />
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Clear History Button */}
          <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                disabled={messages.length === 0}
                className="h-7 px-2 text-xs text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 rounded-md"
                title="Clear conversation"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                <span className="hidden sm:inline">Clear</span>
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
      </div>

      {/* Main Conversation Stream via Prompt-Kit ChatContainer */}
      <ChatContainerRoot className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 relative custom-scrollbar">
        <ChatContainerContent className="space-y-4 max-w-3xl mx-auto w-full pb-8">
          {messages.length === 0 ? (
            <QuickSuggestions 
              onSuggestionClick={handleSubmit} 
              targetRole={resume.target_role}
            />
          ) : (
            <>
              {messages.map((m: AIMessage, index) => (
                <React.Fragment key={m.id || index}>
                  {m.content && (
                    <Message className={cn(
                      "w-full flex gap-3",
                      m.role === 'user' ? "justify-end" : "justify-start"
                    )}>
                      {m.role === 'assistant' && (
                        <div className="relative h-7 w-7 rounded-lg bg-[#3861fb]/10 border border-[#3861fb]/20 flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <Image
                            src="/favicon-16x16.png"
                            alt="SyncAI"
                            width={16}
                            height={16}
                            className="h-4 w-4 object-contain"
                          />
                        </div>
                      )}

                      <div className={cn(
                        "flex flex-col gap-1.5",
                        m.role === 'user' ? "max-w-[85%] items-end" : "max-w-[90%] items-start"
                      )}>
                        {/* Prompt-Kit User Bubble vs Assistant Content */}
                        {m.role === 'user' ? (
                          <div className="relative group">
                            {editingMessageId === m.id ? (
                              <div className="flex flex-col gap-2 p-2 rounded-2xl bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 min-w-[280px]">
                                <Textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full min-h-[60px] p-2 text-xs rounded-lg bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingMessageId(null)}
                                    className="h-7 px-2.5 text-xs"
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => handleSaveEdit(m.id)}
                                    className="h-7 px-2.5 text-xs bg-[#3861fb] hover:bg-[#2b50ea] text-white"
                                  >
                                    Save
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-2xl px-4 py-2.5 bg-[#3861fb] text-white text-xs sm:text-sm shadow-sm leading-relaxed">
                                <p className="whitespace-pre-wrap">{m.content}</p>
                              </div>
                            )}

                            {/* User Bubble Actions */}
                            <div className="absolute -bottom-4 right-1 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-zinc-900/90 rounded-md px-1 py-0.5 shadow-xs border border-zinc-200/60 dark:border-zinc-800">
                              <button
                                onClick={() => handleEdit(m.id, m.content)}
                                className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-0.5"
                                title="Edit prompt"
                              >
                                <Pencil className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => handleDelete(m.id)}
                                className="text-zinc-400 hover:text-red-500 p-0.5"
                                title="Delete"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full space-y-2 group">
                            {/* Assistant Message Content */}
                            <div className="rounded-2xl p-4 bg-zinc-50 dark:bg-zinc-900/70 border border-zinc-200/80 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 shadow-xs">
                              <MemoizedMarkdown id={m.id} content={m.content} />
                            </div>

                            {/* Prompt-Kit Message Actions Toolbar */}
                            <MessageActions className="pt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                              <MessageAction tooltip="Copy response">
                                <button
                                  onClick={() => handleCopyMessage(m.id, m.content)}
                                  className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors"
                                >
                                  {copiedId === m.id ? (
                                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </MessageAction>
                              <MessageAction tooltip="Helpful">
                                <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors">
                                  <ThumbsUp className="h-3.5 w-3.5" />
                                </button>
                              </MessageAction>
                              <MessageAction tooltip="Not helpful">
                                <button className="flex h-6 w-6 items-center justify-center rounded text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-200 transition-colors">
                                  <ThumbsDown className="h-3.5 w-3.5" />
                                </button>
                              </MessageAction>
                            </MessageActions>
                          </div>
                        )}
                      </div>
                    </Message>
                  )}

                  {/* Tool Invocations */}
                  {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
                    const { toolName, toolCallId, state, args } = toolInvocation;
                    switch (state) {
                      case 'partial-call':
                      case 'call':
                        return (
                          <div key={toolCallId} className="my-1.5 max-w-[90%]">
                            {toolName === 'getResume' ? (
                              <div className="rounded-xl px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                                <LatticeLoader status="working" label="Analyzing resume content" color="#3861fb" fontSize={11} cellSize={3.5} gap={1} showTimer={true} />
                              </div>
                            ) : toolName === 'modifyWholeResume' ? (
                              <div className="rounded-xl px-3 py-1.5 text-xs bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
                                <LatticeLoader status="working" label="Preparing resume modifications" color="#3861fb" fontSize={11} cellSize={3.5} gap={1} showTimer={true} />
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
                        const toolConf = toolConfig[toolName as keyof typeof toolConfig];

                        if (!toolConf) return null;

                        if (toolName === 'getResume') {
                          return (
                            <div key={toolCallId} className="my-1 max-w-[90%]">
                              <div className="rounded-lg px-3 py-1.5 text-xs bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                                <Check className="h-3.5 w-3.5" />
                                <span>Analyzed resume sections ({args.sections?.join(', ') || 'all'})</span>
                              </div>
                            </div>
                          );
                        }

                        if (toolConf.type === 'whole_resume') {
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
                              type={toolConf.type}
                              content={args[toolConf.content]}
                              currentContent={resume[toolConf.field][args.index]}
                              onAccept={() => onResumeChange(toolConf.field, 
                                resume[toolConf.field].map((item: WorkExperience | Education | Project | Skill, i: number) => 
                                  i === args.index ? args[toolConf.content] : item
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

                  {/* Thinking Indicator */}
                  {((isInitialLoading && index === messages.length - 1 && m.role === 'user') ||
                    (isLoading && index === messages.length - 1 && m.role === 'assistant')) && (
                    <div className="my-2 flex items-center gap-2">
                      <div className="relative flex h-7 w-7 items-center justify-center rounded-lg bg-[#3861fb]/10 border border-[#3861fb]/20 shrink-0 overflow-hidden">
                        <Image
                          src="/favicon-16x16.png"
                          alt="SyncAI"
                          width={16}
                          height={16}
                          className="h-4 w-4 object-contain"
                        />
                      </div>
                      <div className="rounded-xl px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs">
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
              <div className="rounded-xl p-3 text-xs bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400">
                <p>Rate limit reached. Please try again in a few hours.</p>
              </div>
            ) : (
              <ApiKeyErrorAlert 
                error={error} 
                router={router} 
              />
            )
          )}
        </ChatContainerContent>

        {/* Prompt-Kit Scroll-To-Bottom Floating Button */}
        <ScrollButton className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 shadow-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700" />
      </ChatContainerRoot>

      {/* Input Bar with Prompt-Kit PromptInput */}
      <ChatInput
        isLoading={isLoading || isInitialLoading}
        onSubmit={handleSubmit}
        onStop={stop}
        job={job}
      />
    </div>
  );
}
