'use client';

import { Profile } from "@/lib/types";
import { 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Pencil, 
  CheckCircle2, 
  AlertCircle,
  Linkedin,
  Github,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";

interface ProfileRowProps {
  profile: Profile;
}

export function ProfileRow({ profile }: ProfileRowProps) {
  // Calculate profile completeness score
  const checks = [
    Boolean(profile.first_name && profile.last_name),
    Boolean(profile.email || profile.phone_number),
    Boolean(profile.education && profile.education.length > 0),
    Boolean(profile.work_experience && profile.work_experience.length > 0),
    Boolean(profile.projects && profile.projects.length > 0),
    Boolean(profile.skills && profile.skills.length > 0),
  ];
  
  const completedChecks = checks.filter(Boolean).length;
  const completenessScore = Math.round((completedChecks / checks.length) * 100);

  const isAtsReady = completenessScore >= 80;
  const userInitials = `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase() || 'ST';

  return (
    <div className="space-y-4">
      {/* Profile Overview Card */}
      <Card className="border-border bg-card">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <Avatar className="h-12 w-12 rounded-xl border border-border">
              <AvatarFallback className="rounded-xl font-bold text-sm bg-primary text-primary-foreground">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight truncate">
                  {profile.first_name || 'Student'} {profile.last_name || ''}
                </h3>
                <Badge variant="secondary" className="text-[10px] font-semibold py-0">
                  Profile Active
                </Badge>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground truncate">
                {profile.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </span>
                )}
                {profile.linkedin_url && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="h-3 w-3" />
                    LinkedIn
                  </span>
                )}
                {profile.github_url && (
                  <span className="flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    GitHub
                  </span>
                )}
              </div>
            </div>
          </div>

          <Link href="/profile" className="shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 rounded-lg text-xs font-semibold"
            >
              <Pencil className="h-3 w-3 mr-1.5" />
              <span>Edit Profile</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Official Shadcn KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: ATS Readiness */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              ATS Readiness
            </CardTitle>
            {isAtsReady ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertCircle className="h-4 w-4 text-amber-500" />
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold tracking-tight">{completenessScore}%</span>
              <span className="text-xs font-medium text-muted-foreground">
                {isAtsReady ? 'Ready for ATS' : 'In Progress'}
              </span>
            </div>
            <Progress value={completenessScore} className="h-2" />
          </CardContent>
        </Card>

        {/* Card 2: Work Experience */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Experience
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.work_experience?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {profile.work_experience?.[0]?.company 
                ? `Latest: ${profile.work_experience[0].company}` 
                : 'No roles logged yet'}
            </p>
          </CardContent>
        </Card>

        {/* Card 3: Education */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Education
            </CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.education?.length || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {profile.education?.[0]?.school 
                ? profile.education[0].school 
                : 'Add college or degree'}
            </p>
          </CardContent>
        </Card>

        {/* Card 4: Projects & Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Projects & Skills
            </CardTitle>
            <Code2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold">{profile.projects?.length || 0}</span>
              <span className="text-xs text-muted-foreground">proj</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-2xl font-bold">{profile.skills?.length || 0}</span>
              <span className="text-xs text-muted-foreground">skills</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              Ready to generate bullet points
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}