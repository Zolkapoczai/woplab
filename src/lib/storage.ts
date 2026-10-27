import type { PersistedState } from "./types"

export const STORAGE_KEY = "wol-state-v1"

export const emptyState = (): PersistedState => ({ version: 1 })

export function loadState(): PersistedState {
  if (typeof window === "undefined") return emptyState()
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw) as PersistedState
    if (!parsed || parsed.version !== 1) return emptyState()
    return parsed
  } catch {
    return emptyState()
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
