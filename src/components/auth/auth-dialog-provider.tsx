'use client';

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { Github, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

import { signInWithGithub } from "@/app/auth/login/actions";
import { LoginForm } from "@/components/auth/login-form";
import { SignupForm } from "@/components/auth/signup-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

export type AuthTab = "login" | "signup";

interface AuthDialogContextValue {
  openDialog: (tab?: AuthTab) => void;
}

const AuthDialogContext = createContext<AuthDialogContextValue | undefined>(undefined);


function SocialAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const handleGithubSignIn = async () => {
    setErrorMessage(undefined);

    try {
      setIsLoading(true);
      const result = await signInWithGithub();

      if (!result.success) {
        const message = result.error || "Failed to sign in with GitHub.";
        setErrorMessage(message);
        return;
      }

      if (result.url) {
        window.location.href = result.url;
        return;
      }

      setErrorMessage("Failed to start GitHub sign in.");
    } catch (error) {
      console.error("Failed to sign in with GitHub:", error);
      setErrorMessage("Failed to start GitHub sign in.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-100 dark:border-zinc-900" />
        </div>
        <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <span className="bg-white dark:bg-zinc-950 px-3">Continue with</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full h-10 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold text-sm transition-all"
        onClick={handleGithubSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Github className="mr-2.5 h-4 w-4 fill-current text-zinc-900 dark:text-zinc-100" />
            GitHub
          </>
        )}
      </Button>

      {errorMessage && (
        <Alert variant="destructive" className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 rounded-md py-2.5" role="alert">
          <AlertDescription className="text-xs font-medium">{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AuthTab>("signup");
  const [formVersion, setFormVersion] = useState(0);

  const resetDialog = useCallback(() => {
    setActiveTab("signup");
    setFormVersion((version) => version + 1);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    resetDialog();
  }, [resetDialog]);

  const openDialog = useCallback((tab: AuthTab = "signup") => {
    setActiveTab(tab);
    setOpen(true);
  }, []);

  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        closeDialog();
        return;
      }
      setOpen(true);
    },
    [closeDialog]
  );

  const handleSignupSuccess = useCallback(() => {
    toast.success("Account created. Check your email to confirm.");
    closeDialog();
  }, [closeDialog]);

  const contextValue = useMemo(
    () => ({
      openDialog,
    }),
    [openDialog]
  );

  return (
    <AuthDialogContext.Provider value={contextValue}>
      {children}

      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          className="
            sm:max-w-[420px] w-full p-0 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-xl
            rounded-xl overflow-hidden
          "
        >
          <DialogTitle className="sr-only">Authentication</DialogTitle>
          <DialogDescription className="sr-only">Sign in or create an account</DialogDescription>

          <div className="px-8 pb-10 pt-10">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="inline-flex p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg mb-8">
                <button
                  onClick={() => setActiveTab("signup")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-semibold transition-all",
                    activeTab === "signup" 
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => setActiveTab("login")}
                  className={cn(
                    "px-4 py-1.5 rounded-md text-xs font-semibold transition-all",
                    activeTab === "login" 
                      ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm" 
                      : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                  )}
                >
                  Log In
                </button>
              </div>

              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-none mb-2">
                {activeTab === "signup" ? "Create an account" : "Welcome back"}
              </h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {activeTab === "signup" ? "Get started with your professional resume today" : "Sign in to your account to continue"}
              </p>
            </div>

            <div className="min-h-[220px]">
              {activeTab === "login" ? (
                <LoginForm key={`login-${formVersion}`} />
              ) : (
                <SignupForm key={`signup-${formVersion}`} onSuccess={handleSignupSuccess} />
              )}
            </div>

            <SocialAuth />
          </div>
        </DialogContent>
      </Dialog>
    </AuthDialogContext.Provider>
  );
}

export function useAuthDialog() {
  const context = useContext(AuthDialogContext);
  if (!context) {
    throw new Error("useAuthDialog must be used inside AuthDialogProvider");
  }
  return context;
}
