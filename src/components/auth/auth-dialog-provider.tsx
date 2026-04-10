'use client';

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { signInWithGoogle } from "@/app/auth/login/actions";
import { getLinkedInAuthUrl, isLinkedInConfigured } from "@/utils/actions/linkedin/actions";
import { cn } from "@/lib/utils";

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


function SocialAuth({ onEmailClick }: { onEmailClick?: () => void }) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>();
  const authContext = useContext(AuthDialogContext);

  const handleLinkedInSignIn = async () => {
    setErrorMessage(undefined);
    try {
      const configured = await isLinkedInConfigured();
      if (!configured) {
        setErrorMessage("LinkedIn OAuth is not configured.");
        setIsLoading(null);
        return;
      }
      setIsLoading('linkedin');
      const authUrl = await getLinkedInAuthUrl();
      window.location.href = authUrl;
    } catch {
      setErrorMessage("Failed to start LinkedIn sign in.");
      setIsLoading(null);
    }
  };

  const openEmailAuth = () => {
    if (authContext) {
      authContext.openDialog("signup");
    }
    if (onEmailClick) {
      onEmailClick();
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage(undefined);
    try {
      setIsLoading('google');
      const result = await signInWithGoogle();
      if (!result.success) {
        setErrorMessage(result.error || "Failed to sign in with Google.");
        setIsLoading(null);
        return;
      }
      if (result.url) window.location.href = result.url;
    } catch {
      setErrorMessage("Failed to start Google sign in.");
      setIsLoading(null);
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
        onClick={handleGoogleSignIn}
        disabled={isLoading !== null}
      >
        {isLoading === 'google' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24"><path fill="#000000" d="M6 12a6 6 0 0 0 11.659 2H12v-4h9.805v4H21.8c-.927 4.564-4.962 8-9.8 8c-5.523 0-10-4.477-10-10S6.477 2 12 2a9.99 9.99 0 0 1 8.282 4.393l-3.278 2.295A6 6 0 0 0 6 12Z"/></svg>
            Google
          </>
        )}
      </Button>

<Button
        variant="outline"
        className="w-full h-10 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold text-sm transition-all"
        onClick={handleLinkedInSignIn}
        disabled={isLoading !== null}
      >
        {isLoading === 'linkedin' ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 32 32" fill="#000000"><path fill="#000000" d="M27.26 27.271h-4.733v-7.427c0-1.771-.037-4.047-2.475-4.047c-2.468 0-2.844 1.921-2.844 3.916v7.557h-4.739V11.999h4.552v2.083h.061c.636-1.203 2.183-2.468 4.491-2.468c4.801 0 5.692 3.161 5.692 7.271v8.385zM7.115 9.912a2.75 2.75 0 0 1-2.751-2.756a2.753 2.753 0 1 1 2.751 2.756zm2.374 17.359H4.74V12h4.749zM29.636 0H2.36C1.057 0 0 1.031 0 2.307v27.387c0 1.276 1.057 2.307 2.36 2.307h27.271c1.301 0 2.369-1.031 2.369-2.307V2.307C32 1.031 30.932 0 29.631 0z"/></svg>
            LinkedIn
          </>
        )}
      </Button>

      <Button
  variant="outline"
  className="w-full h-10 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 font-semibold text-sm transition-all"
  onClick={openEmailAuth}
  disabled={isLoading !== null}
  >
        <svg className="mr-2.5 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="2"/>
        </svg>
  Email
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
  const [showEmailForm, setShowEmailForm] = useState(false);

  const resetDialog = useCallback(() => {
    setActiveTab("signup");
    setFormVersion((version) => version + 1);
    setShowEmailForm(false);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    resetDialog();
  }, [resetDialog]);

  const openDialog = useCallback((tab: AuthTab = "signup") => {
    setActiveTab(tab);
    setOpen(true);
    setShowEmailForm(false);
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

            {showEmailForm ? (
              <div className="min-h-[220px]">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowEmailForm(false)}
                  className="mb-4 text-xs text-zinc-500 hover:text-zinc-900"
                >
                  ← Back to other options
                </Button>
                {activeTab === "login" ? (
                  <LoginForm key={`login-${formVersion}`} />
                ) : (
                  <SignupForm key={`signup-${formVersion}`} onSuccess={handleSignupSuccess} />
                )}
              </div>
            ) : (
              <SocialAuth onEmailClick={() => setShowEmailForm(true)} />
            )}
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
