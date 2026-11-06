'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { updateEmail, updatePassword } from "@/app/(dashboard)/settings/actions";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface SecurityFormProps {
  user: User | null;
}

export function SecurityForm({ user }: SecurityFormProps) {
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || !emailCurrentPassword) return;

    try {
      setIsUpdatingEmail(true);
      const formData = new FormData();
      formData.append('email', newEmail);
      formData.append('currentPassword', emailCurrentPassword);
      
      const result = await updateEmail(formData);
      
      if (!result.success) {
        toast.error(result.error || "Failed to update email");
        return;
      }
      
      toast.success("Confirmation link sent! Please check your new email.");
      setNewEmail("");
      setEmailCurrentPassword("");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingEmail(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) return;

    try {
      setIsUpdatingPassword(true);
      const formData = new FormData();
      formData.append('currentPassword', currentPassword);
      formData.append('newPassword', newPassword);
      
      const result = await updatePassword(formData);
      
      if (!result.success) {
        toast.error(result.error || "Failed to update password");
        return;
      }
      
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Email Address Section */}
      <form onSubmit={handleEmailUpdate} className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Mail className="h-4 w-4 text-zinc-500" />
              <span>Email Address</span>
            </h4>
            <p className="text-xs text-zinc-500 mt-0.5">
              The primary email address associated with your ResuSync account.
            </p>
          </div>
          <Badge variant="outline" className="text-[11px] font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Current Email</Label>
            <Input
              type="email"
              disabled
              value={user?.email || ""}
              className="h-9 text-xs bg-zinc-50 dark:bg-zinc-900 text-zinc-500 cursor-not-allowed border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">New Email Address</Label>
            <Input
              type="email"
              placeholder="e.g. rahul.engineer@gmail.com"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Current Password (Required for confirmation)</Label>
            <Input
              type="password"
              placeholder="Enter current password to verify identity"
              value={emailCurrentPassword}
              onChange={(e) => setEmailCurrentPassword(e.target.value)}
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800 max-w-md"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button 
            type="submit"
            size="sm"
            disabled={isUpdatingEmail || !newEmail || !emailCurrentPassword}
            className="h-8 px-4 text-xs font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
          >
            {isUpdatingEmail && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            <span>{isUpdatingEmail ? "Updating Email..." : "Update Email"}</span>
          </Button>
        </div>
      </form>

      {/* Password Reset Section */}
      <form onSubmit={handlePasswordUpdate} className="space-y-4 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60">
        <div className="pb-2">
          <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Lock className="h-4 w-4 text-zinc-500" />
            <span>Change Password</span>
          </h4>
          <p className="text-xs text-zinc-500 mt-0.5">
            Ensure your account is using a strong password with at least 8 characters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Current Password</Label>
            <Input
              type="password"
              placeholder="••••••••••••"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">New Password</Label>
            <Input
              type="password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-9 text-xs border-zinc-200 dark:border-zinc-800"
            />
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button 
            type="submit"
            size="sm"
            disabled={isUpdatingPassword || !currentPassword || !newPassword}
            className="h-8 px-4 text-xs font-semibold bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 shadow-sm"
          >
            {isUpdatingPassword && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            <span>{isUpdatingPassword ? "Updating Password..." : "Update Password"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}