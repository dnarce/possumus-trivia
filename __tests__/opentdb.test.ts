import { describe, it, expect, vi, beforeEach } from 'vitest'
import { fetchSession, fetchCategories, fetchQuestions } from '@/lib/opentdb'
import type { TriviaConfig } from '@/types/trivia'

const mockConfig: TriviaConfig = {
  categoryId: 9,
  categoryName: 'General Knowledge',
  difficulty: 'medium',
  amount: 5,
}

function mockFetch(data: unknown) {
  return vi.fn().mockResolvedValue({
    json: () => Promise.resolve(data),
  })
}

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('fetchSession', () => {
  it('returns the token from the response', async () => {
    global.fetch = mockFetch({ response_code: 0, token: 'abc123' })

    const token = await fetchSession()

    expect(token).toBe('abc123')
  })

  it('calls the correct endpoint', async () => {
    global.fetch = mockFetch({ response_code: 0, token: 'abc123' })

    await fetchSession()

    expect(global.fetch).toHaveBeenCalledWith(
      'https://opentdb.com/api_token.php?command=request'
    )
  })
})

describe('fetchCategories', () => {
  it('calls the correct endpoint', async () => {
    global.fetch = mockFetch({ trivia_categories: [] })

    await fetchCategories()

    expect(global.fetch).toHaveBeenCalledWith('https://opentdb.com/api_category.php')
  })

  it('returns the API response', async () => {
    const mockResponse = {
      trivia_categories: [{ id: 9, name: 'General Knowledge' }],
    }
    global.fetch = mockFetch(mockResponse)

    const result = await fetchCategories()

    expect(result.trivia_categories).toHaveLength(1)
    expect(result.trivia_categories[0].id).toBe(9)
  })
})

describe('fetchQuestions', () => {
  it('includes token, category, difficulty and amount in the URL', async () => {
    global.fetch = mockFetch({ response_code: 0, results: [] })

    await fetchQuestions('token-xyz', mockConfig)

    const calledUrl = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(calledUrl).toContain('token=token-xyz')
    expect(calledUrl).toContain('category=9')
    expect(calledUrl).toContain('difficulty=medium')
    expect(calledUrl).toContain('amount=5')
  })

  it('returns the API response', async () => {
    const mockResponse = { response_code: 0, results: [{ question: 'Q1' }] }
    global.fetch = mockFetch(mockResponse)

    const result = await fetchQuestions('token-xyz', mockConfig)

    expect(result.response_code).toBe(0)
    expect(result.results).toHaveLength(1)
  })
})
