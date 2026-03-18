import { fetchQuestions } from '@/lib/opentdb'
import { mapQuestion } from '@/lib/mappers'
import { GameClient } from '@/components/game-client'
import type { TriviaConfig } from '@/types/trivia'

interface GamePageProps {
  params: Promise<{ sessionId: string }>
  searchParams: Promise<{ categoryId: string; difficulty: string }>
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { sessionId } = await params
  const { categoryId, difficulty } = await searchParams

  const config: TriviaConfig = {
    categoryId: Number(categoryId),
    categoryName: '',
    difficulty: difficulty as TriviaConfig['difficulty'],
    amount: 5,
  }

  const raw = await fetchQuestions(sessionId, config)
  const questions = raw.results.map((q, i) => mapQuestion(q, i))

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg px-4">
        <GameClient questions={questions} sessionId={sessionId} />
      </div>
    </main>
  )
}
