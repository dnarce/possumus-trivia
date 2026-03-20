import { fetchQuestions, resetSession } from '@/lib/opentdb'
import { mapQuestion } from '@/lib/mappers'
import { GameClient } from '@/components/game-client'
import { ErrorModal } from '@/components/error-modal'
import type { TriviaConfig } from '@/types/trivia'
import { TRIVIA_DEFAULTS } from '@/types/trivia'

interface GamePageProps {
  params: Promise<{ sessionId: string }>
  searchParams: Promise<{ categoryId?: string; difficulty?: string }>
}

const ERROR_MESSAGES: Partial<Record<number, { title: string; description: string }>> = {
  1: {
    title: 'Not enough questions',
    description: "There aren't enough questions available for this category and difficulty. Try a different combination.",
  },
  4: {
    title: 'Questions exhausted',
    description: "You've gone through all available questions for this combination. Try a different category or difficulty.",
  },
}

const GENERIC_ERROR = {
  title: 'Something went wrong',
  description: 'Could not load questions. Please try again.',
}

function ErrorPage({ code }: { code: number }) {
  const { title, description } = ERROR_MESSAGES[code] ?? GENERIC_ERROR
  return (
    <main className="flex h-dvh items-center justify-center">
      <ErrorModal title={title} description={description} />
    </main>
  )
}

export default async function GamePage({ params, searchParams }: GamePageProps) {
  const { sessionId } = await params
  const { categoryId, difficulty } = await searchParams
  const parsedCategoryId = Number(categoryId)

  if (!categoryId || !difficulty || Number.isNaN(parsedCategoryId)) {
    return <ErrorPage code={-1} />
  }

  const config: TriviaConfig = {
    ...TRIVIA_DEFAULTS,
    categoryId: parsedCategoryId,
    categoryName: '',
    difficulty: difficulty as TriviaConfig['difficulty'],
  }

  let raw

  try {
    raw = await fetchQuestions(sessionId, config)

    // Token exhausted — reset and retry once
    if (raw.response_code === 4) {
      await resetSession(sessionId)
      raw = await fetchQuestions(sessionId, config)
    }
  } catch {
    return <ErrorPage code={-1} />
  }

  if (raw.response_code !== 0) {
    return <ErrorPage code={raw.response_code} />
  }

  const questions = raw.results.map((q, i) => mapQuestion(q, i))

  return (
    <main className="flex h-dvh items-center justify-center">
      <div className="w-full max-w-4xl px-4 h-full">
        <GameClient questions={questions} sessionId={sessionId} categoryId={parsedCategoryId} difficulty={difficulty} />
      </div>
    </main>
  )
}
