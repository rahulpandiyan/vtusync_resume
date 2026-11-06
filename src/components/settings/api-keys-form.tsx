'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Copy, Check } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { ServiceName } from "@/lib/types"
import type { ApiKey } from "@/lib/ai-models"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import replaceSpecialCharacters from 'replace-special-characters'
import { ModelSelector } from "@/components/shared/model-selector"
import { AI_MODELS, MODEL_DESIGNATIONS, getProvidersArray, type CustomProvider } from "@/lib/ai-models"
import { useApiKeys, useDefaultModel } from "@/hooks/use-api-keys"
import { useCustomProviders } from "@/hooks/use-custom-providers"

export function ApiKeysForm({ isProPlan }: { isProPlan: boolean }) {
  // Use synchronized hooks for API keys and default model
  const { apiKeys, setApiKeys } = useApiKeys()
  const { defaultModel, setDefaultModel } = useDefaultModel()
  const { customProviders, setCustomProviders } = useCustomProviders()
  
  // UI-specific local state
  const [visibleKeys, setVisibleKeys] = useState<Record<ServiceName, boolean>>({} as Record<ServiceName, boolean>)
  const [newKeyValues, setNewKeyValues] = useState<Record<ServiceName, string>>({} as Record<ServiceName, string>)
  const [copiedKey, setCopiedKey] = useState<ServiceName | null>(null)

  // Custom provider form state
  const [cpName, setCpName] = useState('')
  const [cpBaseUrl, setCpBaseUrl] = useState('')
  const [cpApiKey, setCpApiKey] = useState('')
  const [cpModels, setCpModels] = useState('')
  const [cpSaving, setCpSaving] = useState(false)
  
  // Track if we've initialized the default model
  const hasInitialized = useRef(false)

  // Initialize default model if not set (only runs once on mount)
  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true
    
    // Only set default if there's no model selected
    if (!defaultModel) {
      if (isProPlan) {
        setDefaultModel(MODEL_DESIGNATIONS.DEFAULT_PRO)
      } else {
        setDefaultModel(MODEL_DESIGNATIONS.DEFAULT_FREE)
      }
    }
  }, [defaultModel, isProPlan, setDefaultModel])

  const handleUpdateKey = (service: ServiceName) => {
    const keyValue = newKeyValues[service]
    if (!keyValue?.trim()) {
      toast.error('Please enter an API key')
      return
    }

    // Normalize the API key by replacing special characters
    const normalizedKey = replaceSpecialCharacters(keyValue.trim())

    const newKey: ApiKey = {
      service,
      key: normalizedKey,
      addedAt: new Date().toISOString(),
    }

    setApiKeys(prev => {
      const exists = prev.findIndex(k => k.service === service)
      if (exists >= 0) {
        const updated = [...prev]
        updated[exists] = newKey
        return updated
      }
      return [...prev, newKey]
    })

    // Automatically set the default model based on the provider
    const autoSelectModel = () => {
      switch (service) {
        case 'anthropic':
          return MODEL_DESIGNATIONS.FRONTIER
        case 'openai':
          return MODEL_DESIGNATIONS.FRONTIER
        case 'openrouter':
          return MODEL_DESIGNATIONS.BALANCED
        default:
          return defaultModel
      }
    }

    const newModel = autoSelectModel()
    if (newModel !== defaultModel) {
      setDefaultModel(newModel)
      toast.success(`Default model automatically set to ${AI_MODELS.find(m => m.id === newModel)?.name}`)
    }

    setNewKeyValues(prev => ({
      ...prev,
      [service]: ''
    }))
    toast.success('API key saved successfully')
  }

  const handleRemoveKey = (service: ServiceName) => {
    setApiKeys(prev => prev.filter(k => k.service !== service))
    setVisibleKeys(prev => {
      const updated = { ...prev }
      delete updated[service]
      return updated
    })

    // Check if current default model requires this API key
    const currentModel = AI_MODELS.find(m => m.id === defaultModel)
    if (currentModel?.provider === service) {
      // Find first available model that has API key
      const firstAvailableModel = AI_MODELS.find(m => 
        apiKeys.some(k => k.service === m.provider && k.service !== service)
      )
      
      if (firstAvailableModel) {
        setDefaultModel(firstAvailableModel.id)
        toast.info(`Switched to ${firstAvailableModel.name}`)
      } else {
        setDefaultModel('')
        toast.info('No models available. Please add an API key')
      }
    }

    toast.success('API key removed successfully')
  }

  const getExistingKey = (service: ServiceName) => 
    apiKeys.find(k => k.service === service)

  const handleModelChange = (modelId: string) => {
    setDefaultModel(modelId)
  }

  const handleCopyKey = (service: ServiceName, key: string) => {
    navigator.clipboard.writeText(key)
    setCopiedKey(service)
    setTimeout(() => setCopiedKey(null), 1000)
  }

  const handleAddCustomProvider = () => {
    const name = cpName.trim()
    const baseUrl = cpBaseUrl.trim().replace(/\/+$/, '')
    const apiKey = replaceSpecialCharacters(cpApiKey.trim())
    const modelInput = cpModels.trim()

    if (!name) return toast.error('Please enter a provider name')
    if (!baseUrl) return toast.error('Please enter the API endpoint URL')
    if (!apiKey) return toast.error('Please enter your API key')
    if (!modelInput) return toast.error('Please enter at least one model ID')

    const models = modelInput
      .split(',')
      .map(m => m.trim())
      .filter(Boolean)
      .map(id => ({ id }))

    if (models.length === 0) return toast.error('Please enter a valid model ID')

    const provider: CustomProvider = {
      id: `cp_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`,
      name,
      baseUrl,
      apiKey,
      models,
    }

    setCustomProviders(prev => [...prev, provider])
    setCpName('')
    setCpBaseUrl('')
    setCpApiKey('')
    setCpModels('')
    setCpSaving(false)
    toast.success(`Custom provider "${name}" added`)
  }

  const handleRemoveCustomProvider = (id: string) => {
    setCustomProviders(prev => prev.filter(p => p.id !== id))
    // If the current default model belongs to this provider, reset it
    if (defaultModel.startsWith(`custom::${id}::`)) {
      setDefaultModel(MODEL_DESIGNATIONS.DEFAULT_FREE)
      toast.info('Switched to the default free model')
    }
    toast.success('Custom provider removed')
  }

  return (
    <div className="space-y-6">
      {/* Model Selection Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Default AI Model
        </Label>
        <p className="text-sm text-muted-foreground mt-2 mb-3">
          This model will be used for all AI operations throughout the application. Free models (Groq, custom providers) use your own API key.
        </p>
        <ModelSelector
          value={defaultModel}
          onValueChange={handleModelChange}
          apiKeys={apiKeys}
          isProPlan={isProPlan}
          customProviders={customProviders}
          className="w-full mt-1"
          placeholder="Select an AI model"
        />
      </div>

      {/* API Keys Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          API Keys
        </Label>
        <div className="mt-2 mb-4 space-y-2">
          <p className="text-sm text-muted-foreground">
            Add your API keys to use premium AI models. Your keys are stored securely in your browser.
          </p>
          <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200/50 text-amber-900 text-sm">
            {isProPlan ? (
              <>
                <p><strong>Pro Account Active:</strong> You have full access to all AI models without needing to manage API keys.</p>
                <p className="mt-1">You can still add personal API keys below if you prefer to use your own credentials.</p>
              </>
            ) : (
              <>
                <p><strong>Security Note:</strong> API keys are stored locally in your browser. While convenient, this means anyone with access to this device could potentially view your keys.</p>
                <p className="mt-1">For enhanced security, consider <a href="/subscription" className="text-amber-700 hover:text-amber-800 underline underline-offset-2">upgrading to a Pro account</a> where we securely manage API access for you.</p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {/* Stable Providers */}
          {getProvidersArray().filter(p => !p.unstable).map(provider => {
            const existingKey = getExistingKey(provider.id)
            const isVisible = visibleKeys[provider.id]
            const providerModels = AI_MODELS.filter(model => model.provider === provider.id)

            return (
              <div 
                key={provider.id}
                className={cn(
                  "p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{provider.name}</Label>
                  </div>
                  {existingKey && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setVisibleKeys(prev => ({
                          ...prev,
                          [provider.id]: !prev[provider.id]
                        }))}
                        className="h-7 px-2 text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                      >
                        {isVisible ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyKey(provider.id, existingKey.key)}
                        className={cn(
                          "h-7 px-2 transition-colors",
                          copiedKey === provider.id 
                            ? "text-emerald-500 hover:text-emerald-600" 
                            : "text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50"
                        )}
                      >
                        {copiedKey === provider.id ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveKey(provider.id)}
                        className="h-7 px-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        Remove
                      </Button>
                    </div>
                  )}
                </div>

                {existingKey ? (
                  <div className="text-xs space-y-1">
                    <div className="text-muted-foreground">
                      Added {new Date(existingKey.addedAt).toLocaleDateString()}
                    </div>
                    {isVisible && (
                      <div className="font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md text-sm border border-zinc-200 dark:border-zinc-700">
                        {existingKey.key}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex gap-2 flex-1">
                        <Input
                          type={isVisible ? "text" : "password"}
                          placeholder="Enter API key"
                          value={newKeyValues[provider.id] || ""}
                          onChange={(e) =>
                            setNewKeyValues((prev) => ({
                              ...prev,
                              [provider.id]: e.target.value,
                            }))
                          }
                          className="flex-1 h-9 text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            setVisibleKeys((prev) => ({
                              ...prev,
                              [provider.id]: !prev[provider.id],
                            }))
                          }
                          className="h-9 w-9 shrink-0"
                        >
                          {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </Button>
                      </div>
                      <Button 
                        className="w-full sm:w-auto bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 h-9 px-4 text-sm transition-colors"
                        onClick={() => handleUpdateKey(provider.id)}
                      >
                        Save
                      </Button>
                    </div>
                    <a 
                      href={provider.apiLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-2"
                    >
                      Get your {provider.name} API key →
                    </a>
                  </>
                )}

                {providerModels.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-2">
                    Available models: {providerModels.map(m => `${m.name}${m.features.isUnstable ? ' (Unstable)' : ''}`).join(', ')}
                  </div>
                )}
              </div>
            )
          })}

          {/* Unstable Providers Section */}
          <div className="mt-8 pt-6 border-t border-amber-200/50">
            <div className="mb-4 p-3 rounded-lg bg-amber-50/50 border border-amber-200/50 text-amber-900 text-sm">
              <p className="font-medium">Experimental Providers Notice</p>
              <p className="mt-1">The following providers are currently unstable. You may experience errors or intermittent service. We recommend using stable providers above for critical operations.</p>
            </div>

            {getProvidersArray().filter(p => p.unstable).map(provider => {
              const existingKey = getExistingKey(provider.id)
              const isVisible = visibleKeys[provider.id]
              const providerModels = AI_MODELS.filter(model => model.provider === provider.id)

              return (
                <div 
                  key={provider.id}
                  className={cn(
                    "p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 transition-all",
                    "relative border-amber-200/50"
                  )}
                >
                  <div className="absolute top-2 right-2 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    Unstable
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Label className="text-sm font-medium text-zinc-900 dark:text-zinc-50">{provider.name}</Label>
                    </div>
                    {existingKey && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setVisibleKeys(prev => ({
                            ...prev,
                            [provider.id]: !prev[provider.id]
                          }))}
                          className="h-7 px-2 text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
                        >
                          {isVisible ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyKey(provider.id, existingKey.key)}
                          className={cn(
                            "h-7 px-2 transition-colors",
                            copiedKey === provider.id 
                              ? "text-emerald-500 hover:text-emerald-600" 
                              : "text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50"
                          )}
                        >
                          {copiedKey === provider.id ? (
                            <Check className="h-3.5 w-3.5" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveKey(provider.id)}
                          className="h-7 px-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  {existingKey ? (
                    <div className="text-xs space-y-1">
                      <div className="text-muted-foreground">
                        Added {new Date(existingKey.addedAt).toLocaleDateString()}
                      </div>
                      {isVisible && (
                        <div className="font-mono bg-zinc-100 dark:bg-zinc-800 px-3 py-1.5 rounded-md text-sm border border-zinc-200 dark:border-zinc-700">
                          {existingKey.key}
                        </div>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <div className="flex gap-2 flex-1">
                          <Input
                            type={isVisible ? "text" : "password"}
                            placeholder="Enter API key"
                            value={newKeyValues[provider.id] || ""}
                            onChange={(e) =>
                              setNewKeyValues((prev) => ({
                                ...prev,
                                [provider.id]: e.target.value,
                              }))
                            }
                            className="flex-1 h-9 text-sm"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              setVisibleKeys((prev) => ({
                                ...prev,
                                [provider.id]: !prev[provider.id],
                              }))
                            }
                            className="h-9 w-9 shrink-0"
                          >
                            {isVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </Button>
                        </div>
                        <Button 
                          className="w-full sm:w-auto bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 h-9 px-4 text-sm transition-colors"
                          onClick={() => handleUpdateKey(provider.id)}
                        >
                          Save
                        </Button>
                      </div>
                      <a 
                        href={provider.apiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 underline underline-offset-2"
                      >
                        Get your {provider.name} API key →
                      </a>
                    </>
                  )}

                  {providerModels.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                      Available models: {providerModels.map(m => `${m.name}${m.features.isUnstable ? ' (Unstable)' : ''}`).join(', ')}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Help: where to get API keys */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          How to get a free API key
        </Label>
        <div className="mt-3 space-y-3 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>
              <strong className="text-zinc-800 dark:text-zinc-200">Groq</strong> — free, no credit card, ~1,000 requests/day.
              Sign up at{" "}
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-zinc-700 dark:text-zinc-300">
                console.groq.com/keys
              </a>{" "}
              and copy a key (starts with <code className="font-mono text-xs">gsk_</code>).
            </li>
            <li>
              <strong className="text-zinc-800 dark:text-zinc-200">OpenRouter</strong> — one key for many models at{" "}
              <a href="https://openrouter.ai/workspaces/default/keys" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-zinc-700 dark:text-zinc-300">
                openrouter.ai/workspaces/default/keys
              </a>.
            </li>
            <li>
              <strong className="text-zinc-800 dark:text-zinc-200">Any free provider</strong> — browse{" "}
              <a href="https://freellm.net/providers/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 text-zinc-700 dark:text-zinc-300">
                freellm.net/providers
              </a>{" "}
              (NVIDIA NIM, Mistral, Cerebras, DeepInfra, SiliconFlow, …). Grab a key, then use the Custom Provider card below.
            </li>
          </ol>
          <p className="text-xs text-muted-foreground">
            Your keys are stored only in your browser and are never sent to our servers.
          </p>
        </div>
      </div>

      {/* Custom Provider Card */}
      <div className="p-5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-sm">
        <Label className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
          Custom AI Provider (OpenAI-compatible)
        </Label>
        <div className="mt-2 mb-4">
          <p className="text-sm text-muted-foreground">
            Add any free OpenAI-compatible provider — Groq, NVIDIA NIM, Mistral, Cerebras, DeepInfra, SiliconFlow and many more. Paste the endpoint, your API key, and one or more model IDs. The models will appear in the model selector above.
          </p>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Provider name (e.g. DeepInfra)"
            value={cpName}
            onChange={(e) => setCpName(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            placeholder="API endpoint URL (e.g. https://api.deepinfra.com/v1/openai)"
            value={cpBaseUrl}
            onChange={(e) => setCpBaseUrl(e.target.value)}
            className="h-9 text-sm font-mono"
          />
          <Input
            type="password"
            placeholder="Your API key"
            value={cpApiKey}
            onChange={(e) => setCpApiKey(e.target.value)}
            className="h-9 text-sm"
          />
          <Input
            placeholder="Model IDs, comma-separated (e.g. meta-llama/llama-3.3-70b-instruct)"
            value={cpModels}
            onChange={(e) => setCpModels(e.target.value)}
            className="h-9 text-sm font-mono"
          />
          <Button
            onClick={handleAddCustomProvider}
            disabled={cpSaving}
            className="w-full sm:w-auto bg-zinc-900 dark:bg-zinc-50 text-zinc-50 dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 h-9 px-4 text-sm transition-colors"
          >
            Add Provider
          </Button>
        </div>

        {customProviders.length > 0 && (
          <div className="mt-4 space-y-2">
            {customProviders.map(provider => (
              <div
                key={provider.id}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-start justify-between gap-2"
              >
                <div className="min-w-0">
                  <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{provider.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{provider.baseUrl}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 truncate">
                    {provider.models.map(m => m.label || m.id).join(', ')}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveCustomProvider(provider.id)}
                  className="h-7 px-2 text-zinc-400 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 shrink-0"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
