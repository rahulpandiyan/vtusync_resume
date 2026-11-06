'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SecurityForm } from "./security-form";
import { ApiKeysForm } from "./api-keys-form";
import { DangerZone } from "./danger-zone";
import { AiPromptsForm } from "./ai-prompts-form";
import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Shield, Bot, Key, Sparkles, Sliders } from "lucide-react";

interface SettingsContentProps {
  user: User | null;
  isProPlan: boolean;
  subscriptionStatus: string;
}

export function SettingsContent({ 
  user, 
  isProPlan, 
  subscriptionStatus, 
}: SettingsContentProps) {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') === 'api-keys' || searchParams.get('tab') === 'ai') ? 'ai' : 'account';
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'api-keys' || tab === 'ai') {
      setActiveTab('ai');
    }
  }, [searchParams]);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-200/60 dark:border-zinc-800/60">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your credentials, security preferences, and AI model configurations.
        </p>
      </div>

      {/* Sleek Segmented Switcher */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-zinc-200/60 dark:border-zinc-800/60 pb-3">
          <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-auto">
            <TabsTrigger 
              value="account" 
              className="rounded-lg text-xs font-semibold px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              <Shield className="h-3.5 w-3.5 mr-2 text-zinc-500" />
              <span>Account & Security</span>
            </TabsTrigger>

            <TabsTrigger 
              value="ai" 
              className="rounded-lg text-xs font-semibold px-4 py-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-50 data-[state=active]:shadow-sm transition-all"
            >
              <Bot className="h-3.5 w-3.5 mr-2 text-zinc-500" />
              <span>AI Engine & API Keys</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Tab 1: Account & Security */}
        <TabsContent value="account" className="space-y-6 mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg font-bold tracking-tight">Credentials & Login</CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Update your login email address and secure password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecurityForm user={user} />
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="rounded-2xl border border-red-200/70 dark:border-red-950/40 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg font-bold text-red-600 dark:text-red-400">
                Danger Zone
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Irreversible actions regarding your candidate data and account.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DangerZone subscriptionStatus={subscriptionStatus} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: AI Engine & API Keys */}
        <TabsContent value="ai" className="space-y-6 mt-0 focus-visible:outline-none">
          <Card className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <Key className="h-4 w-4 text-zinc-500" />
                <span>API Key Integrations</span>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Configure your own OpenAI, Anthropic, Gemini or Groq keys, or take advantage of ResuSync cloud AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ApiKeysForm isProPlan={isProPlan} />
            </CardContent>
          </Card>

          <Card className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-900/30 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
                <Sliders className="h-4 w-4 text-zinc-500" />
                <span>Custom AI Prompts</span>
              </CardTitle>
              <CardDescription className="text-xs text-zinc-500">
                Customize how the AI rewrites your bullet points and parses job descriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AiPromptsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}