'use client';

import { Profile, WorkExperience, Education, Project } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Trash2, 
  FileText,
  Sparkles,
  AlertTriangle,
  Loader2
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

export function ProfileEditForm({ profile: initialProfile }: ProfileEditFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
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
        toast.success("Name & email imported! For work experience: On LinkedIn app → Profile → More → Save to PDF, then come back here and click 'Resume' to upload that PDF.");
      } else {
        toast.success("Profile imported from LinkedIn successfully!");
      }
      router.refresh();
    } else if (error) {
      const errorMessages: Record<string, string> = {
        linkedin_denied: "LinkedIn authorization was denied.",
        linkedin_no_code: "Authorization code not received.",
        linkedin_token_failed: "Failed to connect to LinkedIn. Your LinkedIn Developer app may need to be published or you need to be added as a tester.",
        linkedin_profile_failed: "Failed to fetch LinkedIn profile.",
        linkedin_update_failed: "Failed to update profile. Please try again.",
        linkedin_unknown: "An unexpected error occurred. Please ensure your LinkedIn Developer app is in Live mode.",
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
      toast.error("Unable to save your changes. Please try again.");
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
      toast.error("Failed to reset profile. Please try again.");
      console.error(error);
    } finally {
      setIsResetting(false);
    }
  };

  const handleLinkedInImport = async () => {
    try {
      const configured = await isLinkedInConfigured();
      if (!configured) {
        toast.error("LinkedIn OAuth is not configured. Please use LinkedIn Data Export instead.");
        return;
      }

      setIsLinkedInLoading(true);
      const authUrl = await getLinkedInAuthUrl();
      window.location.href = authUrl;
    } catch (error: unknown) {
      console.error('LinkedIn error:', error);
      toast.error("For full data: LinkedIn Settings → Data Privacy → Get copy of your data → Profile");
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
        toast.success("Profile content parsed & imported. Review and save your changes.");
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
        toast.error("Failed to extract text from the PDF. Please try again or paste text manually.");
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
        toast.error("Failed to extract text from the PDF. Please try again or paste text manually.");
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Profile Builder
          </h1>
          <Badge 
            variant="outline" 
            className="text-[10px] font-semibold text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 rounded-full px-2 py-0.5"
          >
            Master Candidate Record
          </Badge>
        </div>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your verified education, experience, and skills used to calibrate AI resumes and beat ATS filters.
        </p>
      </div>

      {/* Modern Quick Import Bar */}
      <div className="bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200/80 dark:border-zinc-800/80 rounded-xl p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#3861fb]" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Quick Import & Auto-Fill
              </h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Import and auto-format your experience, education, and skills from existing documents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* LinkedIn Sync Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleLinkedInImport}
              disabled={isLinkedInLoading}
              className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 px-3 text-[#0a66c2]"
            >
              {isLinkedInLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              ) : (
                <Linkedin className="h-3.5 w-3.5 mr-1.5" />
              )}
              <span>Sync LinkedIn</span>
            </Button>

            {/* Resume Upload PDF Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsResumeDialogOpen(true)}
              className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 px-3 text-zinc-700 dark:text-zinc-300"
            >
              <Upload className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              <span>Upload PDF</span>
            </Button>

            {/* Text Import Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsTextImportDialogOpen(true)}
              className="h-8 text-xs font-medium border-zinc-200 dark:border-zinc-800 hover:bg-white dark:hover:bg-zinc-800 px-3 text-zinc-700 dark:text-zinc-300"
            >
              <FileText className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              <span>Paste Text</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Switcher for Sections */}
      <Tabs defaultValue="basic" className="space-y-6">
        <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-auto flex flex-wrap gap-1">
            <TabsTrigger 
              value="basic" 
              className="rounded-lg text-xs font-semibold px-3 sm:px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              <User className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              <span>Basic Info</span>
            </TabsTrigger>

            <TabsTrigger 
              value="experience" 
              className="rounded-lg text-xs font-semibold px-3 sm:px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              <Briefcase className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              <span>Experience</span>
              {profile.work_experience?.length > 0 && (
                <span className="ml-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-200/60 dark:bg-zinc-700/60 px-1.5 py-0.2 rounded-full">
                  {profile.work_experience.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger 
              value="projects" 
              className="rounded-lg text-xs font-semibold px-3 sm:px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              <FolderGit2 className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              <span>Projects</span>
              {profile.projects?.length > 0 && (
                <span className="ml-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-200/60 dark:bg-zinc-700/60 px-1.5 py-0.2 rounded-full">
                  {profile.projects.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger 
              value="education" 
              className="rounded-lg text-xs font-semibold px-3 sm:px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              <GraduationCap className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              <span>Education</span>
              {profile.education?.length > 0 && (
                <span className="ml-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-200/60 dark:bg-zinc-700/60 px-1.5 py-0.2 rounded-full">
                  {profile.education.length}
                </span>
              )}
            </TabsTrigger>

            <TabsTrigger 
              value="skills" 
              className="rounded-lg text-xs font-semibold px-3 sm:px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              <Wrench className="h-3.5 w-3.5 mr-1.5 text-zinc-500" />
              <span>Skills</span>
              {profile.skills?.length > 0 && (
                <span className="ml-1.5 text-[10px] font-bold text-zinc-500 bg-zinc-200/60 dark:bg-zinc-700/60 px-1.5 py-0.2 rounded-full">
                  {profile.skills.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Contents */}
        <TabsContent value="basic" className="mt-0 outline-none">
          <ProfileBasicInfoForm
            profile={profile}
            onChange={(field, value) => updateField(field, value)}
          />
        </TabsContent>

        <TabsContent value="experience" className="mt-0 outline-none">
          <ProfileWorkExperienceForm
            experiences={profile.work_experience || []}
            onChange={(experiences) => updateField('work_experience', experiences)}
          />
        </TabsContent>

        <TabsContent value="projects" className="mt-0 outline-none">
          <ProfileProjectsForm
            projects={profile.projects || []}
            onChange={(projects) => updateField('projects', projects)}
          />
        </TabsContent>

        <TabsContent value="education" className="mt-0 outline-none">
          <ProfileEducationForm
            education={profile.education || []}
            onChange={(education) => updateField('education', education)}
          />
        </TabsContent>

        <TabsContent value="skills" className="mt-0 outline-none">
          <ProfileSkillsForm
            skills={profile.skills || []}
            onChange={(skills) => updateField('skills', skills)}
          />
        </TabsContent>
      </Tabs>

      {/* Bottom Action Footer */}
      <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Save your changes to update your master profile and calibrate AI resumes.
        </p>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="outline"
                disabled={isResetting}
                className="text-xs font-medium text-zinc-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 dark:text-zinc-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 h-9 px-3.5 rounded-lg"
              >
                {isResetting ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
                )}
                <span>Reset Profile</span>
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
                  {isResetting ? "Resetting..." : "Yes, Reset Profile"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            size="sm"
            className="bg-[#3861fb] hover:bg-[#3861fb]/90 text-white font-medium text-xs h-9 px-5 rounded-lg shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5 mr-1.5" />
                <span>Save Changes</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Upload PDF Dialog */}
      <Dialog open={isResumeDialogOpen} onOpenChange={setIsResumeDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Upload Resume (PDF)
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Upload an existing resume PDF. Our AI engine extracts and calibrates work experience, education, projects, and skills into your profile.
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
              <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Drop your PDF resume here
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  or click to select file from your computer
                </p>
              </div>
            </label>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Or paste resume text directly
              </Label>
              <Textarea
                value={resumeContent}
                onChange={(e) => setResumeContent(e.target.value)}
                placeholder="Paste plain resume text or raw bullet points here..."
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
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleResumeUpload(resumeContent)}
              disabled={isProcessingResume || !resumeContent.trim()}
              className="bg-[#3861fb] hover:bg-[#3861fb]/90 text-white font-medium text-xs h-9 px-4 rounded-lg shadow-sm"
            >
              {isProcessingResume ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>Parsing with AI...</span>
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
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
              Import Profile from Raw Text
            </DialogTitle>
            <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
              Paste bio, achievements, project notes, or job descriptions. The AI parses entities into structured profile fields.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <label
              onDragEnter={(e) => handleDrag(e, setIsTextImportDragging)}
              onDragLeave={(e) => handleDrag(e, setIsTextImportDragging)}
              onDragOver={(e) => handleDrag(e, setIsTextImportDragging)}
              onDrop={(e) => handleDrop(e, setTextImportContent)}
              className={cn(
                "border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-center",
                isTextImportDragging
                  ? "border-[#3861fb] bg-[#3861fb]/5"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-900/50"
              )}
            >
              <input
                type="file"
                className="hidden"
                accept="application/pdf"
                onChange={(e) => handleFileInput(e, setTextImportContent)}
              />
              <Upload className="h-4 w-4 text-zinc-400" />
              <p className="text-[11px] text-zinc-500">
                Drop PDF file or click to browse
              </p>
            </label>

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
              className="text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleResumeUpload(textImportContent)}
              disabled={isProcessingResume || !textImportContent.trim()}
              className="bg-[#3861fb] hover:bg-[#3861fb]/90 text-white font-medium text-xs h-9 px-4 rounded-lg shadow-sm"
            >
              {isProcessingResume ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  <span>Parsing with AI...</span>
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
