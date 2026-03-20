import { fetchQuestions, resetSession } from '@/lib/opentdb'
import { mapQuestion } from '@/lib/mappers'
import { GameClient } from '@/components/game-client'
import { ErrorModal } from '@/components/error-modal'
import type { TriviaConfig } from '@/types/trivia'
import { TRIVIA_DEFAULTS } from '@/types/trivia'
import { normalizeTriviaInput } from '@/lib/trivia-config'

interface GamePageProps {
  params: Promise<{ sessionId: string }>
  searchParams: Promise<{ categoryId?: string; difficulty?: string }>
}

const INVALID_CONFIG_ERROR = -2

const ERROR_MESSAGES: Partial<Record<number, { title: string; description: string }>> = {
  [INVALID_CONFIG_ERROR]: {
    title: 'Invalid game configuration',
    description: 'The selected category or difficulty is not valid. Please start a new game.',
  },
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
  const input = normalizeTriviaInput(categoryId, difficulty)

  if (!input) {
    return <ErrorPage code={INVALID_CONFIG_ERROR} />
  }

  const { categoryId: parsedCategoryId, difficulty: normalizedDifficulty } = input

  const config: TriviaConfig = {
    ...TRIVIA_DEFAULTS,
    categoryId: parsedCategoryId,
    categoryName: '',
    difficulty: normalizedDifficulty,
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
        <GameClient questions={questions} sessionId={sessionId} categoryId={parsedCategoryId} difficulty={normalizedDifficulty} />
      </div>
    </main>
  )
}
