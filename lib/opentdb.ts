import type { OpenTDBCategoriesResponse, OpenTDBQuestionsResponse, TriviaConfig } from '@/types/trivia'

const BASE_URL = process.env.OPENTDB_BASE_URL ?? 'https://opentdb.com'

interface OpenTDBTokenResponse {
  response_code: number
  token: string
}

export async function fetchSession(): Promise<string> {
  const res = await fetch(`${BASE_URL}/api_token.php?command=request`)
  const data: OpenTDBTokenResponse = await res.json()
  return data.token
}

export async function fetchCategories(): Promise<OpenTDBCategoriesResponse> {
  const res = await fetch(`${BASE_URL}/api_category.php`)
  return res.json()
}

export async function fetchQuestions(sessionId: string, config: TriviaConfig): Promise<OpenTDBQuestionsResponse> {
  const params = new URLSearchParams({
    amount: String(config.amount),
    category: String(config.categoryId),
    difficulty: config.difficulty,
    token: sessionId,
  })
  const res = await fetch(`${BASE_URL}/api.php?${params}`)
  return res.json()
}
