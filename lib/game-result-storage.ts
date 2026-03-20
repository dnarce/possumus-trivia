import type { PlayerAnswer, Question, TriviaConfig } from '@/types/trivia'

export interface StoredGameResult {
  answers: PlayerAnswer[]
  score: number
  questions: Question[]
  categoryId: number
  difficulty: TriviaConfig['difficulty']
}

const STORAGE_KEY_PREFIX = 'game-'

function getStorageKey(sessionId: string): string {
  return `${STORAGE_KEY_PREFIX}${sessionId}`
}

function getStorage(area: 'sessionStorage' | 'localStorage'): Storage | null {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window[area]
  } catch {
    return null
  }
}

function isStoredGameResult(value: unknown): value is StoredGameResult {
  return typeof value === 'object'
    && value !== null
    && Array.isArray((value as StoredGameResult).answers)
    && Array.isArray((value as StoredGameResult).questions)
    && typeof (value as StoredGameResult).score === 'number'
    && Number.isFinite((value as StoredGameResult).score)
    && Number.isInteger((value as StoredGameResult).categoryId)
    && typeof (value as StoredGameResult).difficulty === 'string'
}

export function deserializeGameResult(raw: string | null): StoredGameResult | null {
  if (!raw) {
    return null
  }

  try {
    const parsed = JSON.parse(raw)
    return isStoredGameResult(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function persistGameResult(sessionId: string, result: StoredGameResult): void {
  const key = getStorageKey(sessionId)
  const serialized = JSON.stringify(result)

  for (const area of ['sessionStorage', 'localStorage'] as const) {
    const storage = getStorage(area)

    try {
      storage?.setItem(key, serialized)
    } catch {
      // Ignore storage quota / privacy mode failures and keep the game flow working.
    }
  }
}

export function readGameResult(sessionId: string): StoredGameResult | null {
  const key = getStorageKey(sessionId)

  for (const area of ['sessionStorage', 'localStorage'] as const) {
    const storage = getStorage(area)
    const result = deserializeGameResult(storage?.getItem(key) ?? null)

    if (result) {
      return result
    }
  }

  return null
}

export function readGameResultSnapshot(sessionId: string): string | null {
  const key = getStorageKey(sessionId)

  for (const area of ['sessionStorage', 'localStorage'] as const) {
    const storage = getStorage(area)
    const raw = storage?.getItem(key) ?? null

    if (deserializeGameResult(raw)) {
      return raw
    }
  }

  return null
}

export function clearGameResult(sessionId: string): void {
  const key = getStorageKey(sessionId)

  for (const area of ['sessionStorage', 'localStorage'] as const) {
    const storage = getStorage(area)

    try {
      storage?.removeItem(key)
    } catch {
      // Ignore storage failures while cleaning stale state.
    }
  }
}
