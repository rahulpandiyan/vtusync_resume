"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { signInWithGoogle } from "@/app/auth/login/actions";
import { getLinkedInAuthUrl, isLinkedInConfigured } from "@/utils/actions/linkedin/actions";
import { cn } from "@/lib/utils";

interface AuthScreenProps {
  initialMode?: "login" | "signup";
  errorCode?: string;
}

export function AuthScreen({ initialMode = "login", errorCode }: AuthScreenProps) {
  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [socialLoading, setSocialLoading] = useState<"google" | "linkedin" | null>(null);
  const [socialError, setSocialError] = useState<string | null>(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  const handleTabSwitch = (newMode: "login" | "signup") => {
    setMode(newMode);
    setSocialError(null);
    setSignupSuccess(false);
    startTransition(() => {
      router.replace(newMode === "signup" ? "/signup" : "/login", { scroll: false });
    });
  };

  const handleGoogleSignIn = async () => {
    setSocialError(null);
    try {
      setSocialLoading("google");
      const result = await signInWithGoogle();
      if (!result.success) {
        setSocialError(result.error || "Failed to sign in with Google.");
        setSocialLoading(null);
        return;
      }
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      setSocialError("Failed to initiate Google sign in.");
      setSocialLoading(null);
    }
  };

  const handleLinkedInSignIn = async () => {
    setSocialError(null);
    try {
      setSocialLoading("linkedin");
      const configured = await isLinkedInConfigured();
      if (!configured) {
        setSocialError("LinkedIn OAuth is not configured. Please use Google or Email.");
        setSocialLoading(null);
        return;
      }
      const authUrl = await getLinkedInAuthUrl();
      window.location.href = authUrl;
    } catch {
      setSocialError("Failed to start LinkedIn sign in.");
      setSocialLoading(null);
    }
  };

  const getErrorMessage = (code?: string) => {
    if (!code) return null;
    if (code === "email_confirmation") {
      return "Email confirmation required. Please check your inbox and verify your email to continue.";
    }
    if (code === "auth_code_missing") {
      return "Authentication session expired or code was missing. Please try signing in again.";
    }
    if (code === "not_authenticated") {
      return "Please sign in to continue.";
    }
    return `Authentication notice: ${code}`;
  };

  const bannerError = getErrorMessage(errorCode);

  return (
    <div className="min-h-screen w-full flex flex-col justify-between bg-zinc-50/60 dark:bg-zinc-950 font-sans selection:bg-zinc-900 selection:text-white dark:selection:bg-white dark:selection:text-zinc-900 px-4 py-8 sm:py-12">
      {/* Top Navigation */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between">
        <Logo asLink href="/" />
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1.5 px-3 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>
      </div>

      {/* Centered Professional Auth Card */}
      <div className="w-full max-w-[420px] mx-auto my-auto">
        <div className="bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-2xl shadow-sm p-6 sm:p-8 backdrop-blur-sm">
          {/* Segmented Pill Tab Switcher */}
          <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-lg mb-6 w-full text-center border border-zinc-200/60 dark:border-zinc-750">
            <button
              type="button"
              onClick={() => handleTabSwitch("login")}
              className={cn(
                "w-1/2 py-2 rounded-md text-xs font-semibold transition-all duration-150",
                mode === "login"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabSwitch("signup")}
              className={cn(
                "w-1/2 py-2 rounded-md text-xs font-semibold transition-all duration-150",
                mode === "signup"
                  ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
              )}
            >
              Create Account
            </button>
          </div>

          {/* Header */}
          <div className="mb-6 space-y-1.5 text-center">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
              {mode === "login"
                ? "Enter your credentials to access your account"
                : "Enter your details to get started with ResuSync"}
            </p>
          </div>

          {/* Error Banner */}
          {bannerError && (
            <Alert variant="destructive" className="mb-5 bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 py-2.5 px-3 rounded-lg">
              <AlertDescription className="text-xs font-medium leading-relaxed">
                {bannerError}
              </AlertDescription>
            </Alert>
          )}

          {/* Social Sign-in Buttons */}
          <div className="space-y-2.5 mb-5">
            <Button
              type="button"
              variant="outline"
              disabled={socialLoading !== null}
              onClick={handleGoogleSignIn}
              className="w-full h-10 rounded-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 font-medium text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
            >
              {socialLoading === "google" ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span>Continue with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={socialLoading !== null}
              onClick={handleLinkedInSignIn}
              className="w-full h-10 rounded-lg border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 font-medium text-xs sm:text-sm text-zinc-800 dark:text-zinc-100 shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-[0.99]"
            >
              {socialLoading === "linkedin" ? (
                <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.61.72-1.61 1.61 0 .88.72 1.6 1.61 1.6.88 0 1.6-.72 1.6-1.6 0-.89-.72-1.61-1.6-1.61Z" />
                </svg>
              )}
              <span>Continue with LinkedIn</span>
            </Button>
          </div>

          {/* Social Error */}
          {socialError && (
            <Alert variant="destructive" className="mb-5 bg-red-50/70 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 py-2.5 px-3 rounded-lg">
              <AlertDescription className="text-xs font-medium">{socialError}</AlertDescription>
            </Alert>
          )}

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
            </div>
            <div className="relative flex justify-center text-[11px] font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              <span className="bg-white dark:bg-zinc-900 px-3">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          {signupSuccess ? (
            <div className="p-4 rounded-xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-900/50 text-blue-950 dark:text-blue-100 space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                <h3 className="text-sm font-semibold">Account created successfully</h3>
              </div>
              <p className="text-xs text-blue-800 dark:text-blue-200/90 leading-relaxed">
                We sent a confirmation link to your email address. Please open it to verify your account and start using ResuSync.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleTabSwitch("login")}
                className="mt-2 text-xs font-semibold h-8 rounded-lg bg-white dark:bg-zinc-900 border-blue-200 dark:border-blue-800"
              >
                Proceed to Sign In
              </Button>
            </div>
          ) : mode === "login" ? (
            <LoginForm />
          ) : (
            <SignupForm onSuccess={() => setSignupSuccess(true)} />
          )}

          {/* Bottom Switch Link */}
          <div className="mt-6 pt-5 border-t border-zinc-100 dark:border-zinc-800/80 text-center">
            {mode === "login" ? (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("signup")}
                  className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline transition-colors"
                >
                  Create account
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabSwitch("login")}
                  className="font-semibold text-zinc-900 dark:text-zinc-100 hover:underline transition-colors"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Clean Bottom Footer */}
      <div className="w-full max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400 dark:text-zinc-500 pt-6">
        <p>© {new Date().getFullYear()} ResuSync. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">Terms of Service</Link>
          <Link href="/how-it-works" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">How it works</Link>
        </div>
      </div>
    </div>
  );
}
