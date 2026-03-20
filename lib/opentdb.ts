import type { OpenTDBCategoriesResponse, OpenTDBQuestionsResponse, TriviaConfig } from '@/types/trivia'
import { TRIVIA_DEFAULTS } from '@/types/trivia'

const BASE_URL = process.env.OPENTDB_BASE_URL ?? 'https://opentdb.com'
const SUCCESS_RESPONSE_CODE = 0

interface OpenTDBTokenResponse {
  response_code: number
  token: string
}

export class OpenTDBError extends Error {
  code?: number

  constructor(message: string, options?: { code?: number; cause?: unknown }) {
    super(message)
    this.name = 'OpenTDBError'
    this.code = options?.code
    this.cause = options?.cause
  }
}

async function requestJSON<T>(url: string): Promise<T> {
  let res: Response

  try {
    res = await fetch(url)
  } catch (error) {
    throw new OpenTDBError('Could not reach OpenTDB.', { cause: error })
  }

  if (!res.ok) {
    throw new OpenTDBError(`OpenTDB request failed with status ${res.status}.`)
  }

  try {
    return await res.json()
  } catch (error) {
    throw new OpenTDBError('OpenTDB returned an invalid payload.', { cause: error })
  }
}

function isTokenResponse(data: unknown): data is OpenTDBTokenResponse {
  return typeof data === 'object'
    && data !== null
    && typeof (data as OpenTDBTokenResponse).response_code === 'number'
    && typeof (data as OpenTDBTokenResponse).token === 'string'
}

function isCategoriesResponse(data: unknown): data is OpenTDBCategoriesResponse {
  return typeof data === 'object'
    && data !== null
    && Array.isArray((data as OpenTDBCategoriesResponse).trivia_categories)
}

function isQuestionsResponse(data: unknown): data is OpenTDBQuestionsResponse {
  return typeof data === 'object'
    && data !== null
    && typeof (data as OpenTDBQuestionsResponse).response_code === 'number'
    && Array.isArray((data as OpenTDBQuestionsResponse).results)
}

export async function fetchSession(): Promise<string> {
  const data = await requestJSON<unknown>(`${BASE_URL}/api_token.php?command=request`)

  if (!isTokenResponse(data)) {
    throw new OpenTDBError('OpenTDB returned an invalid session payload.')
  }

  if (data.response_code !== SUCCESS_RESPONSE_CODE || !data.token) {
    throw new OpenTDBError('Could not start a trivia session.', { code: data.response_code })
  }

  return data.token
}

export async function fetchCategories(): Promise<OpenTDBCategoriesResponse> {
  const data = await requestJSON<unknown>(`${BASE_URL}/api_category.php`)

  if (!isCategoriesResponse(data)) {
    throw new OpenTDBError('OpenTDB returned an invalid categories payload.')
  }

  return data
}

export async function resetSession(token: string): Promise<void> {
  const data = await requestJSON<unknown>(`${BASE_URL}/api_token.php?command=reset&token=${token}`)

  if (!isTokenResponse(data)) {
    throw new OpenTDBError('OpenTDB returned an invalid session reset payload.')
  }

  if (data.response_code !== SUCCESS_RESPONSE_CODE) {
    throw new OpenTDBError('Could not reset the trivia session.', { code: data.response_code })
  }
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
  const data = await requestJSON<unknown>(`${BASE_URL}/api.php?${params}`)

  if (!isQuestionsResponse(data)) {
    throw new OpenTDBError('OpenTDB returned an invalid questions payload.')
  }

  return data
}
