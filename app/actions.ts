'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchSession } from '@/lib/opentdb'
import { normalizeTriviaInput } from '@/lib/trivia-config'

const TOKEN_COOKIE = 'opentdb-token'
// Tokens expire after 6 hours of inactivity — match that lifetime
const TOKEN_MAX_AGE = 60 * 60 * 6

export async function startGame(formData: FormData) {
  const input = normalizeTriviaInput(formData.get('categoryId'), formData.get('difficulty'))

  if (!input) {
    redirect('/?error=config')
  }

  const { categoryId, difficulty } = input

  const cookieStore = await cookies()
  let sessionId = cookieStore.get(TOKEN_COOKIE)?.value

  if (!sessionId) {
    try {
      sessionId = await fetchSession()
    } catch {
      redirect('/?error=session')
    }

    cookieStore.set(TOKEN_COOKIE, sessionId, { maxAge: TOKEN_MAX_AGE, httpOnly: true })
  }

  redirect(`/game/${sessionId}?categoryId=${categoryId}&difficulty=${difficulty}`)
}
