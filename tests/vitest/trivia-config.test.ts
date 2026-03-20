import { describe, expect, it } from 'vitest'
import { normalizeTriviaInput } from '@/lib/trivia-config'

describe('normalizeTriviaInput', () => {
  it('returns normalized values for allowed category and difficulty', () => {
    expect(normalizeTriviaInput('9', 'General Knowledge', 'easy')).toEqual({
      categoryId: 9,
      categoryName: 'General Knowledge',
      difficulty: 'easy',
    })
  })

  it('accepts categories outside the visual catalog when the id is valid', () => {
    expect(normalizeTriviaInput('999', 'New Category', 'easy')).toEqual({
      categoryId: 999,
      categoryName: 'New Category',
      difficulty: 'easy',
    })
  })

  it('rejects invalid numeric values', () => {
    expect(normalizeTriviaInput('NaN', 'General Knowledge', 'easy')).toBeNull()
  })

  it('rejects difficulties outside the allowed domain', () => {
    expect(normalizeTriviaInput('9', 'General Knowledge', 'legendary')).toBeNull()
  })

  it('rejects non-string form values', () => {
    expect(normalizeTriviaInput(null, 'General Knowledge', 'easy')).toBeNull()
  })

  it('rejects empty category names', () => {
    expect(normalizeTriviaInput('9', '   ', 'easy')).toBeNull()
  })
})
