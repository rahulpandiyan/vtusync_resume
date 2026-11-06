'use client';

import { Profile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface ProfileBasicInfoFormProps {
  profile: Profile;
  onChange: (field: keyof Profile, value: string) => void;
}

export function ProfileBasicInfoForm({ profile, onChange }: ProfileBasicInfoFormProps) {
  return (
    <div className="space-y-6">
      {/* Primary Details */}
      <div className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="basic-first-name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              First Name
            </Label>
            <Input
              id="basic-first-name"
              value={profile.first_name || ''}
              onChange={(e) => onChange('first_name', e.target.value)}
              placeholder="e.g. Jane"
              className="h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="basic-last-name" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Last Name
            </Label>
            <Input
              id="basic-last-name"
              value={profile.last_name || ''}
              onChange={(e) => onChange('last_name', e.target.value)}
              placeholder="e.g. Doe"
              className="h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
            />
          </div>
        </div>

        {/* Contact Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="basic-email" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              <Input
                id="basic-email"
                type="email"
                value={profile.email || ''}
                onChange={(e) => onChange('email', e.target.value)}
                placeholder="name@example.com"
                className="pl-8.5 h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="basic-phone" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Phone Number
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
              <Input
                id="basic-phone"
                type="tel"
                value={profile.phone_number || ''}
                onChange={(e) => onChange('phone_number', e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="pl-8.5 h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <Label htmlFor="basic-location" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <Input
              id="basic-location"
              value={profile.location || ''}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="e.g. San Francisco, CA or Bengaluru, India"
              className="pl-8.5 h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
            />
          </div>
        </div>
      </div>

      {/* Online Profiles & Links Divider */}
      <div className="pt-2 border-t border-zinc-100 dark:border-zinc-900 space-y-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
          Profiles & Links
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* LinkedIn */}
          <div className="space-y-1.5">
            <Label htmlFor="basic-linkedin" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              LinkedIn URL
            </Label>
            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#0a66c2] pointer-events-none" />
              <Input
                id="basic-linkedin"
                type="url"
                value={profile.linkedin_url || ''}
                onChange={(e) => onChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="pl-8.5 h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
              />
            </div>
          </div>

          {/* GitHub */}
          <div className="space-y-1.5">
            <Label htmlFor="basic-github" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              GitHub URL
            </Label>
            <div className="relative">
              <Github className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400 pointer-events-none" />
              <Input
                id="basic-github"
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => onChange('github_url', e.target.value)}
                placeholder="https://github.com/username"
                className="pl-8.5 h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
              />
            </div>
          </div>
        </div>

        {/* Website */}
        <div className="space-y-1.5">
          <Label htmlFor="basic-website" className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
            Portfolio / Website
          </Label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
            <Input
              id="basic-website"
              type="url"
              value={profile.website || ''}
              onChange={(e) => onChange('website', e.target.value)}
              placeholder="https://yourportfolio.dev"
              className="pl-8.5 h-9 sm:h-10 text-sm bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg focus-visible:ring-1 focus-visible:ring-[#3861fb]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
