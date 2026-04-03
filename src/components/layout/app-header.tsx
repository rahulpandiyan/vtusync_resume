'use client';

import { LogoutButton } from "@/components/auth/logout-button";
import { SettingsButton } from "@/components/settings/settings-button";
import { Logo } from "@/components/ui/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Menu, User } from "lucide-react";
import { PageTitle } from "./page-title";
import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState, useEffect, useRef } from "react";
import { ModelSelector } from "@/components/shared/model-selector";
import { getDefaultModel } from "@/lib/ai-models";
import { useApiKeys, useDefaultModel } from "@/hooks/use-api-keys";
import { TrialStartButton } from "@/components/trial/trial-start-button";

interface AppHeaderProps {
  children?: React.ReactNode;
  showUpgradeButton?: boolean;
  isProPlan?: boolean;
  upgradeButtonVariant?: 'trial' | 'upgrade';
}

export function AppHeader({
  children,
  showUpgradeButton = true,
  isProPlan = false,
  upgradeButtonVariant = 'upgrade',
}: AppHeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Use synchronized hooks for instant updates across components
  const { apiKeys } = useApiKeys();
  const { defaultModel, setDefaultModel } = useDefaultModel();
  
  // Track if we've initialized the default model
  const hasInitialized = useRef(false);

  // Initialize default model if not set (only runs once on mount)
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    if (!defaultModel) {
      const defaultModelId = getDefaultModel(isProPlan);
      setDefaultModel(defaultModelId);
    }
  }, [defaultModel, isProPlan, setDefaultModel]);

  const handleModelChange = (modelId: string) => {
    setDefaultModel(modelId);
  };

  const handleProfileClick = () => {
    setIsOpen(false);
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md fixed top-0 left-0 right-0 z-40">
      {/* Content Container */}
      <div className="max-w-[2000px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between relative">
        {/* Left Section - Logo and Title */}
        <div className="flex items-center gap-4 min-w-0 flex-shrink">
          <Logo className="text-xl flex-shrink-0" />
          <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden xs:block flex-shrink-0" />
          <div className="flex items-center min-w-0 max-w-[120px] xs:max-w-[200px] sm:max-w-[400px] lg:max-w-[800px]">
            <div className="truncate text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
              <PageTitle />
            </div>
          </div>
        </div>

        {/* Right Section - Navigation Items */}
        <div className="flex items-center flex-shrink-0 gap-3 sm:gap-4">
          {children ? (
            children
          ) : (
            <>
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4 lg:gap-6">
                {showUpgradeButton && (
                  <>
                    <div className="flex items-center">
                      {upgradeButtonVariant === 'trial' ? (
                        <TrialStartButton className="h-9 px-4 rounded-md text-xs font-semibold" />
                      ) : (
                        <ProUpgradeButton className="h-9 px-4 rounded-md text-xs font-semibold" />
                      )}
                    </div>
                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                  </>
                )}
                
                {/* Model Selector */}
                <div className="min-w-[200px]">
                  <ModelSelector
                    value={defaultModel}
                    onValueChange={handleModelChange}
                    apiKeys={apiKeys}
                    isProPlan={isProPlan}
                    className="h-9 rounded-md border-zinc-200 dark:border-zinc-800 font-medium text-xs bg-transparent"
                    placeholder="Select AI model"
                    showToast={false}
                  />
                </div>
                
                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800" />
                
                <div className="flex items-center gap-1.5">
                  <Link 
                    href="/profile" 
                    onClick={handleProfileClick}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 transition-all"
                    )}
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline">Profile</span>
                  </Link>
                  <SettingsButton className="h-8 w-8 p-0" />
                  <LogoutButton className="h-8 w-8 p-0 text-zinc-400 hover:text-red-500" />
                </div>
              </nav>

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] border-l border-zinc-200 dark:border-zinc-800 p-0 bg-white dark:bg-zinc-950">
                  <div className="p-6">
                    <SheetHeader className="mb-6">
                      <SheetTitle className="text-left text-xs font-black uppercase tracking-[0.2em] text-zinc-400">Navigation</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-3">
                      {showUpgradeButton &&
                        (upgradeButtonVariant === 'trial' ? (
                          <TrialStartButton className="w-full h-11 rounded-md text-sm font-semibold" />
                        ) : (
                          <ProUpgradeButton className="w-full h-11 rounded-md text-sm font-semibold" />
                        ))}
                      
                      <div className="mt-4 space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 px-1">AI Model</p>
                        <ModelSelector
                          value={defaultModel}
                          onValueChange={handleModelChange}
                          apiKeys={apiKeys}
                          isProPlan={isProPlan}
                          className="w-full h-10 rounded-md border-zinc-200 dark:border-zinc-800 font-medium text-sm"
                          placeholder="Select AI model"
                          showToast={false}
                        />
                      </div>
                      
                      <div className="h-px bg-zinc-100 dark:bg-zinc-900 my-4" />
                      
                      <Link
                        href="/profile"
                        onClick={handleProfileClick}
                        className="flex items-center gap-3 px-3 py-3 rounded-md text-sm font-semibold text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 dark:hover:text-zinc-100 dark:hover:bg-zinc-900 transition-all"
                      >
                        <User className="h-5 w-5" />
                        Profile
                      </Link>
                      <SettingsButton
                        className="w-full h-12 justify-start px-3 rounded-md font-semibold text-sm"
                        onAllowedNavigation={() => setIsOpen(false)}
                      />
                      <LogoutButton className="w-full h-12 justify-start px-3 rounded-md font-semibold text-sm hover:text-red-500" />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
