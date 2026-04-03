'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SecurityForm } from "./security-form"
import { ApiKeysForm } from "./api-keys-form"
import { SubscriptionSection } from "./subscription-section"
import { DangerZone } from "./danger-zone"
import { AiPromptsForm } from "./ai-prompts-form"
import { User } from "@supabase/supabase-js"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Shield, CreditCard, Key, Bot, AlertTriangle, Book } from "lucide-react"
import type { SubscriptionSnapshot } from "@/lib/subscription-access"
import Link from "next/link"

const sections = [
  { id: "security", title: "Security", description: "Manage your email and password settings", icon: Shield },
  { id: "subscription", title: "Subscription", description: "Manage your subscription and billing settings", icon: CreditCard },
  { id: "api-keys", title: "API Keys", description: "Manage your API keys for different AI providers", icon: Key },
  { id: "ai-prompts", title: "AI Prompts", description: "Customize AI system prompts for different actions", icon: Bot },
  { id: "danger-zone", title: "Danger Zone", description: "Irreversible and destructive actions", icon: AlertTriangle },
  { id: "legal", title: "Legal", description: "Privacy Policy and Terms of Service", icon: Book },
]

interface SettingsContentProps {
  user: User | null;
  isProPlan: boolean;
  subscriptionStatus: string;
  subscriptionSnapshot: SubscriptionSnapshot | null;
}

export function SettingsContent({ user, isProPlan, subscriptionStatus, subscriptionSnapshot }: SettingsContentProps) {
  const [activeSection, setActiveSection] = useState<string>("security")

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }))

      const currentSection = sectionElements.find(({ element }) => {
        if (!element) return false
        const rect = element.getBoundingClientRect()
        return rect.top <= 100 && rect.bottom > 100
      })

      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 80
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <div className="flex gap-8 relative">
      {/* Table of Contents */}
      <div className="w-64 hidden lg:block">
        <div className="sticky top-20 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold tracking-wide mb-4 text-zinc-500 text-sm uppercase">On this page</h3>
          <div className="space-y-2">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-left font-medium transition-all duration-200 relative pl-10 h-10 rounded-lg",
                  activeSection === section.id && 
                  "text-zinc-900 bg-zinc-100 dark:text-zinc-50 dark:bg-zinc-800",
                  activeSection !== section.id && "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                )}
                onClick={() => scrollToSection(section.id)}
              >
                <span className="absolute left-3 flex h-full items-center">
                  <section.icon className="w-4 h-4" />
                </span>
                <span className="truncate">{section.title}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-8">
        {/* Security Settings */}
        <Card id="security" className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Security</CardTitle>
            <CardDescription className="font-medium text-zinc-500">Manage your email and password settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SecurityForm user={user} />
          </CardContent>
        </Card>

        {/* Subscription Management */}
        <Card id="subscription" className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Subscription</CardTitle>
            <CardDescription className="font-medium text-zinc-500">Manage your subscription and billing settings</CardDescription>
          </CardHeader>
          <CardContent>
            <SubscriptionSection initialProfile={subscriptionSnapshot} />
          </CardContent>
        </Card>

        {/* API Keys */}
        <Card id="api-keys" className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">API Keys</CardTitle>
            <CardDescription className="font-medium text-zinc-500">Manage your API keys for different AI providers</CardDescription>
          </CardHeader>
          <CardContent>
            <ApiKeysForm isProPlan={isProPlan} />
          </CardContent>
        </Card>

        {/* AI Prompts */}
        <Card id="ai-prompts" className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">AI Prompts</CardTitle>
            <CardDescription className="font-medium text-zinc-500">Customize AI system prompts for different actions</CardDescription>
          </CardHeader>
          <CardContent>
            <AiPromptsForm />
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card id="danger-zone" className="rounded-xl border border-red-200 dark:border-red-900/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight text-red-600 dark:text-red-500">Danger Zone</CardTitle>
            <CardDescription className="font-medium text-red-500/80">Irreversible and destructive actions</CardDescription>
          </CardHeader>
          <CardContent>
            <DangerZone subscriptionStatus={subscriptionStatus} />
          </CardContent>
        </Card>

        {/* Legal */}
        <Card id="legal" className="rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold tracking-tight">Legal</CardTitle>
            <CardDescription className="font-medium text-zinc-500">Important legal documents and policies</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3">
              <Link href="/privacy" className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700">
                <Book className="w-4 h-4 mr-3 text-zinc-400" />
                Privacy Policy
              </Link>
              <Link href="/terms" className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700">
                <Book className="w-4 h-4 mr-3 text-zinc-400" />
                Terms of Service
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 
