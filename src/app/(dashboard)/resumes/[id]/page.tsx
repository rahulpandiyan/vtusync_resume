import { cache } from "react";
import { redirect } from "next/navigation";
import { getResumeById } from "@/utils/actions/resumes/actions";
import { ResumeEditorClient } from "@/components/resume/editor/resume-editor-client";
import { Metadata } from "next";
import { Resume } from "@/lib/types";
import { getBillingStatus } from "@/utils/actions/payments/actions";

const getResumePageData = cache(async (resumeId: string) => {
  return getResumeById(resumeId);
});

// Helper function to normalize resume data
function normalizeResumeData(resume: Resume): Resume {
  return {
    ...resume,
    // Normalize work experience dates
    work_experience: resume.work_experience?.map(exp => ({
      ...exp,
      date: exp.date || ''
    })) || [],
    // Normalize education dates
    education: resume.education?.map(edu => ({
      ...edu,
      date: edu.date || ''
    })) || [],
    // Normalize project dates
    projects: resume.projects?.map(project => ({
      ...project,
      date: project.date || ''
    })) || [],
    // Initialize document settings with defaults if not present
    document_settings: resume.document_settings || {
      document_font_size: 10,
      document_line_height: 1.5,
      document_margin_vertical: 36,
      document_margin_horizontal: 36,
      header_name_size: 24,
      header_name_bottom_spacing: 24,
      skills_margin_top: 2,
      skills_margin_bottom: 2,
      skills_margin_horizontal: 0,
      skills_item_spacing: 2,
      experience_margin_top: 2,
      experience_margin_bottom: 2,
      experience_margin_horizontal: 0,
      experience_item_spacing: 4,
      projects_margin_top: 2,
      projects_margin_bottom: 2,
      projects_margin_horizontal: 0,
      projects_item_spacing: 4,
      education_margin_top: 2,
      education_margin_bottom: 2,
      education_margin_horizontal: 0,
      education_item_spacing: 4
    }
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  try {
    const { id } = await params;
    const { resume } = await getResumePageData(id);
    return {
      title: `${resume.name} | ResuSync`,
      description: `Editing ${resume.name} - ${resume.target_role} resume`,
    };
  } catch (error) {
    void error;
    return {
      title: 'Resume Editor | ResuSync',
      description: 'AI-powered resume editor',
    };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  
  try {
    const { id } = await params;
    const [{ resume: rawResume, profile, job }, billing] = await Promise.all([
      getResumePageData(id),
      getBillingStatus(),
    ]);
    const normalizedResume = normalizeResumeData(rawResume);
    const component = (
      <div 
        className="h-full flex flex-col min-w-0 -mx-2 sm:-mx-4 lg:mx-0"
        data-page-title={normalizedResume.name}
        data-resume-type={normalizedResume.is_base_resume ? "Base Resume" : "Tailored Resume"}
      >
        <ResumeEditorClient
          initialResume={normalizedResume}
          profile={profile}
          initialJob={job}
          showWatermark={!billing.hasWatermarkAccess && !normalizedResume.watermark_removed}
        />
      </div>
    );
  
    
    return component;
  } catch (error: unknown) {
    // Check for specific error messages we've defined in our actions
    const errorMessage = error instanceof Error ? error.message : 'unknown error';
    if (errorMessage.includes('Resume not found') || errorMessage.includes('Profile not found')) {
      redirect("/home");
    }

    if (errorMessage === 'User not authenticated') {
      redirect("/");
    }
    
    // Default fallback redirect
    redirect("/home");
  }
} 
