import { describe, expect, it } from 'vitest'
import { normalizeTriviaInput } from '@/lib/trivia-config'

describe('normalizeTriviaInput', () => {
  it('returns normalized values for allowed category and difficulty', () => {
    expect(normalizeTriviaInput('9', 'easy')).toEqual({
      categoryId: 9,
      difficulty: 'easy',
    })
  })

  it('rejects categories outside the allowed domain', () => {
    expect(normalizeTriviaInput('999', 'easy')).toBeNull()
  })

  it('rejects invalid numeric values', () => {
    expect(normalizeTriviaInput('NaN', 'easy')).toBeNull()
  })

  it('rejects difficulties outside the allowed domain', () => {
    expect(normalizeTriviaInput('9', 'legendary')).toBeNull()
  })

  it('rejects non-string form values', () => {
    expect(normalizeTriviaInput(null, 'easy')).toBeNull()
  })
})
