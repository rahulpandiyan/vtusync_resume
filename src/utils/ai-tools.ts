import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { LanguageModelV1 } from 'ai';
import { 
  getModelById, 
  getProviderById,
  getDefaultModel,
  parseCustomModelId,
  resolveCustomProvider,
  type AIModel,
  type AIConfig,
  type CustomProvider
} from '@/lib/ai-models';

// Re-export types for backward compatibility
export type { ApiKey, AIConfig } from '@/lib/ai-models';

// Hidden/internal-only models that should not appear in the public selector
type HiddenModel = Pick<AIModel, 'id' | 'provider' | 'features' | 'availability'>;
const HIDDEN_MODELS: Record<string, HiddenModel> = {
  'openai/gpt-5-nano': {
    id: 'openai/gpt-5-nano',
    provider: 'openrouter',
    features: {
      isFree: true,
      isUnstable: false,
      maxTokens: 400000,
      supportsVision: false,
      supportsTools: true,
    },
    availability: {
      requiresApiKey: false,
      requiresPro: false,
    },
  },
};

/**
 * Groq is OpenAI API-compatible, so we reuse the OpenAI SDK with a custom baseURL.
 */
function createGroqClient(apiKey: string, modelId: string) {
  return createOpenAI({
    apiKey,
    baseURL: 'https://api.groq.com/openai/v1',
  })(modelId) as LanguageModelV1;
}

/**
 * Initializes an AI client based on the provided configuration.
 * Automatically resolves appropriate provider credentials and seamlessly
 * falls back to OpenRouter when individual provider environment keys are unconfigured.
 */
export function initializeAIClient(config?: AIConfig, isPro?: boolean, useThinking?: boolean) {
  void useThinking;

  // 1. User-registered custom OpenAI-compatible providers
  if (config?.model && config.model.startsWith('custom::')) {
    const parsed = parseCustomModelId(config.model);
    if (!parsed) {
      throw new Error('Invalid custom model id');
    }
    const customProvider = resolveCustomProvider(config.customProviders, parsed.providerId);
    if (!customProvider) {
      throw new Error(`Custom provider "${parsed.providerId}" not found. Configure it in Settings.`);
    }
    if (!customProvider.apiKey) {
      throw new Error(`No API key set for custom provider "${customProvider.name}".`);
    }
    return createOpenAI({
      apiKey: customProvider.apiKey,
      baseURL: customProvider.baseUrl,
    })(parsed.modelId) as LanguageModelV1;
  }

  // 2. Resolve target model and provider
  const requestedModel = config?.model || getDefaultModel(Boolean(isPro));
  const modelData = getModelById(requestedModel) ?? HIDDEN_MODELS[requestedModel];
  const resolvedModelId = modelData?.id ?? requestedModel;
  const provider = modelData ? getProviderById(modelData.provider) : undefined;

  const serverOpenRouterKey = process.env.OPENROUTER_API_KEY;
  const userProviderKey = config?.apiKeys?.find(k => k.service === (provider?.id || ''))?.key;
  const userOpenRouterKey = config?.apiKeys?.find(k => k.service === 'openrouter')?.key;
  const activeOpenRouterKey = userOpenRouterKey || serverOpenRouterKey;

  // 3. Pro user configuration
  if (isPro) {
    const envKey = provider ? process.env[provider.envKey] : undefined;
    const effectiveKey = envKey || userProviderKey;

    if (effectiveKey && provider) {
      switch (provider.id) {
        case 'anthropic':
          return createAnthropic({ apiKey: effectiveKey })(resolvedModelId) as LanguageModelV1;
        case 'openai':
          if (resolvedModelId.includes('/')) {
            if (activeOpenRouterKey) {
              return createOpenRouter({
                apiKey: activeOpenRouterKey,
                baseURL: 'https://openrouter.ai/api/v1',
                headers: {
                  'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
                  'X-Title': 'ResuSync'
                },
              })(resolvedModelId) as LanguageModelV1;
            }
          }
          return createOpenAI({
            apiKey: effectiveKey,
            compatibility: 'strict'
          })(resolvedModelId) as LanguageModelV1;
        case 'openrouter':
          return createOpenRouter({
            apiKey: effectiveKey,
            baseURL: 'https://openrouter.ai/api/v1',
            headers: {
              'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              'X-Title': 'ResuSync'
            }
          })(resolvedModelId) as LanguageModelV1;
        case 'groq':
          return createGroqClient(effectiveKey, resolvedModelId);
      }
    }

    // Pro fallback to OpenRouter
    if (activeOpenRouterKey) {
      const orModelId = resolvedModelId.includes('/') ? resolvedModelId : 'openrouter/free';
      return createOpenRouter({
        apiKey: activeOpenRouterKey,
        baseURL: 'https://openrouter.ai/api/v1',
        headers: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'ResuSync'
        }
      })(orModelId) as LanguageModelV1;
    }

    throw new Error(`${provider?.name || 'AI'} API key not configured. Please add your key in Settings.`);
  }

  // 4. Free user or unauthenticated
  if (modelData?.features.isFree || resolvedModelId.includes('/')) {
    if (provider?.id === 'groq') {
      const groqKey = userProviderKey || process.env.GROQ_API_KEY;
      if (groqKey) {
        return createGroqClient(groqKey, resolvedModelId);
      }
    }

    if (activeOpenRouterKey) {
      const orModelId = resolvedModelId.includes('/') ? resolvedModelId : 'openrouter/free';
      return createOpenRouter({
        apiKey: activeOpenRouterKey,
        baseURL: 'https://openrouter.ai/api/v1',
        headers: {
          'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
          'X-Title': 'ResuSync'
        }
      })(orModelId) as LanguageModelV1;
    }
  }

  // User provided custom key for provider
  if (userProviderKey && provider) {
    switch (provider.id) {
      case 'anthropic':
        return createAnthropic({ apiKey: userProviderKey })(resolvedModelId) as LanguageModelV1;
      case 'openai':
        return createOpenAI({ apiKey: userProviderKey, compatibility: 'strict' })(resolvedModelId) as LanguageModelV1;
      case 'openrouter':
        return createOpenRouter({
          apiKey: userProviderKey,
          baseURL: 'https://openrouter.ai/api/v1',
          headers: {
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
            'X-Title': 'ResuSync'
          }
        })(resolvedModelId) as LanguageModelV1;
      case 'groq':
        return createGroqClient(userProviderKey, resolvedModelId);
    }
  }

  // Universal fallback for free users when OpenRouter key is available
  if (serverOpenRouterKey) {
    return createOpenRouter({
      apiKey: serverOpenRouterKey,
      baseURL: 'https://openrouter.ai/api/v1',
      headers: {
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'ResuSync'
      }
    })('openrouter/free') as LanguageModelV1;
  }

  throw new Error(`${provider?.name || 'AI'} API key not found. Please set your API key in Settings.`);
}
