'use client'

import React, { useState } from "react"
import Image from "next/image"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { Crown, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  getModelById,
  getProviderById,
  isModelAvailable,
  groupModelsByProvider,
  type AIModel,
  type ApiKey
} from '@/lib/ai-models'

interface ModelSelectorProps {
  value: string
  onValueChange: (value: string) => void
  apiKeys: ApiKey[]
  isProPlan: boolean
  className?: string
  placeholder?: string
  showToast?: boolean
}

// Helper component for unavailable model popover
function UnavailableModelPopover({ children, model }: { children: React.ReactNode; model: AIModel }) {
  const [open, setOpen] = useState(false)
  const provider = getProviderById(model.provider)
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          className="w-full"
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 z-50" 
        side="right" 
        align="start"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <h4 className="font-semibold text-sm">
              {model.name} is not available
            </h4>
            <p className="text-xs text-muted-foreground">
              To use this model, you need either a Pro subscription or a {provider?.name} API key.
            </p>
          </div>
          
          <div className="space-y-2">
            {/* Pro Option */}
            <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Recommended</span>
                <span className="px-2 py-0.5 text-xs font-medium bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 rounded-full">
                  Instant Access
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                Get unlimited access to all AI models without managing API keys
              </p>
              <Link href="/subscription">
                <Button size="sm" className="w-full bg-zinc-900 text-zinc-50 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 h-7 text-xs">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>

            {/* API Key Option */}
            <div className="p-3 rounded-lg border border-gray-200/50 bg-gray-50/30">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-800">Alternative</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">
                Add your own {provider?.name} API key to use this model
              </p>
              <div className="flex gap-2">
                <Link href="/settings" className="flex-1">
                  <Button size="sm" variant="outline" className="w-full h-7 text-xs">
                    Configure API Key
                  </Button>
                </Link>
                {provider?.apiLink && (
                  <Link href={provider.apiLink} target="_blank" rel="noopener noreferrer">
                    <Button size="sm" variant="ghost" className="h-7 px-2">
                      <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export function ModelSelector({ 
  value, 
  onValueChange, 
  apiKeys, 
  isProPlan, 
  className,
  placeholder = "Select an AI model",
  showToast = true
}: ModelSelectorProps) {
  
  const isModelSelectable = (modelId: string) => {
    return isModelAvailable(modelId, isProPlan, apiKeys)
  }

  const handleModelChange = (modelId: string) => {
    const selectedModel = getModelById(modelId)
    if (!selectedModel) return

    // Check if model is available for the user
    if (!isModelAvailable(modelId, isProPlan, apiKeys)) {
      if (showToast) {
        const provider = getProviderById(selectedModel.provider)
        toast.error(`Please add your ${provider?.name || selectedModel.provider} API key first`)
      }
      return
    }

    onValueChange(modelId)
    if (showToast) {
      toast.success('Model updated successfully')
    }
  }

  // Use the centralized grouping function
  const getModelsByProvider = () => groupModelsByProvider()

  return (
    <Select value={value} onValueChange={handleModelChange}>
      <SelectTrigger className={cn(
        "bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="min-w-[320px] max-w-[400px] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-md p-1">
        {getModelsByProvider().map((group, groupIndex) => (
          <div key={group.provider}>
            <SelectGroup>
              <SelectLabel className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 px-3 py-2">
                <div className="flex items-center gap-2">
                  {getProviderById(group.provider)?.logo && (
                    <Image
                      src={getProviderById(group.provider)!.logo!}
                      alt={`${group.name} logo`}
                      width={14}
                      height={14}
                      className="rounded-sm opacity-60"
                    />
                  )}
                  {group.name}
                </div>
              </SelectLabel>
              {group.models.map((model) => {
                const provider = getProviderById(model.provider)
                const isSelectable = isModelSelectable(model.id)
                
                const selectItem = (
                  <SelectItem 
                    key={model.id} 
                    value={model.id}
                    disabled={!isSelectable}
                    className={cn(
                      "rounded-lg transition-all mb-1 px-3 py-2",
                      !isSelectable ? 'opacity-40' : 'cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    )}
                  >
                    <div className="flex items-center gap-3 w-full">
                      {provider?.logo && (
                        <Image
                          src={provider.logo}
                          alt={`${provider.name} logo`}
                          width={18}
                          height={18}
                          className="rounded-sm flex-shrink-0"
                        />
                      )}
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="truncate font-medium text-sm">{model.name}</span>
                        {model.features.isRecommended && (
                          <span className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[10px] font-medium flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                            Top
                          </span>
                        )}
                        {model.features.isFree && (
                          <span className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-md text-[10px] font-medium flex-shrink-0 border border-zinc-200 dark:border-zinc-700">
                            Free
                          </span>
                        )}
                      </div>
                      {!isSelectable && (
                        <Crown className="ml-1.5 h-3.5 w-3.5 text-amber-500 flex-shrink-0" />
                      )}
                    </div>
                  </SelectItem>
                )

                // Wrap unavailable models with popover
                if (!isSelectable) {
                  return (
                    <UnavailableModelPopover key={model.id} model={model}>
                      {selectItem}
                    </UnavailableModelPopover>
                  )
                }

                return selectItem
              })}
            </SelectGroup>
            {groupIndex < getModelsByProvider().length - 1 && (
              <div className="h-px bg-muted mx-2 my-2" />
            )}
          </div>
        ))}
      </SelectContent>
    </Select>
  )
}

// Re-export types from centralized location
export type { AIModel, ApiKey } from '@/lib/ai-models' 