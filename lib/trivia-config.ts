import { TRIVIA_CATEGORY_IDS } from '@/lib/category-icons'
import type { TriviaConfig } from '@/types/trivia'

export const TRIVIA_DIFFICULTIES = ['easy', 'medium', 'hard'] as const

const TRIVIA_CATEGORY_ID_SET = new Set<number>(TRIVIA_CATEGORY_IDS)
const TRIVIA_DIFFICULTY_SET = new Set<string>(TRIVIA_DIFFICULTIES)

interface NormalizedTriviaInput {
  categoryId: number
  difficulty: TriviaConfig['difficulty']
}

export function normalizeTriviaInput(
  categoryIdValue: FormDataEntryValue | string | null | undefined,
  difficultyValue: FormDataEntryValue | string | null | undefined,
): NormalizedTriviaInput | null {
  if (typeof categoryIdValue !== 'string' || typeof difficultyValue !== 'string') {
    return null
  }

  const categoryId = Number(categoryIdValue)

  if (!Number.isInteger(categoryId) || !TRIVIA_CATEGORY_ID_SET.has(categoryId)) {
    return null
  }

  if (!TRIVIA_DIFFICULTY_SET.has(difficultyValue)) {
    return null
  }

  return {
    categoryId,
    difficulty: difficultyValue as TriviaConfig['difficulty'],
  }
}
