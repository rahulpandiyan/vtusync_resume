'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Loader2, Trash2 } from "lucide-react";
import { useFormStatus } from 'react-dom';
import { deleteUserAccount } from "@/app/auth/login/actions";

interface DangerZoneProps {
  subscriptionStatus?: string;
}

interface SubmitButtonProps {
  isEnabled: boolean;
}

function SubmitButton({ isEnabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = pending || !isEnabled;

  return (
    <AlertDialogAction
      type="submit"
      className="bg-red-600 text-white hover:bg-red-700 font-semibold"
      disabled={isDisabled}
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      Delete Account Permanently
    </AlertDialogAction>
  );
}

export function DangerZone({ subscriptionStatus }: DangerZoneProps) {
  const [confirmation, setConfirmation] = useState("");
  const isConfirmed = confirmation === "DELETE";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-red-200/80 dark:border-red-950/60 bg-red-50/40 dark:bg-red-950/10">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold text-red-900 dark:text-red-300 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
          <span>Delete Account</span>
        </h4>
        <p className="text-xs text-red-700/80 dark:text-red-400/80">
          Permanently delete your profile, master resumes, and AI tailoring data.
        </p>
        {subscriptionStatus === 'active' && (
          <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-1">
            Note: You have an active subscription. Cancel your subscription in Plan &amp; Billing before deletion.
          </p>
        )}
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="destructive"
            size="sm"
            className="h-8 px-3 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shrink-0 self-start sm:self-center"
          >
            Delete Account
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <form action={deleteUserAccount}>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-xs font-medium">Type &ldquo;DELETE&rdquo; to confirm</Label>
                <Input
                  id="confirm"
                  name="confirm"
                  placeholder="DELETE"
                  className="h-9 text-xs"
                  value={confirmation}
                  onChange={(event) => setConfirmation(event.target.value.toUpperCase())}
                  required
                />
              </div>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
              <SubmitButton isEnabled={isConfirmed} />
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}