'use client';

import { Profile, WorkExperience, Education, Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  User, 
  Linkedin, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Upload, 
  Save, 
  FileText,
  Sparkles,
  AlertTriangle,
  Loader2,
  RotateCcw,
  Plus
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

import { ProfileBasicInfoForm } from "@/components/profile/profile-basic-info-form";
import { ProfileWorkExperienceForm } from "@/components/profile/profile-work-experience-form";
import { ProfileProjectsForm } from "@/components/profile/profile-projects-form";
import { ProfileEducationForm } from "@/components/profile/profile-education-form";
import { ProfileSkillsForm } from "@/components/profile/profile-skills-form";
import { formatProfileWithAI } from "../../utils/actions/profiles/ai";
import { getLinkedInAuthUrl, isLinkedInConfigured } from "@/utils/actions/linkedin/actions";
import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button";
import { importResume, updateProfile } from "@/utils/actions/profiles/actions";
import { cn, withBasePath } from "@/lib/utils";
import pdfToText from "react-pdftotext";

interface ProfileEditFormProps {
  profile: Profile;
}

type TabType = "personal" | "experience" | "projects" | "education" | "skills";

export function ProfileEditForm({ profile: initialProfile }: ProfileEditFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isTextImportDialogOpen, setIsTextImportDialogOpen] = useState(false);
  const [isLinkedInLoading, setIsLinkedInLoading] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [textImportContent, setTextImportContent] = useState("");
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [isResumeDragging, setIsResumeDragging] = useState(false);
  const [isTextImportDragging, setIsTextImportDragging] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Sync with server state when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Handle LinkedIn import result
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    
    if (success === 'linkedin_imported') {
      const info = searchParams.get('info');
      if (info === 'manual') {
        toast.success("Name & email imported! To import full work history: On LinkedIn app → Profile → More → Save to PDF, then click 'Upload PDF' here.");
      } else {
        toast.success("Profile imported from LinkedIn successfully!");
      }
      router.refresh();
    } else if (error) {
      const errorMessages: Record<string, string> = {
        linkedin_denied: "LinkedIn authorization was denied.",
        linkedin_no_code: "Authorization code not received.",
        linkedin_token_failed: "Failed to connect to LinkedIn. App may need to be published or tester added.",
        linkedin_profile_failed: "Failed to fetch LinkedIn profile.",
        linkedin_update_failed: "Failed to update profile. Please try again.",
        linkedin_unknown: "An unexpected error occurred with LinkedIn sync.",
      };
      const detail = searchParams.get('detail');
      toast.error(errorMessages[error] || detail || "LinkedIn import failed. Please try again.");
    }
    
    if (success || error) {
      router.replace('/profile');
    }
  }, [searchParams, router]);

  useEffect(() => {
    if (!isResumeDialogOpen && !isTextImportDialogOpen) {
      setApiKeyError("");
    }
  }, [isResumeDialogOpen, isTextImportDialogOpen]);

  const updateField = (field: keyof Profile, value: unknown) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await updateProfile(profile);
      toast.success("Profile changes saved successfully");
      router.refresh();
    } catch (error) {
      void error;
      toast.error("Unable to save changes. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      const resetProfile = {
        id: profile.id,
        user_id: profile.user_id,
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        location: '',
        website: '',
        linkedin_url: '',
        github_url: '',
        work_experience: [],
        education: [],
        skills: [],
        projects: [],
        created_at: profile.created_at,
        updated_at: profile.updated_at
      };
      
      setProfile(resetProfile);
      await updateProfile(resetProfile);
      toast.success("Profile reset successfully");
      router.refresh();
    } catch (error: unknown) {
      toast.error("Failed to reset profile.");
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLinkedInImport = async () => {
    try {
      const configured = await isLinkedInConfigured();
      if (!configured) {
        toast.error("LinkedIn OAuth is not configured. Please use PDF upload instead.");
        return;
      }

      setIsLinkedInLoading(true);
      const authUrl = await getLinkedInAuthUrl();
      window.location.href = authUrl;
    } catch (error: unknown) {
      console.error('LinkedIn error:', error);
      toast.error("LinkedIn import could not be started.");
      setIsLinkedInLoading(false);
    }
  };

  const handleResumeUpload = async (content: string) => {
    try {
      setIsProcessingResume(true);
      
      const MODEL_STORAGE_KEY = 'resusync-default-model';
      const LOCAL_STORAGE_KEY = 'resusync-api-keys';
      
      const selectedModel = localStorage.getItem(MODEL_STORAGE_KEY) || 'claude-sonnet-4-20250514';
      const storedKeys = localStorage.getItem(LOCAL_STORAGE_KEY);
      let apiKeys = [];
      
      try {
        apiKeys = storedKeys ? JSON.parse(storedKeys) : [];
      } catch (error) {
        console.error('Error parsing API keys:', error);
      }
      
      const result = await formatProfileWithAI(content, {
        model: selectedModel,
        apiKeys
      });
      
      if (result) {
        const cleanedProfile: Partial<Profile> = {
          first_name: result.first_name || null,
          last_name: result.last_name || null,
          email: result.email || null,
          phone_number: result.phone_number || null,
          location: result.location || null,
          website: result.website || null,
          linkedin_url: result.linkedin_url || null,
          github_url: result.github_url || null,
          work_experience: Array.isArray(result.work_experience) 
            ? result.work_experience.map((exp: Partial<WorkExperience>) => ({
                company: exp.company || '',
                position: exp.position || '',
                location: exp.location || '',
                date: exp.date || '',
                description: Array.isArray(exp.description) 
                  ? exp.description 
                  : [exp.description || ''],
                technologies: Array.isArray(exp.technologies) 
                  ? exp.technologies 
                  : []
              }))
            : [],
          education: Array.isArray(result.education)
            ? result.education.map((edu: Partial<Education>) => ({
                school: edu.school || '',
                degree: edu.degree || '',
                field: edu.field || '',
                location: edu.location || '',
                date: edu.date || '',
                gpa: edu.gpa ? parseFloat(edu.gpa.toString()) : undefined,
                achievements: Array.isArray(edu.achievements) 
                  ? edu.achievements 
                  : []
              }))
            : [],
          skills: Array.isArray(result.skills)
            ? result.skills.map((skill: { category: string; skills?: string[]; items?: string[] }) => ({
                category: skill.category || '',
                items: Array.isArray(skill.skills) 
                  ? skill.skills 
                  : Array.isArray(skill.items) 
                    ? skill.items 
                    : []
              }))
            : [],
          projects: Array.isArray(result.projects)
            ? result.projects.map((proj: Partial<Project>) => ({
                name: proj.name || '',
                description: Array.isArray(proj.description) 
                  ? proj.description 
                  : [proj.description || ''],
                technologies: Array.isArray(proj.technologies) 
                  ? proj.technologies 
                  : [],
                url: proj.url || undefined,
                github_url: proj.github_url || undefined,
                date: proj.date || ''
              }))
            : []
        };
        
        await importResume(cleanedProfile);
        
        setProfile(prev => ({
          ...prev,
          ...cleanedProfile
        }));
        toast.success("Profile updated from uploaded document.");
        setIsResumeDialogOpen(false);
        setIsTextImportDialogOpen(false);
        setIsImportModalOpen(false);
        setResumeContent("");
        setTextImportContent("");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Resume upload error:', error);
        if (error.message.toLowerCase().includes('api key')) {
          setApiKeyError(
            'AI API key required. Please configure your key in settings or upgrade to Pro.'
          );
        } else {
          toast.error("Failed to process content: " + error.message);
        }
      }
    } finally {
      setIsProcessingResume(false);
    }
  };

  const handleDrag = (e: React.DragEvent, isDraggingState: React.Dispatch<React.SetStateAction<boolean>>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      isDraggingState(true);
    } else if (e.type === "dragleave") {
      isDraggingState(false);
    }
  };

  const handleDrop = async (e: React.DragEvent, setContent: React.Dispatch<React.SetStateAction<string>>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResumeDragging(false);
    setIsTextImportDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === "application/pdf");

    if (pdfFile) {
      try {
        const text = await pdfToText(pdfFile);
        setContent(prev => prev + (prev ? "\n\n" : "") + text);
      } catch (error) {
        console.error("PDF processing error:", error);
        toast.error("Failed to extract text from the PDF.");
      }
    } else {
      toast.error("Please drop a valid PDF file.");
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>, setContent: React.Dispatch<React.SetStateAction<string>>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      try {
        const text = await pdfToText(file);
        setContent(prev => prev + (prev ? "\n\n" : "") + text);
      } catch (error) {
        console.error("PDF processing error:", error);
        toast.error("Failed to extract text from the PDF.");
      }
    }
  };

  // Add Item Shortcuts for active section
  const handleAddExperience = () => {
    setProfile(prev => ({
      ...prev,
      work_experience: [
        ...(prev.work_experience || []),
        {
          company: "",
          position: "",
          location: "",
          date: "",
          description: [""],
          technologies: []
        }
      ]
    }));
  };

  const handleAddProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          name: "",
          description: [""],
          technologies: [],
          url: "",
          github_url: "",
          date: ""
        }
      ]
    }));
  };

  const handleAddEducation = () => {
    setProfile(prev => ({
      ...prev,
      education: [
        ...(prev.education || []),
        {
          school: "",
          degree: "",
          field: "",
          location: "",
          date: "",
          gpa: undefined,
          achievements: []
        }
      ]
    }));
  };

  const handleAddSkill = () => {
    setProfile(prev => ({
      ...prev,
      skills: [
        ...(prev.skills || []),
        {
          category: "",
          items: []
        }
      ]
    }));
  };

  const experienceCount = profile.work_experience?.length || 0;
  const projectsCount = profile.projects?.length || 0;
  const educationCount = profile.education?.length || 0;
  const skillsCount = profile.skills?.length || 0;

  const tabsConfig = [
    { id: "personal" as TabType, label: "Personal", icon: User },
    { id: "experience" as TabType, label: "Experience", icon: Briefcase, count: experienceCount },
    { id: "projects" as TabType, label: "Projects", icon: FolderGit2, count: projectsCount },
    { id: "education" as TabType, label: "Education", icon: GraduationCap, count: educationCount },
    { id: "skills" as TabType, label: "Skills", icon: Wrench, count: skillsCount },
  ];

  return (
    <div className="w-full space-y-5 pb-20 lg:pb-8">
      {/* Utility App Header Bar (Matching Resume Scanner pattern) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center shadow-xs shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
                Profile Builder
              </h1>
              <Badge
                variant="outline"
                className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 px-2 py-0.2"
              >
                Master Profile
              </Badge>
            </div>
            <p className="text-xs text-zinc-500">
              Your core candidate information used across all resumes and AI tailoring.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Quick Import Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsImportModalOpen(true)}
            className="h-8 px-2.5 sm:px-3 text-xs font-medium rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#3861fb] sm:mr-1.5" />
            <span>Import</span>
          </Button>

          {/* Reset Action */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                disabled={isResetting}
                className="h-8 px-2.5 rounded-lg border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-red-600 dark:hover:text-red-400 text-xs font-medium"
                title="Reset Profile"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:mr-1" />
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[420px]">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                  Reset Master Profile?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                  This will clear all work experience, projects, education, and skills. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-2 sm:gap-0">
                <AlertDialogCancel disabled={isResetting} className="text-xs h-9">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReset}
                  disabled={isResetting}
                  className="bg-red-600 hover:bg-red-700 text-white text-xs h-9"
                >
                  {isResetting ? "Resetting..." : "Yes, Reset"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Save Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            size="sm"
            className="h-8 px-3.5 rounded-lg text-xs font-semibold bg-[#3861fb] hover:bg-[#3861fb]/90 text-white shadow-xs active:scale-95 transition-all"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1" />
                <span>Save</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Clean Navigation Tabs (No bloat, clean counters) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-zinc-200/60 dark:border-zinc-800/60">
        {tabsConfig.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0",
                isActive
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-850"
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={cn(
                  "text-[10px] font-bold px-1.5 py-0.2 rounded-full",
                  isActive
                    ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                    : "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Workspace Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl shadow-xs overflow-hidden">
        {/* Section Header with contextual "+ Add" button */}
        <div className="px-5 py-3.5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
              {activeTab === "personal" && "Personal Information"}
              {activeTab === "experience" && "Work Experience"}
              {activeTab === "projects" && "Projects"}
              {activeTab === "education" && "Education"}
              {activeTab === "skills" && "Skills"}
            </span>
          </div>

          {/* Quick Add Button in Card Header */}
          {activeTab === "experience" && (
            <Button
              type="button"
              size="sm"
              onClick={handleAddExperience}
              className="h-7 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg px-2.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Experience</span>
            </Button>
          )}

          {activeTab === "projects" && (
            <Button
              type="button"
              size="sm"
              onClick={handleAddProject}
              className="h-7 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg px-2.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Project</span>
            </Button>
          )}

          {activeTab === "education" && (
            <Button
              type="button"
              size="sm"
              onClick={handleAddEducation}
              className="h-7 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg px-2.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Degree</span>
            </Button>
          )}

          {activeTab === "skills" && (
            <Button
              type="button"
              size="sm"
              onClick={handleAddSkill}
              className="h-7 text-xs font-medium bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 rounded-lg px-2.5 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              <span>Add Category</span>
            </Button>
          )}
        </div>

        {/* Section Content */}
        <div className="p-4 sm:p-6">
          {activeTab === "personal" && (
            <ProfileBasicInfoForm
              profile={profile}
              onChange={(field, value) => updateField(field, value)}
            />
          )}

          {activeTab === "experience" && (
            <ProfileWorkExperienceForm
              experiences={profile.work_experience || []}
              onChange={(experiences) => updateField('work_experience', experiences)}
            />
          )}

          {activeTab === "projects" && (
            <ProfileProjectsForm
              projects={profile.projects || []}
              onChange={(projects) => updateField('projects', projects)}
            />
          )}

          {activeTab === "education" && (
            <ProfileEducationForm
              education={profile.education || []}
              onChange={(education) => updateField('education', education)}
            />
          )}

          {activeTab === "skills" && (
            <ProfileSkillsForm
              skills={profile.skills || []}
              onChange={(skills) => updateField('skills', skills)}
            />
          )}
        </div>
      </div>

      {/* Sticky Bottom Save Bar on Mobile */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-zinc-950/95 border-t border-zinc-200/80 dark:border-zinc-800/80 p-3 px-4 backdrop-blur-md flex items-center justify-between gap-3 shadow-lg">
        <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-300 capitalize">
          {activeTab}
        </span>

        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          size="sm"
          className="bg-[#3861fb] hover:bg-[#3861fb]/90 text-white font-semibold text-xs h-8 px-4 rounded-lg shadow-xs active:scale-95"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin mr-1" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 mr-1" />
              <span>Save</span>
            </>
          )}
        </Button>
      </div>

      {/* Quick Import Modal */}
      <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Quick Import
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Choose an import method to automatically extract profile details with AI.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 py-3">
            <button
              type="button"
              onClick={() => {
                setIsImportModalOpen(false);
                handleLinkedInImport();
              }}
              disabled={isLinkedInLoading}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center text-[#0a66c2] shrink-0">
                <Linkedin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Sync with LinkedIn</p>
                <p className="text-[11px] text-zinc-500">Import account details via OAuth</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsImportModalOpen(false);
                setIsResumeDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Upload Resume PDF</p>
                <p className="text-[11px] text-zinc-500">Parse experience and education from existing PDF</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsImportModalOpen(false);
                setIsTextImportDialogOpen(true);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Paste Text</p>
                <p className="text-[11px] text-zinc-500">Extract fields from unformatted career notes</p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload PDF Dialog */}
      <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Upload Resume (PDF)
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Drop your PDF resume to extract and populate experience, education, projects, and skills.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <label
              onDragEnter={(e) => handleDrag(e, setIsResumeDragging)}
              onDragLeave={(e) => handleDrag(e, setIsResumeDragging)}
              onDragOver={(e) => handleDrag(e, setIsResumeDragging)}
              onDrop={(e) => handleDrop(e, setResumeContent)}
              className={cn(
                "border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer text-center",
                isResumeDragging
                  ? "border-[#3861fb] bg-[#3861fb]/5"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50"
              )}
            >
              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={(e) => handleFileInput(e, setResumeContent)}
              />
              <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                <Upload className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Drop your PDF resume here
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  or click to select file from your device
                </p>
              </div>
            </label>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Or paste resume text
              </Label>
              <Textarea
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                placeholder="Paste plain resume text or raw bullet points..."
                rows={4}
                className="text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
              />
            </div>

            {apiKeyError && (
              <div className="p-3 bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-semibold">API Key Required</p>
                  <p>{apiKeyError}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <ProUpgradeButton />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 text-zinc-700 dark:text-zinc-300"
                      onClick={() => window.location.href = withBasePath('/settings')}
                    >
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResumeDialogOpen(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleResumeUpload(resumeContent)}
              disabled={isProcessingResume || !resumeContent.trim()}
              className="bg-[#3861fb] hover:bg-[#3861fb]/90 text-white font-medium text-xs h-8 px-3.5 rounded-lg shadow-xs"
            >
              {isProcessingResume ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  <span>Parse with AI</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Paste Text Dialog */}
      <Dialog open={isTextImportDialogOpen} onOpenChange={setIsTextImportDialogOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-50">
              Import from Text
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500">
              Paste bio, achievements, or project notes. The AI extracts structured fields into your profile.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Text Content
              </Label>
              <Textarea
                value={textImportContent}
                onChange={(e) => setTextImportContent(e.target.value)}
                placeholder="Paste raw career summary, LinkedIn bio, or project details..."
                rows={6}
                className="text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 focus-visible:ring-1 focus-visible:ring-[#3861fb]"
              />
            </div>

            {apiKeyError && (
              <div className="p-3 bg-red-50/80 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg flex items-start gap-2.5 text-xs text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <p className="font-semibold">API Key Required</p>
                  <p>{apiKeyError}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <ProUpgradeButton />
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-xs h-8 text-zinc-700 dark:text-zinc-300"
                      onClick={() => window.location.href = withBasePath('/settings')}
                    >
                      Settings
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTextImportDialogOpen(false)}
              className="text-xs h-8"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleResumeUpload(textImportContent)}
              disabled={isProcessingResume || !textImportContent.trim()}
              className="bg-[#3861fb] hover:bg-[#3861fb]/90 text-white font-medium text-xs h-8 px-3.5 rounded-lg shadow-xs"
            >
              {isProcessingResume ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>Parsing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                  <span>Parse with AI</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
