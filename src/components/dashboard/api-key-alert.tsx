'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Sparkles, Crown, ArrowRight, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ProUpgradeButton } from "@/components/settings/pro-upgrade-button"
import { useApiKeys } from "@/hooks/use-api-keys"
import { useRouter } from "next/navigation"

type ApiKeyAlertVariant = 'upgrade' | 'trial'

export function ApiKeyAlert({ variant = 'upgrade' }: { variant?: ApiKeyAlertVariant }) {
  // Use synchronized hook for instant updates when API keys change
  const { apiKeys } = useApiKeys()
  const router = useRouter()
  
  // Check if user has any API keys configured
  const hasApiKeys = apiKeys.length > 0

  if (hasApiKeys) return null

  return (
    <Alert className="border-0 p-0 bg-transparent">
      <AlertDescription className="p-0">
        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          {/* Subtle gradient overlay removed */}
          
          <div className="relative p-4">
            {/* Main Content - Horizontal Layout */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-zinc-900 dark:text-zinc-50" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
                    {variant === 'trial' ? 'Try Pro free for 7 days' : 'Unlock Full AI Power'}
                  </h3>
                  {variant === 'trial' ? (
                    <span className="px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-full">
                      Free trial
                    </span>
                  ) : (
                    <>
                      <Crown className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                      <span className="px-2 py-0.5 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 rounded-full">
                        Most Popular
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center gap-4 text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                  <span className="flex items-center gap-1">🚀 Unlimited resumes</span>
                  <span className="flex items-center gap-1">🤖 Latest AI models</span>
                  <span className="flex items-center gap-1">⚡ Instant access</span>
                </div>

                <p className="text-xs text-zinc-500">
                  {variant === 'trial' ? 'Join 1,800+ users building with ResuSync' : 'Join 1,800+ users building with ResuSync'}
                </p>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0">
                {variant === 'trial' ? (
                  <Button
                    onClick={() => {
                      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
                      if (priceId) {
                        router.push(`/subscription/checkout?price_id=${priceId}&trial=true`)
                        return
                      }
                      router.push('/start-trial')
                    }}
                    className="bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                  >
                    <Clock className="h-4 w-4" />
                    Start trial
                  </Button>
                ) : (
                  <ProUpgradeButton />
                )}
              </div>
            </div>

            {variant === 'upgrade' && (
              <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span>Or use your own API keys:</span>
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
                      className="text-xs h-6 px-2"
                    >
                      Configure
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  )
} 
