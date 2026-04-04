'use client';

import { Profile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, User } from "lucide-react";

interface ProfileBasicInfoFormProps {
  profile: Profile;
  onChange: (field: keyof Profile, value: string) => void;
}

export function ProfileBasicInfoForm({ profile, onChange }: ProfileBasicInfoFormProps) {
  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Name Row */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1 min-w-0">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                    <User className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                <Input
                  value={profile.first_name || ''}
                  onChange={(e) => onChange('first_name', e.target.value)}
                  className="pr-12 text-base font-medium bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10
                    focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                    transition-colors placeholder:text-zinc-400"
                  placeholder="First Name"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                  First Name
                </div>
              </div>
              <div className="relative group flex-1 min-w-0">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                    <User className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                <Input
                  value={profile.last_name || ''}
                  onChange={(e) => onChange('last_name', e.target.value)}
                  className="pr-12 text-base font-medium bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10
                    focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                    transition-colors placeholder:text-zinc-400"
                  placeholder="Last Name"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                  Last Name
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1 min-w-0">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                    <Mail className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                <Input
                  type="email"
                  value={profile.email || ''}
                  onChange={(e) => onChange('email', e.target.value)}
                  className="pr-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10 text-sm
                    focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                    transition-colors placeholder:text-zinc-400"
                  placeholder="email@example.com"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                  Email
                </div>
              </div>
              <div className="relative group flex-1 min-w-0">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                    <Phone className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                <Input
                  type="tel"
                  value={profile.phone_number || ''}
                  onChange={(e) => onChange('phone_number', e.target.value)}
                  className="pr-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10 text-sm
                    focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                    transition-colors placeholder:text-zinc-400"
                  placeholder="+1 (555) 000-0000"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                  Phone
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                </div>
              </div>
              <Input
                value={profile.location || ''}
                onChange={(e) => onChange('location', e.target.value)}
                className="pr-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10 text-sm
                  focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                  transition-colors placeholder:text-zinc-400"
                placeholder="City, State, Country"
              />
              <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                Location
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Online Presence */}
      <Card className="relative bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Website and LinkedIn */}
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="relative group flex-1 min-w-0">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                    <Globe className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.website || ''}
                  onChange={(e) => onChange('website', e.target.value)}
                  className="pr-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10 text-sm
                    focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                    transition-colors placeholder:text-zinc-400"
                  placeholder="https://your-website.com"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                  Website
                </div>
              </div>
              <div className="relative group flex-1 min-w-0">
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                    <Linkedin className="h-4 w-4 text-zinc-500" />
                  </div>
                </div>
                <Input
                  type="url"
                  value={profile.linkedin_url || ''}
                  onChange={(e) => onChange('linkedin_url', e.target.value)}
                  className="pr-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10 text-sm
                    focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                    transition-colors placeholder:text-zinc-400"
                  placeholder="https://linkedin.com/in/username"
                />
                <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                  LinkedIn
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div className="relative group">
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 transition-transform duration-300 group-focus-within:scale-105">
                  <Github className="h-4 w-4 text-zinc-500" />
                </div>
              </div>
              <Input
                type="url"
                value={profile.github_url || ''}
                onChange={(e) => onChange('github_url', e.target.value)}
                className="pr-12 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 rounded-lg h-10 text-sm
                  focus:border-zinc-400 focus:ring-zinc-400 dark:focus:border-zinc-600 dark:focus:ring-zinc-600
                  transition-colors placeholder:text-zinc-400"
                placeholder="https://github.com/username"
              />
              <div className="absolute -top-2.5 left-2 px-1 bg-white dark:bg-zinc-950 text-[10px] font-medium text-zinc-500 uppercase">
                GitHub
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 