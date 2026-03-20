import type { OpenTDBCategoriesResponse, OpenTDBQuestionsResponse, TriviaConfig } from '@/types/trivia'
import { TRIVIA_DEFAULTS } from '@/types/trivia'

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

export async function resetSession(token: string): Promise<void> {
  await fetch(`${BASE_URL}/api_token.php?command=reset&token=${token}`)
}

export async function fetchQuestions(sessionId: string, config: TriviaConfig): Promise<OpenTDBQuestionsResponse> {
  const { amount = TRIVIA_DEFAULTS.amount, type = TRIVIA_DEFAULTS.type } = config
  const params = new URLSearchParams({
    amount: String(amount),
    category: String(config.categoryId),
    difficulty: config.difficulty,
    type,
    token: sessionId,
  })
  const res = await fetch(`${BASE_URL}/api.php?${params}`)
  return res.json()
}
