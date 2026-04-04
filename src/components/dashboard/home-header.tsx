'use client'

import { useApiKeys, useDefaultModel } from '@/hooks/use-api-keys'
import { ModelSelector } from '@/components/shared/model-selector'
import { getGreeting } from '@/lib/utils'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

interface HomeHeaderProps {
  firstName: string
  isProPlan: boolean
}

export function HomeHeader({ firstName, isProPlan }: HomeHeaderProps) {
  const { apiKeys } = useApiKeys()
  const { defaultModel, setDefaultModel } = useDefaultModel()

  return (
    <div className="space-y-3 px-1 pt-2">
      {/* Model Selector at Top - Wider */}
      <div className="flex items-center justify-between gap-2">
        <ModelSelector
          value={defaultModel}
          onValueChange={setDefaultModel}
          apiKeys={apiKeys}
          isProPlan={isProPlan}
          className="w-[180px] sm:w-[220px] text-xs"
          showToast={true}
        />
        
        {!isProPlan && (
          <Link href="/subscription">
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs px-2 h-8"
            >
              <Crown className="w-3 h-3 mr-1" />
              <span className="hidden xs:inline">Upgrade</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Greeting Below */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight truncate">
          {getGreeting()}, {firstName}
        </h1>
        <p className="text-[10px] sm:text-xs text-zinc-400 dark:text-zinc-500 mt-0.5 sm:mt-1 font-medium">
          ResuSync Dashboard
        </p>
      </div>
    </div>
  )
}
