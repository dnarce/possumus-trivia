'use server'

import { redirect } from 'next/navigation'
import { fetchSession } from '@/lib/opentdb'

export async function startGame(formData: FormData) {
  const categoryId = formData.get('categoryId') as string
  const difficulty = formData.get('difficulty') as string

  const sessionId = await fetchSession()

  redirect(`/game/${sessionId}?categoryId=${categoryId}&difficulty=${difficulty}`)
}
