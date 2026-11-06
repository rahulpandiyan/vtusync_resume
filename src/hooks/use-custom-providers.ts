'use client'

import { useSyncExternalStore, useCallback } from 'react'
import type { CustomProvider } from '@/lib/ai-models'

// Storage key for user-registered OpenAI-compatible providers
const CUSTOM_PROVIDERS_STORAGE_KEY = 'resusync-custom-providers'

// Listener set for the store
const customProvidersListeners = new Set<() => void>()

const EMPTY_CUSTOM_PROVIDERS: CustomProvider[] = []

let currentCustomProviders: CustomProvider[] = EMPTY_CUSTOM_PROVIDERS
let hasInitializedStore = false
let hasAttachedStorageListener = false

function emitCustomProvidersChange() {
  customProvidersListeners.forEach(listener => listener())
}

function ensureClientStoreInitialized() {
  if (typeof window === 'undefined') return

  if (!hasInitializedStore) {
    currentCustomProviders = readStoredCustomProviders()
    hasInitializedStore = true
  }

  if (!hasAttachedStorageListener) {
    window.addEventListener('storage', handleStorageChange)
    hasAttachedStorageListener = true
  }
}

function handleStorageChange(event: StorageEvent) {
  if (event.key === CUSTOM_PROVIDERS_STORAGE_KEY) {
    const next = readStoredCustomProviders()
    if (!areCustomProvidersEqual(currentCustomProviders, next)) {
      currentCustomProviders = next
      emitCustomProvidersChange()
    }
  }
}

function cloneProvider(provider: CustomProvider): CustomProvider {
  return {
    id: provider.id,
    name: provider.name,
    baseUrl: provider.baseUrl,
    apiKey: provider.apiKey,
    models: provider.models.map(m => ({ id: m.id, label: m.label })),
  }
}

function isValidCustomProvider(value: unknown): value is CustomProvider {
  if (!value || typeof value !== 'object') return false
  const c = value as Record<string, unknown>
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.baseUrl === 'string' &&
    typeof c.apiKey === 'string' &&
    Array.isArray(c.models) &&
    (c.models as unknown[]).every(m => {
      const mm = m as Record<string, unknown>
      return !!mm && typeof mm.id === 'string'
    })
  )
}

function normalizeProviders(providers: CustomProvider[]): CustomProvider[] {
  return providers.filter(isValidCustomProvider).map(cloneProvider)
}

function areCustomProvidersEqual(a: CustomProvider[], b: CustomProvider[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false
  return a.every((p, i) =>
    p.id === b[i].id &&
    p.name === b[i].name &&
    p.baseUrl === b[i].baseUrl &&
    p.apiKey === b[i].apiKey &&
    p.models.length === b[i].models.length &&
    p.models.every((m, j) => m.id === b[i].models[j].id && m.label === b[i].models[j].label)
  )
}

export function readStoredCustomProviders(): CustomProvider[] {
  if (typeof window === 'undefined') return EMPTY_CUSTOM_PROVIDERS
  try {
    const raw = localStorage.getItem(CUSTOM_PROVIDERS_STORAGE_KEY)
    if (!raw) return EMPTY_CUSTOM_PROVIDERS
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return EMPTY_CUSTOM_PROVIDERS
    return normalizeProviders(parsed)
  } catch {
    return EMPTY_CUSTOM_PROVIDERS
  }
}

function subscribeCustomProviders(listener: () => void) {
  ensureClientStoreInitialized()
  customProvidersListeners.add(listener)
  return () => {
    customProvidersListeners.delete(listener)
  }
}

function getCustomProvidersSnapshot(): CustomProvider[] {
  if (typeof window === 'undefined') return EMPTY_CUSTOM_PROVIDERS
  ensureClientStoreInitialized()
  return currentCustomProviders
}

function getServerCustomProvidersSnapshot(): CustomProvider[] {
  return EMPTY_CUSTOM_PROVIDERS
}

export function useCustomProviders() {
  const customProviders = useSyncExternalStore(
    subscribeCustomProviders,
    getCustomProvidersSnapshot,
    getServerCustomProvidersSnapshot
  )

  const setCustomProviders = useCallback(
    (updater: CustomProvider[] | ((prev: CustomProvider[]) => CustomProvider[])) => {
      ensureClientStoreInitialized()

      const current = currentCustomProviders
      const nextValue =
        typeof updater === 'function' ? updater(current) : updater
      const normalized = Array.isArray(nextValue)
        ? normalizeProviders(nextValue)
        : EMPTY_CUSTOM_PROVIDERS

      if (areCustomProvidersEqual(current, normalized)) return

      currentCustomProviders = normalized

      if (typeof window !== 'undefined') {
        localStorage.setItem(
          CUSTOM_PROVIDERS_STORAGE_KEY,
          JSON.stringify(currentCustomProviders)
        )
      }

      emitCustomProvidersChange()
    },
    []
  )

  return { customProviders, setCustomProviders }
}

export { CUSTOM_PROVIDERS_STORAGE_KEY }
