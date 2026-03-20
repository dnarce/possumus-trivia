import { describe, it, expect } from 'vitest'
import { mapCategories, mapQuestion } from '@/lib/mappers'
import type { OpenTDBCategoriesResponse, OpenTDBQuestion } from '@/types/trivia'

const mockRawQuestion: OpenTDBQuestion = {
  type: 'multiple',
  difficulty: 'easy',
  category: 'General Knowledge',
  question: 'What is 2 + 2?',
  correct_answer: '4',
  incorrect_answers: ['1', '2', '3'],
}

describe('mapCategories', () => {
  it('extracts the categories array from the response', () => {
    const raw: OpenTDBCategoriesResponse = {
      trivia_categories: [
        { id: 9, name: 'General Knowledge' },
        { id: 10, name: 'Entertainment: Books' },
      ],
    }
    const result = mapCategories(raw)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: 9, name: 'General Knowledge' })
  })
})

describe('mapQuestion', () => {
  it('assigns the index correctly', () => {
    const result = mapQuestion(mockRawQuestion, 2)
    expect(result.index).toBe(2)
  })

  it('decodes HTML entities in the question text', () => {
    const raw: OpenTDBQuestion = {
      ...mockRawQuestion,
      question: 'What is &amp; in HTML?',
      correct_answer: 'Ampersand (&)',
      incorrect_answers: ['Quote (&quot;)', 'Apostrophe (&#039;)', 'Less than (&lt;)'],
    }
    const result = mapQuestion(raw, 0)
    expect(result.text).toBe('What is & in HTML?')
    expect(result.correctAnswer).toBe('Ampersand (&)')
  })

  it('includes the correct answer among the options', () => {
    const result = mapQuestion(mockRawQuestion, 0)
    expect(result.options).toContain('4')
  })

  it('includes all incorrect answers among the options', () => {
    const result = mapQuestion(mockRawQuestion, 0)
    expect(result.options).toContain('1')
    expect(result.options).toContain('2')
    expect(result.options).toContain('3')
  })

  it('generates exactly 4 options in total', () => {
    const result = mapQuestion(mockRawQuestion, 0)
    expect(result.options).toHaveLength(4)
  })

  it('uses a Fisher-Yates shuffle with an injectable random source', () => {
    const randomValues = [0.75, 0.25, 0.5]
    const result = mapQuestion(mockRawQuestion, 0, () => randomValues.shift() ?? 0)

    expect(result.options).toEqual(['3', '2', '1', '4'])
  })
})
