'use client';

import { Profile, Resume } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, User, UserCircle2, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '../resume-editor-context';
import { memo, useCallback } from 'react';

interface BasicInfoFormProps {
  profile: Profile;
}

function areBasicInfoPropsEqual(
  prevProps: BasicInfoFormProps,
  nextProps: BasicInfoFormProps
) {
  return prevProps.profile.id === nextProps.profile.id;
}

// Create memoized field component
const BasicInfoField = memo(function BasicInfoField({ 
  field, 
  value, 
  label, 
  icon: Icon,
  placeholder,
  type = 'text'
}: {
  field: keyof Resume;
  value: string;
  label: string;
  icon: LucideIcon;
  placeholder: string;
  type?: string;
}) {
  const { dispatch } = useResumeContext();
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'UPDATE_FIELD', field, value: e.target.value });
  }, [dispatch, field]);

  return (
    <div className="relative group">
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
        <div className="p-1 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-200 group-focus-within:scale-105">
          <Icon className="h-3.5 w-3.5 text-zinc-500" />
        </div>
      </div>
      <Input
        type={type}
        value={value || ''}
        onChange={handleChange}
        className="pr-10 text-sm bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-9
          focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
          transition-colors placeholder:text-zinc-400"
        placeholder={placeholder}
      />
      <div className="absolute -top-2 left-2 px-1 bg-white dark:bg-zinc-950 text-[9px] font-medium text-zinc-500 uppercase">
        {label}
      </div>
    </div>
  );
});

export const BasicInfoForm = memo(function BasicInfoFormComponent({
  profile
}: BasicInfoFormProps) {
  const { state, dispatch } = useResumeContext();
  const { resume } = state;

  const updateField = (field: keyof typeof resume, value: string) => {
    dispatch({ type: 'UPDATE_FIELD', field, value });
  };

  const handleFillFromProfile = () => {
    if (!profile) return;
    
    // List of fields to copy from profile
    const fieldsToFill = [
      'first_name',
      'last_name',
      'email',
      'phone_number',
      'location',
      'website',
      'linkedin_url',
      'github_url'
    ] as const satisfies Array<keyof Resume>;

    // Copy each field if it exists in the profile
    fieldsToFill.forEach((field) => {
      if (profile[field]) {
        updateField(field, profile[field] as string);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl">
        <CardContent className="p-3 sm:p-4">
          {profile && (
            <div className="mb-3 sm:mb-4">
              <Button
                onClick={handleFillFromProfile}
                className="w-full bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all duration-200 font-medium"
              >
                <UserCircle2 className="mr-2 h-3.5 w-3.5" />
                Fill from Profile
              </Button>
            </div>
          )}

          <div className="space-y-2 sm:space-y-3">
            {/* Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              <BasicInfoField
                field="first_name"
                value={resume.first_name}
                label="FIRST NAME"
                icon={User}
                placeholder="First Name"
              />
              <BasicInfoField
                field="last_name"
                value={resume.last_name}
                label="LAST NAME"
                icon={User}
                placeholder="Last Name"
              />
            </div>

            <BasicInfoField
              field="email"
              value={resume.email}
              label="EMAIL"
              icon={Mail}
              placeholder="email@example.com"
              type="email"
            />

            <BasicInfoField
              field="phone_number"
              value={resume.phone_number || ''}
              label="PHONE"
              icon={Phone}
              placeholder="+1 (555) 000-0000"
              type="tel"
            />

            <BasicInfoField
              field="location"
              value={resume.location || ''}
              label="LOCATION"
              icon={MapPin}
              placeholder="City, State, Country"
            />

            <div className="space-y-2 sm:space-y-3">
              <BasicInfoField
                field="website"
                value={resume.website || ''}
                label="WEBSITE"
                icon={Globe}
                placeholder="https://your-website.com"
                type="url"
              />

              <BasicInfoField
                field="linkedin_url"
                value={resume.linkedin_url || ''}
                label="LINKEDIN"
                icon={Linkedin}
                placeholder="https://linkedin.com/in/username"
                type="url"
              />

              <BasicInfoField
                field="github_url"
                value={resume.github_url || ''}
                label="GITHUB"
                icon={Github}
                placeholder="https://github.com/username"
                type="url"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}, areBasicInfoPropsEqual); 
