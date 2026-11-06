/**
 * Centralized AI Model Management
 * This file contains all AI model and provider configurations used throughout the application
 */

import { ServiceName } from './types'

// ========================
// Type Definitions
// ========================

export interface AIProvider {
  id: ServiceName
  name: string
  apiLink: string
  logo?: string
  envKey: string
  sdkInitializer: string
  unstable?: boolean
}

export interface AIModel {
  id: string
  name: string
  provider: ServiceName
  features: {
    isFree?: boolean
    isRecommended?: boolean
    isUnstable?: boolean
    maxTokens?: number
    supportsVision?: boolean
    supportsTools?: boolean
    isPro?: boolean
  }
  availability: {
    requiresApiKey: boolean
    requiresPro: boolean
  }
}

export interface ApiKey {
  service: ServiceName
  key: string
  addedAt: string
}

/**
 * A user-supplied OpenAI-compatible provider (e.g. from freellm.net).
 * Any provider that exposes an OpenAI-style /chat/completions endpoint works.
 */
export interface CustomModel {
  /** The model id as the provider expects it, e.g. "meta-llama/llama-3.3-70b-instruct" */
  id: string
  /** Optional friendly label; defaults to the id */
  label?: string
}

export interface CustomProvider {
  /** Unique local slug, e.g. "dp_01hx..." */
  id: string
  /** Display name, e.g. "DeepInfra" */
  name: string
  /** Base URL of the OpenAI-compatible endpoint, e.g. "https://api.deepinfra.com/v1/openai" */
  baseUrl: string
  apiKey: string
  models: CustomModel[]
}

export interface AIConfig {
  model: string
  apiKeys: ApiKey[]
  customPrompts?: import('./types').CustomPrompts
  /** User-registered OpenAI-compatible providers */
  customProviders?: CustomProvider[]
}

// Composite id used to select a custom model in the UI / persist as default.
// Format: custom::{providerId}::{modelId}
export const CUSTOM_MODEL_PREFIX = 'custom::'

export interface GroupedModels {
  provider: ServiceName
  name: string
  models: AIModel[]
}

// ========================
// Provider Configurations
// ========================

export const PROVIDERS: Partial<Record<ServiceName, AIProvider>> = {
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic',
    apiLink: 'https://console.anthropic.com/',
    logo: '/logos/claude.png',
    envKey: 'ANTHROPIC_API_KEY',
    sdkInitializer: 'anthropic',
    unstable: false
  },
  openai: {
    id: 'openai',
    name: 'OpenAI',
    apiLink: 'https://platform.openai.com/api-keys',
    logo: '/logos/chat-gpt-logo.png',
    envKey: 'OPENAI_API_KEY',
    sdkInitializer: 'openai',
    unstable: false
  },
  openrouter: {
    id: 'openrouter',
    name: 'OpenRouter',
    apiLink: 'https://openrouter.ai/workspaces/default/keys',
    logo: '/logos/gemini-logo.webp',
    envKey: 'OPENROUTER_API_KEY',
    sdkInitializer: 'openrouter',
    unstable: false
    
  },
  groq: {
    id: 'groq',
    name: 'Groq',
    apiLink: 'https://console.groq.com/keys',
    logo: '/logos/llama-logo.png',
    envKey: 'GROQ_API_KEY',
    sdkInitializer: 'groq',
    unstable: false
  },
}

// ========================
// Model Definitions
// ========================

export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: 'gpt-5.2',
    name: 'GPT-5.2',
    provider: 'openai',
    features: {
      isRecommended: true,
      isUnstable: false,
      maxTokens: 400000,
      supportsVision: true,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  {
    id: 'gpt-5.2-pro',
    name: 'GPT-5.2 Pro',
    provider: 'openai',
    features: {
      isRecommended: false,
      isUnstable: false,
      maxTokens: 400000,
      supportsVision: true,
      supportsTools: true,
      isPro: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: true
    }
  },
  {
    id: 'gpt-5.1-chat',
    name: 'GPT-5.1',
    provider: 'openai',
    features: {
      isRecommended: false,
      isUnstable: false,
      maxTokens: 128000,
      supportsVision: true,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  {
    id: 'gpt-5-mini-2025-08-07',
    name: 'GPT-5 Mini',
    provider: 'openai',
    features: {
      isRecommended: false,
      isUnstable: false,
      maxTokens: 128000,
      supportsVision: true,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  // OpenRouter Free Models
  {
    id: 'openrouter/free',
    name: 'OpenRouter Free AI',
    provider: 'openrouter',
    features: {
      isFree: true,
      isRecommended: true,
      isUnstable: false,
      maxTokens: 131072,
      supportsVision: true,
      supportsTools: true
    },
    availability: {
      requiresApiKey: false,
      requiresPro: false
    }
  },
  {
    id: 'nvidia/nemotron-3-ultra-550b-a55b:free',
    name: 'Nemotron 3 Ultra (Free)',
    provider: 'openrouter',
    features: {
      isFree: true,
      isRecommended: true,
      isUnstable: false,
      maxTokens: 65536,
      supportsVision: false,
      supportsTools: true
    },
    availability: {
      requiresApiKey: false,
      requiresPro: false
    }
  },

  // Groq Models (free tier: ~1000 requests/day, no credit card required)
  {
    id: 'openai/gpt-oss-120b',
    name: 'GPT-OSS 120B (Groq Free)',
    provider: 'groq',
    features: {
      isFree: true,
      isRecommended: true,
      isUnstable: false,
      maxTokens: 131072,
      supportsVision: false,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  {
    id: 'openai/gpt-oss-20b',
    name: 'GPT-OSS 20B (Groq Free)',
    provider: 'groq',
    features: {
      isFree: true,
      isRecommended: false,
      isUnstable: false,
      maxTokens: 131072,
      supportsVision: false,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  {
    id: 'qwen/qwen3.8-27b',
    name: 'Qwen3.8 27B (Groq Free)',
    provider: 'groq',
    features: {
      isFree: true,
      isRecommended: false,
      isUnstable: false,
      maxTokens: 131072,
      supportsVision: false,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },

  // Anthropic Models
  {
    id: 'claude-sonnet-4-20250514',
    name: 'Claude Sonnet 4',
    provider: 'anthropic',
    features: {
      isRecommended: false,
      isUnstable: false,
      maxTokens: 200000,
      supportsVision: true,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  {
    id: 'claude-sonnet-4-5-20250929',
    name: 'Claude Sonnet 4.5',
    provider: 'anthropic',
    features: {
      isRecommended: false,
      isUnstable: false,
      maxTokens: 200000,
      supportsVision: true,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku 4.5',
    provider: 'anthropic',
    features: {
      isRecommended: false,
      isUnstable: false,
      maxTokens: 200000,
      supportsVision: true,
      supportsTools: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: false
    }
  },
  {
    id: 'claude-opus-4-5-20251101',
    name: 'Claude Opus 4.5',
    provider: 'anthropic',
    features: {
      isRecommended: true,
      isUnstable: false,
      maxTokens: 200000,
      supportsVision: true,
      supportsTools: true,
      isPro: true
    },
    availability: {
      requiresApiKey: true,
      requiresPro: true
    }
  },

]

// ========================
// Legacy ID Aliases
// ========================

// Map legacy or shorthand model IDs to current canonical IDs
const MODEL_ALIASES: Record<string, string> = {
  // Old shorthand → Current Anthropic Sonnet 4 (dated ID)
  'claude-4-sonnet': 'claude-sonnet-4-20250514',
  // Older legacy model not present anymore → best current equivalent
  'claude-3-sonnet-20240229': 'claude-sonnet-4-20250514',
  // Shorthand for Claude Sonnet 4.5
  'claude-sonnet-4.5': 'claude-sonnet-4-5-20250929',
  // Shorthand for Claude Opus 4.5
  'claude-opus-4.5': 'claude-opus-4-5-20251101',
  // GPT-5.2 snapshot aliases
  'gpt-5.2-2025-12-11': 'gpt-5.2',
  'gpt-5.2-pro-2025-12-11': 'gpt-5.2-pro',
  // Legacy GPT-5 reference → latest GPT-5.2
  'gpt-5': 'openrouter/free',
  'gpt-5.2': 'openrouter/free',
  'gpt-5.2-pro': 'openrouter/free',
  // Legacy DeepSeek shorthand → Groq-free GPT-OSS 120B
  'deepseek/deepseek-v3.2': 'openai/gpt-oss-120b',
  // Legacy Gemini 3 shorthand → Groq-free GPT-OSS 120B
  'gemini-3-pro-preview': 'openai/gpt-oss-120b',
}

// ========================
// Default Model Configuration
// ========================

export const DEFAULT_MODELS = {
  PRO_USER: 'openrouter/free',
  FREE_USER: 'openrouter/free'
} as const

// ========================
// Model Designations for Different Use Cases
// ========================

/**
 * Designated models for specific use cases throughout the application.
 * Change these to update which models are used globally.
 */
export const MODEL_DESIGNATIONS = {
  // Fast & cheap model for parsing, simple tasks, quick analysis
  FAST_CHEAP: 'claude-sonnet-4-5-20250929',
  // Alternative fast & cheap option (free for all users via Groq)
  FAST_CHEAP_FREE: 'openai/gpt-oss-120b',
  // Frontier model for complex tasks, deep analysis, best quality
  FRONTIER: 'gpt-5.2',
  // Alternative frontier model
  FRONTIER_ALT: 'claude-opus-4-5-20251101',
  // Balanced model - good quality but faster/cheaper than frontier (free via Groq)
  BALANCED: 'openai/gpt-oss-120b',
  // Vision-capable model for image analysis
  VISION: 'claude-sonnet-4-5-20250929',
  // Default models by user type
  DEFAULT_PRO: 'openrouter/free',
  DEFAULT_FREE: 'openrouter/free'
} as const

// Type for model designations
export type ModelDesignation = keyof typeof MODEL_DESIGNATIONS

// ========================
// Utility Functions
// ========================

/**
 * Get all providers as an array
 */
export function getProvidersArray(): AIProvider[] {
  return Object.values(PROVIDERS)
}

/**
 * Get a model by its ID
 */
export function getModelById(id: string): AIModel | undefined {
  const resolvedId = MODEL_ALIASES[id] || id
  return AI_MODELS.find(model => model.id === resolvedId)
}

/**
 * Get a provider by its ID
 */
export function getProviderById(id: ServiceName): AIProvider | undefined {
  return PROVIDERS[id]
}

/**
 * Get all models for a specific provider
 */
export function getModelsByProvider(provider: ServiceName): AIModel[] {
  return AI_MODELS.filter(model => model.provider === provider)
}

/**
 * Check if a model is available for a user
 */
export function isModelAvailable(
  modelId: string,
  isPro: boolean,
  apiKeys: ApiKey[]
): boolean {
  modelId = MODEL_ALIASES[modelId] || modelId
  // Pro users have access to all models
  if (isPro) return true

  const model = getModelById(modelId)
  if (!model) return false

  // Free model allowance — if a free model requires the user's own key,
  // the user must have added it (e.g. Groq free models).
  if (model.features.isFree) {
    if (model.availability.requiresApiKey) {
      return apiKeys.some(key => key.service === model.provider)
    }
    return true
  }

  // Check if this is an OpenRouter model (contains forward slash)
  if (modelId.includes('/')) {
    return apiKeys.some(key => key.service === 'openrouter')
  }

  // Check if user has the required API key
  return apiKeys.some(key => key.service === model.provider)
}

/**
 * Split a composite custom-model id (`custom::{providerId}::{modelId}`)
 * into its parts. Returns null if the id is not a custom model.
 */
export function parseCustomModelId(
  compositeId: string
): { providerId: string; modelId: string } | null {
  if (!compositeId.startsWith(CUSTOM_MODEL_PREFIX)) return null
  const rest = compositeId.slice(CUSTOM_MODEL_PREFIX.length)
  const sep = rest.indexOf('::')
  if (sep <= 0 || sep === rest.length - 2) return null
  return { providerId: rest.slice(0, sep), modelId: rest.slice(sep + 2) }
}

export function buildCustomModelCompositeId(providerId: string, modelId: string): string {
  return `${CUSTOM_MODEL_PREFIX}${providerId}::${modelId}`
}

export function resolveCustomProvider(
  customProviders: CustomProvider[] | undefined,
  providerId: string
): CustomProvider | undefined {
  return customProviders?.find(p => p.id === providerId)
}

/**
 * Get the default model for a user type
 */
export function getDefaultModel(isPro: boolean): string {
  return isPro ? DEFAULT_MODELS.PRO_USER : DEFAULT_MODELS.FREE_USER
}

/**
 * Get the provider for a model
 */
export function getModelProvider(modelId: string): AIProvider | undefined {
  const model = getModelById(modelId)
  if (!model) return undefined
  return getProviderById(model.provider)
}

/**
 * Group models by provider for display
 */
export function groupModelsByProvider(): GroupedModels[] {
  const providerOrder: ServiceName[] = ['anthropic', 'openai', 'openrouter', 'groq']
  const grouped = new Map<ServiceName, AIModel[]>()

  // Group models by provider
  AI_MODELS.forEach(model => {
    if (!grouped.has(model.provider)) {
      grouped.set(model.provider, [])
    }
    grouped.get(model.provider)!.push(model)
  })

  // Return in ordered format
  return providerOrder
    .map(providerId => {
      const provider = getProviderById(providerId)
      if (!provider) return null
      
      return {
        provider: providerId,
        name: provider.name,
        models: grouped.get(providerId) || []
      }
    })
    .filter((group): group is GroupedModels => group !== null && group.models.length > 0)
}

/**
 * Get selectable models for a user
 */
export function getSelectableModels(isPro: boolean, apiKeys: ApiKey[]): AIModel[] {
  return AI_MODELS.filter(model => isModelAvailable(model.id, isPro, apiKeys))
}

/**
 * Determine which SDK to use for a model
 */
export function getModelSDKConfig(modelId: string): { provider: AIProvider; modelId: string } | undefined {
  const model = getModelById(modelId)
  if (!model) return undefined
  
  const provider = getProviderById(model.provider)
  if (!provider) return undefined
  
  return { provider, modelId }
}
