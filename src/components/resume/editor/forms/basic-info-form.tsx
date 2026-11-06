'use client';

import { Profile, Resume } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, User, UserCircle2, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useResumeContext } from '../resume-editor-context';
import { memo, useCallback } from 'react';
import { toast } from "sonner";

interface BasicInfoFormProps {
  profile: Profile;
}

function areBasicInfoPropsEqual(
  prevProps: BasicInfoFormProps,
  nextProps: BasicInfoFormProps
) {
  return prevProps.profile?.id === nextProps.profile?.id;
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
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
        <Input
          type={type}
          value={value || ''}
          onChange={handleChange}
          className="pl-9 text-xs bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg h-11 lg:h-10
            focus-visible:ring-1 focus-visible:ring-[#3861fb] placeholder:text-zinc-400"
          placeholder={placeholder}
        />
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

    let filledCount = 0;
    fieldsToFill.forEach((field) => {
      if (profile[field]) {
        updateField(field, profile[field] as string);
        filledCount++;
      }
    });

    toast.success(`Imported ${filledCount} contact fields from your Master Profile.`);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800/80 shadow-sm rounded-xl">
        <CardHeader className="pb-3 pt-4 px-4 sm:px-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <User className="h-4 w-4 text-[#3861fb]" />
                <span>Contact Details</span>
              </CardTitle>
            </div>

            {profile && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleFillFromProfile}
                className="h-8 px-3 text-xs font-semibold border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-lg shadow-sm"
              >
                <UserCircle2 className="mr-1.5 h-3.5 w-3.5 text-[#3861fb]" />
                <span>Sync from Profile</span>
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 pt-0 space-y-3.5">
          {/* Name Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BasicInfoField
              field="first_name"
              value={resume.first_name || ''}
              label="First Name"
              icon={User}
              placeholder="e.g. Rahul"
            />
            <BasicInfoField
              field="last_name"
              value={resume.last_name || ''}
              label="Last Name"
              icon={User}
              placeholder="e.g. Pandiyan"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BasicInfoField
              field="email"
              value={resume.email || ''}
              label="Email Address"
              icon={Mail}
              placeholder="rahul@example.com"
              type="email"
            />
            <BasicInfoField
              field="phone_number"
              value={resume.phone_number || ''}
              label="Phone Number"
              icon={Phone}
              placeholder="+91 98765 43210"
              type="tel"
            />
          </div>

          {/* Location */}
          <BasicInfoField
            field="location"
            value={resume.location || ''}
            label="Current Location"
            icon={MapPin}
            placeholder="Bengaluru, Karnataka, India"
          />

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <BasicInfoField
              field="website"
              value={resume.website || ''}
              label="Portfolio / Website"
              icon={Globe}
              placeholder="https://mysite.dev"
              type="url"
            />
            <BasicInfoField
              field="linkedin_url"
              value={resume.linkedin_url || ''}
              label="LinkedIn URL"
              icon={Linkedin}
              placeholder="linkedin.com/in/username"
              type="url"
            />
            <BasicInfoField
              field="github_url"
              value={resume.github_url || ''}
              label="GitHub URL"
              icon={Github}
              placeholder="github.com/username"
              type="url"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}, areBasicInfoPropsEqual);
