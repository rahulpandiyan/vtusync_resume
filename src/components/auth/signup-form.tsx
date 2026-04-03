'use client'

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { signupWithState } from "@/app/auth/login/actions";
import { initialAuthFormState } from "@/components/auth/auth-form-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full mt-2"
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        "Create Account"
      )}
    </Button>
  );
}

import { useEffect } from "react";

interface SignupFormProps {
  onSuccess?: () => void;
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const [state, formAction] = useActionState(signupWithState, initialAuthFormState);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state.status === "success" && onSuccess) {
      onSuccess();
    }
  }, [state.status, onSuccess]);

  const firstNameError = state.fieldErrors?.first_name?.[0];
  const lastNameError = state.fieldErrors?.last_name?.[0];
  const emailError = state.fieldErrors?.email?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="signup-first-name" className="text-xs font-semibold text-zinc-500 ml-0.5">
            First name
          </Label>
          <Input
            autoFocus
            id="signup-first-name"
            name="first_name"
            placeholder="Jane"
            required
            className="h-10 border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950"
            aria-invalid={Boolean(firstNameError)}
            aria-describedby={firstNameError ? "signup-first-name-error" : undefined}
          />
          {firstNameError && (
            <p id="signup-first-name-error" className="text-[11px] font-medium text-red-500 ml-0.5" role="status" aria-live="polite">
              {firstNameError}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="signup-last-name" className="text-xs font-semibold text-zinc-500 ml-0.5">
            Last name
          </Label>
          <Input
            id="signup-last-name"
            name="last_name"
            placeholder="Doe"
            required
            className="h-10 border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950"
            aria-invalid={Boolean(lastNameError)}
            aria-describedby={lastNameError ? "signup-last-name-error" : undefined}
          />
          {lastNameError && (
            <p id="signup-last-name-error" className="text-[11px] font-medium text-red-500 ml-0.5" role="status" aria-live="polite">
              {lastNameError}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-xs font-semibold text-zinc-500 ml-0.5">
          Email address
        </Label>
        <Input
          id="signup-email"
          name="email"
          type="email"
          placeholder="jane@example.com"
          required
          autoComplete="username"
          className="h-10 border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950"
          aria-invalid={Boolean(emailError)}
          aria-describedby={emailError ? "signup-email-error" : undefined}
        />
        {emailError && (
          <p id="signup-email-error" className="text-[11px] font-medium text-red-500 ml-0.5" role="status" aria-live="polite">
            {emailError}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-xs font-semibold text-zinc-500 ml-0.5">
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            required
            minLength={8}
            autoComplete="new-password"
            className="h-10 border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-950 pr-10"
            aria-invalid={Boolean(passwordError)}
            aria-describedby={passwordError ? "signup-password-error" : undefined}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {passwordError && (
          <p id="signup-password-error" className="text-[11px] font-medium text-red-500 ml-0.5" role="status" aria-live="polite">
            {passwordError}
          </p>
        )}
      </div>

      {state.status === "error" && state.message && (
        <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-md py-2.5 px-3" role="alert">
          <AlertDescription className="text-xs font-medium leading-relaxed">
            {state.message}
          </AlertDescription>
        </Alert>
      )}

      <SubmitButton />
    </form>
  );
}
