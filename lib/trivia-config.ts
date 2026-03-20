import type { TriviaConfig } from '@/types/trivia'

export const TRIVIA_DIFFICULTIES = ['easy', 'medium', 'hard'] as const

const TRIVIA_DIFFICULTY_SET = new Set<string>(TRIVIA_DIFFICULTIES)

interface NormalizedTriviaInput {
  categoryId: number
  categoryName: string
  difficulty: TriviaConfig['difficulty']
}

export function normalizeTriviaInput(
  categoryIdValue: FormDataEntryValue | string | null | undefined,
  categoryNameValue: FormDataEntryValue | string | null | undefined,
  difficultyValue: FormDataEntryValue | string | null | undefined,
): NormalizedTriviaInput | null {
  if (
    typeof categoryIdValue !== 'string'
    || typeof difficultyValue !== 'string'
    || typeof categoryNameValue !== 'string'
  ) {
    return null
  }

  const categoryId = Number(categoryIdValue)
  const categoryName = categoryNameValue.trim()

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    return null
  }

  if (!TRIVIA_DIFFICULTY_SET.has(difficultyValue)) {
    return null
  }

  if (!categoryName) {
    return null
  }

  return {
    categoryId,
    categoryName,
    difficulty: difficultyValue as TriviaConfig['difficulty'],
  }
}
