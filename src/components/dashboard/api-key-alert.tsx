'use client'

import { ArrowRight, Clock, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button"
import { useApiKeys } from "@/hooks/use-api-keys"
import { useRouter } from "next/navigation"

type ApiKeyAlertVariant = 'upgrade' | 'trial'

export function ApiKeyAlert({ variant = 'upgrade' }: { variant?: ApiKeyAlertVariant }) {
  const { apiKeys } = useApiKeys()
  const router = useRouter()
  
  const hasApiKeys = apiKeys.length > 0

  if (hasApiKeys) return null

  return (
    <div className="w-full rounded-lg sm:rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm p-4">
      <div className="flex flex-col gap-4">
        {/* Header with Icon and Title */}
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center">
            {variant === 'trial' ? (
              <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            ) : (
              <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {variant === 'trial' ? 'Try Pro free for 7 days' : 'Unlock Full AI Power'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 rounded-full">
                {variant === 'trial' ? 'Free trial' : 'Most Popular'}
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-600 dark:text-zinc-400">
              <span>🚀 Unlimited resumes</span>
              <span>🤖 AI models</span>
              <span>⚡ Instant</span>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        {variant === 'trial' ? (
          <Button
            onClick={() => router.push('/subscription')}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            View pricing
          </Button>
        ) : (
          <ProUpgradeButton />
        )}

        {/* API Keys Section */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
              <span className="font-medium text-zinc-400">API keys:</span>
              <a 
                href="https://console.anthropic.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                Anthropic <ArrowRight className="w-3 h-3" />
              </a>
              <a 
                href="https://platform.openai.com/docs/quickstart/create-and-export-an-api-key"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
              >
                OpenAI <ArrowRight className="w-3 h-3" />
              </a>
            </div>
            <Link href="/settings">
              <Button
                size="sm"
                variant="outline"
                className="text-xs h-8 px-4 border-zinc-200 dark:border-zinc-800"
              >
                Configure
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
