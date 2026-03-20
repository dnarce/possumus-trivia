'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { fetchSession } from '@/lib/opentdb'

const TOKEN_COOKIE = 'opentdb-token'
// Tokens expire after 6 hours of inactivity — match that lifetime
const TOKEN_MAX_AGE = 60 * 60 * 6

export async function startGame(formData: FormData) {
  const categoryId = formData.get('categoryId') as string
  const difficulty = formData.get('difficulty') as string

  const cookieStore = await cookies()
  let sessionId = cookieStore.get(TOKEN_COOKIE)?.value

  if (!sessionId) {
    sessionId = await fetchSession()
    cookieStore.set(TOKEN_COOKIE, sessionId, { maxAge: TOKEN_MAX_AGE, httpOnly: true })
  }

  redirect(`/game/${sessionId}?categoryId=${categoryId}&difficulty=${difficulty}`)
}
