'use client';

import { Profile, WorkExperience, Education, Project } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Linkedin, Briefcase, GraduationCap, Wrench, FolderGit2, Upload, Save, Trash2} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { ProfileBasicInfoForm } from "@/components/profile/profile-basic-info-form";
import { ProfileWorkExperienceForm } from "@/components/profile/profile-work-experience-form";
import { ProfileProjectsForm } from "@/components/profile/profile-projects-form";
import { ProfileEducationForm } from "@/components/profile/profile-education-form";
import { ProfileSkillsForm } from "@/components/profile/profile-skills-form";
// import { ProfileEditorHeader } from "./profile-editor-header";
import { formatProfileWithAI } from "../../utils/actions/profiles/ai";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button";
import { AlertTriangle } from "lucide-react";
import { importResume, updateProfile } from "@/utils/actions/profiles/actions";
import { cn, withBasePath } from "@/lib/utils";
import pdfToText from "react-pdftotext";

interface ProfileEditFormProps {
  profile: Profile;
}

export function ProfileEditForm({ profile: initialProfile }: ProfileEditFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isResumeDialogOpen, setIsResumeDialogOpen] = useState(false);
  const [isTextImportDialogOpen, setIsTextImportDialogOpen] = useState(false);
  const [resumeContent, setResumeContent] = useState("");
  const [textImportContent, setTextImportContent] = useState("");
  const [isProcessingResume, setIsProcessingResume] = useState(false);
  const [apiKeyError, setApiKeyError] = useState("");
  const [isResumeDragging, setIsResumeDragging] = useState(false);
  const [isTextImportDragging, setIsTextImportDragging] = useState(false);
  const router = useRouter();

  // Sync with server state when initialProfile changes
  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  // Add useEffect to clear error when dialogs close
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
      toast.success("Changes saved successfully", {
        position: "bottom-right",
      });
      // Force a server revalidation
      router.refresh();
    } catch (error) {
      void error;
      toast.error("Unable to save your changes. Please try again.", {
        position: "bottom-right",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsResetting(true);
      // Reset to empty profile locally
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
      
      // Update local state
      setProfile(resetProfile);
      
      // Save to database
      await updateProfile(resetProfile);
      
      toast.success("Profile reset successfully", {
        position: "bottom-right",
      });
      
      // Force a server revalidation
      router.refresh();
    } catch (error: unknown) {
      toast.error("Failed to reset profile. Please try again.", {
        position: "bottom-right",
      });
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLinkedInImport = () => {
    toast.info("LinkedIn import feature coming soon!", {
      position: "bottom-right",
    });
  };

  const handleResumeUpload = async (content: string) => {
    try {
      setIsProcessingResume(true);
      
      // Get model and API key from local storage
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
        // Clean and transform the data to match our database schema
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
        toast.success("Content imported successfully - Don't forget to save your changes", {
          position: "bottom-right",
        });
        setIsResumeDialogOpen(false);
        setIsTextImportDialogOpen(false);
        setResumeContent("");
        setTextImportContent("");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Resume upload error:', error);
        if (error.message.toLowerCase().includes('api key')) {
          setApiKeyError(
            'API key required. Please add your OpenAI API key in settings or upgrade to our Pro Plan.'
          );
        } else {
          toast.error("Failed to process content: " + error.message, {
            position: "bottom-right",
          });
        }
      }
    } finally {
      setIsProcessingResume(false);
    }
  };

  // Add drag event handlers
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
        toast.error("Failed to extract text from the PDF. Please try again or paste the content manually.", {
          position: "bottom-right",
        });
      }
    } else {
      toast.error("Please drop a PDF file.", {
        position: "bottom-right",
      });
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
        toast.error("Failed to extract text from the PDF. Please try again or paste the content manually.", {
          position: "bottom-right",
        });
      }
    }
  };

  return (
    <div className="relative mx-auto">
      

      {/* Action Bar */}
      <div className="z-50 mt-4 mb-6">
        <div className="max-w-[2000px] mx-auto">
          <div className="mx-6">
            <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-50" />
                <span className="text-sm font-semibold tracking-wide text-zinc-500">Profile Editor</span>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Reset Profile Button */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-semibold text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20"
                      disabled={isResetting}
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Reset
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-black uppercase tracking-tight">Reset Profile</AlertDialogTitle>
                      <AlertDialogDescription className="font-bold">
                        Are you sure you want to reset your profile? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isResetting} className="font-semibold">Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleReset}
                        disabled={isResetting}
                        className="bg-red-600 text-white hover:bg-red-700 font-semibold"
                      >
                        {isResetting ? "Resetting..." : "Reset Profile"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
 
                {/* Save Button */}
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  size="sm"
                  className="font-semibold bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container with consistent styling */}
      <div className="relative px-6 md:px-8 lg:px-10 pb-10">
        {/* Import Actions Row */}
        <div className="relative mb-6">
          <div className="bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6 shadow-sm">
            <div className="flex flex-col gap-4">
              
              {/* Import Options Text */}
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-full bg-zinc-900 dark:bg-zinc-50" />
                  <span className="font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Import Options</span>
                </div>
              </div>


              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* LinkedIn Import Button */}
                <Button
                  variant="outline"
                  onClick={handleLinkedInImport}
                  className="group relative bg-[#0077b5]/5 hover:bg-[#0077b5]/10 border-[#0077b5]/20 hover:border-[#0077b5]/30 text-[#0077b5] transition-all duration-500 hover:scale-[1.02] h-auto py-4"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0077b5]/0 via-[#0077b5]/5 to-[#0077b5]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#0077b5]/10 group-hover:scale-110 transition-transform duration-500">
                      <Linkedin className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-[#0077b5]">LinkedIn Import</div>
                      <div className="text-sm text-[#0077b5]/70">Sync with your LinkedIn profile</div>
                    </div>
                  </div>
                </Button>

                 {/* Resume Upload Button */}
                <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="group relative border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-900 h-auto py-5 rounded-xl"
                    >
                      <div className="relative flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 group-hover:scale-105 transition-transform duration-300">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold tracking-wide text-zinc-900 dark:text-zinc-100">Resume Upload</div>
                          <div className="text-xs text-zinc-500">Import from existing resume</div>
                        </div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl text-zinc-900 dark:text-zinc-50 font-bold">
                        Upload Resume Content
                      </DialogTitle>
                      <DialogDescription asChild>
                        <div className="space-y-2 text-base text-muted-foreground/80">
                          <span className="block">Let our AI analyze your resume and enhance your profile by adding new information.</span>
                          <span className="block text-sm">Your existing profile information will be preserved. New entries will be added alongside your current data. Want to start fresh instead? Use the &quot;Reset Profile&quot; option before uploading.</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-4">
                        <label
                          onDragEnter={(e) => handleDrag(e, setIsResumeDragging)}
                          onDragLeave={(e) => handleDrag(e, setIsResumeDragging)}
                          onDragOver={(e) => handleDrag(e, setIsResumeDragging)}
                          onDrop={(e) => handleDrop(e, setResumeContent)}
                          className={cn(
                            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition-colors duration-200 cursor-pointer group",
                            isResumeDragging
                              ? "border-violet-500 bg-violet-50/50"
                              : "border-gray-200 hover:border-violet-500/50 hover:bg-violet-50/10"
                          )}
                        >
                          <input
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            onChange={(e) => handleFileInput(e, setResumeContent)}
                          />
                          <Upload className="w-10 h-10 text-violet-500 group-hover:scale-110 transition-transform duration-200" />
                          <div className="text-center">
                            <p className="text-sm font-medium text-foreground">
                              Drop your PDF resume here
                            </p>
                            <p className="text-sm text-muted-foreground">
                              or click to browse files
                            </p>
                          </div>
                        </label>
                        <div className="relative">
                          <div className="absolute -top-3 left-3 bg-white px-2 text-sm text-muted-foreground">
                            Or paste your resume text here
                          </div>
                          <Textarea
                            value={resumeContent}
                            onChange={(e) => setResumeContent(e.target.value)}
                            placeholder="Paste your resume content here..."
                            className="min-h-[100px] bg-white/50 border-white/40 focus:border-violet-500/40 focus:ring-violet-500/20 transition-all duration-300 pt-4"
                          />
                        </div>
                      </div>
                    </div>
                    {apiKeyError && (
                      <div className="px-4 py-3 bg-red-50/50 border border-red-200/50 rounded-lg flex items-start gap-3 text-red-600 text-sm">
                        <div className="p-1.5 rounded-full bg-red-100">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">API Key Required</p>
                          <p className="text-red-500/90">{apiKeyError}</p>
                          <div className="mt-2 flex flex-col gap-2 justify-start">
                            <div className="w-auto mx-auto">
                              <ProUpgradeButton />
                            </div>
                            <div className="text-center text-xs text-red-400">or</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50/50 w-auto mx-auto"
                              onClick={() => window.location.href = withBasePath('/settings')}
                            >
                              Set API Keys in Settings
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter className="gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsResumeDialogOpen(false)}
                        className="bg-white/50 hover:bg-white/60 transition-all duration-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleResumeUpload(resumeContent)}
                        disabled={isProcessingResume || !resumeContent.trim()}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-500 hover:scale-[1.02] disabled:hover:scale-100"
                      >
                        {isProcessingResume ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Process with AI</span>
                          </div>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Import From Text Button */}
                <Dialog open={isTextImportDialogOpen} onOpenChange={setIsTextImportDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="group relative bg-violet-500/5 hover:bg-violet-500/10 border-violet-500/20 hover:border-violet-500/30 text-violet-600 transition-all duration-500 hover:scale-[1.02] h-auto py-4"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/0 via-violet-500/5 to-violet-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative flex items-center gap-4">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-violet-500/10 group-hover:scale-110 transition-transform duration-500">
                          <Upload className="h-6 w-6" />
                        </div>
                        <div className="text-left">
                          <div className="font-semibold text-violet-600">Import From Text</div>
                          <div className="text-sm text-violet-600/70">Import from any text content</div>
                        </div>
                      </div>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] bg-white/95 backdrop-blur-xl border-white/40 shadow-2xl">
                    <DialogHeader>
                      <DialogTitle className="text-2xl bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                        Import From Text
                      </DialogTitle>
                      <DialogDescription asChild>
                        <div className="space-y-2 text-base text-muted-foreground/80">
                          <span className="block">Paste any text content below (resume, job description, achievements, etc.). Our AI will analyze it and enhance your profile by adding relevant information.</span>
                          <span className="block text-sm">Your existing profile information will be preserved. New entries will be added alongside your current data.</span>
                        </div>
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="space-y-4">
                        <label
                          onDragEnter={(e) => handleDrag(e, setIsTextImportDragging)}
                          onDragLeave={(e) => handleDrag(e, setIsTextImportDragging)}
                          onDragOver={(e) => handleDrag(e, setIsTextImportDragging)}
                          onDrop={(e) => handleDrop(e, setTextImportContent)}
                          className={cn(
                            "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition-colors duration-200 cursor-pointer group",
                            isTextImportDragging
                              ? "border-violet-500 bg-violet-50/50"
                              : "border-gray-200 hover:border-violet-500/50 hover:bg-violet-50/10"
                          )}
                        >
                          <input
                            type="file"
                            className="hidden"
                            accept="application/pdf"
                            onChange={(e) => handleFileInput(e, setTextImportContent)}
                          />
                          <Upload className="w-10 h-10 text-violet-500 group-hover:scale-110 transition-transform duration-200" />
                          <div className="text-center">
                            <p className="text-sm font-medium text-foreground">
                              Drop your PDF file here
                            </p>
                            <p className="text-sm text-muted-foreground">
                              or click to browse files
                            </p>
                          </div>
                        </label>
                        <div className="relative">
                          <div className="absolute -top-3 left-3 bg-white px-2 text-sm text-muted-foreground">
                            Or paste your text content here
                          </div>
                          <Textarea
                            value={textImportContent}
                            onChange={(e) => setTextImportContent(e.target.value)}
                            placeholder="Paste your text content here..."
                            className="min-h-[100px] bg-white/50 border-white/40 focus:border-violet-500/40 focus:ring-violet-500/20 transition-all duration-300 pt-4"
                          />
                        </div>
                      </div>
                    </div>
                    {apiKeyError && (
                      <div className="px-4 py-3 bg-red-50/50 border border-red-200/50 rounded-lg flex items-start gap-3 text-red-600 text-sm">
                        <div className="p-1.5 rounded-full bg-red-100">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">API Key Required</p>
                          <p className="text-red-500/90">{apiKeyError}</p>
                          <div className="mt-2 flex flex-col gap-2 justify-start">
                            <div className="w-auto mx-auto">
                              <ProUpgradeButton />
                            </div>
                            <div className="text-center text-xs text-red-400">or</div>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50/50 w-auto mx-auto"
                              onClick={() => window.location.href = withBasePath('/settings')}
                            >
                              Set API Keys in Settings
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter className="gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setIsTextImportDialogOpen(false)}
                        className="bg-white/50 hover:bg-white/60 transition-all duration-300"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => handleResumeUpload(textImportContent)}
                        disabled={isProcessingResume || !textImportContent.trim()}
                        className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:opacity-90 transition-all duration-500 hover:scale-[1.02] disabled:hover:scale-100"
                      >
                        {isProcessingResume ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Processing...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Upload className="h-4 w-4" />
                            <span>Process with AI</span>
                          </div>
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Tabs with smooth transitions and connected design */}
        <div>
          <div>
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="h-full relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2 flex overflow-x-auto gap-2 shadow-sm">
                <TabsTrigger 
                  value="basic" 
                  className=" group flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold tracking-wide transition-all duration-200
                    data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-50
                    data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-zinc-50 dark:data-[state=inactive]:hover:bg-zinc-900"
                >
                  <User className="h-5 w-5" />
                  <span>Basic Info</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="experience" 
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold tracking-wide transition-all duration-200
                    data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-50
                    data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-zinc-50 dark:data-[state=inactive]:hover:bg-zinc-900"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>Experience</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="projects" 
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold tracking-wide transition-all duration-200
                    data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-50
                    data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-zinc-50 dark:data-[state=inactive]:hover:bg-zinc-900"
                >
                  <FolderGit2 className="h-5 w-5" />
                  <span>Projects</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="education" 
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold tracking-wide transition-all duration-200
                    data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-50
                    data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-zinc-50 dark:data-[state=inactive]:hover:bg-zinc-900"
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>Education</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="skills" 
                  className="group flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold tracking-wide transition-all duration-200
                    data-[state=active]:bg-zinc-100 data-[state=active]:text-zinc-900 dark:data-[state=active]:bg-zinc-800 dark:data-[state=active]:text-zinc-50
                    data-[state=inactive]:text-zinc-500 data-[state=inactive]:hover:bg-zinc-50 dark:data-[state=inactive]:hover:bg-zinc-900"
                >
                  <Wrench className="h-5 w-5" />
                  <span>Skills</span>
                </TabsTrigger>
              </TabsList>
              <div className="relative mt-8">
                <div className="relative space-y-6">
                  <TabsContent value="basic" className="mt-0 outline-none">
                    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                        <ProfileBasicInfoForm
                          profile={profile}
                          onChange={(field, value) => {
                            if (field in profile) {
                              updateField(field as keyof Profile, value);
                            }
                          }}
                        />
                    </Card>
                  </TabsContent>

                  <TabsContent value="experience" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden group">
                      
                      <div className="relative p-8">
                        <ProfileWorkExperienceForm
                          experiences={profile.work_experience}
                          onChange={(experiences) => updateField('work_experience', experiences)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="projects" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden group">
                      
                      <div className="relative p-8">
                        <ProfileProjectsForm
                          projects={profile.projects}
                          onChange={(projects) => updateField('projects', projects)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="education" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden group">
                      
                      <div className="relative p-8">
                        <ProfileEducationForm
                          education={profile.education}
                          onChange={(education) => updateField('education', education)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="skills" className="mt-6 animate-in fade-in-50 slide-in-from-bottom-2 duration-500">
                    <Card className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm relative overflow-hidden group">
                      
                      <div className="relative p-8">
                        <ProfileSkillsForm
                          skills={profile.skills}
                          onChange={(skills) => updateField('skills', skills)}
                        />
                      </div>
                    </Card>
                  </TabsContent>

                 
                </div>
              </div>
            </Tabs>
          </div>
          <div className="absolute inset-x-0 -bottom-3 h-8 bg-gradient-to-t from-white/60 to-transparent pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
} 