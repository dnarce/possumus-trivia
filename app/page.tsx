import { fetchCategories } from '@/lib/opentdb'
import { mapCategories } from '@/lib/mappers'
import { SetupForm } from '@/components/setup-form'
import { startGame } from '@/app/actions'
import { ErrorModal } from '@/components/error-modal'

interface SetupPageProps {
  searchParams?: Promise<{ error?: string }>
}

const SETUP_ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  config: {
    title: 'Invalid game configuration',
    description: 'The selected category or difficulty is not valid. Please choose them again.',
  },
  session: {
    title: 'Could not start the game',
    description: 'Could not create a trivia session. Please try again.',
  },
}

function SetupErrorPage({ title, description }: { title: string; description: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <ErrorModal title={title} description={description} />
    </main>
  )
}

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const { error } = searchParams ? await searchParams : {}

  let categories

  try {
    const raw = await fetchCategories()
    categories = mapCategories(raw)
  } catch {
    return (
      <SetupErrorPage
        title="Could not load categories"
        description="Could not load trivia categories. Please try again."
      />
    )
  }

  const setupError = error ? SETUP_ERROR_MESSAGES[error] : null

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-3xl space-y-6 px-4">
        {setupError ? <ErrorModal title={setupError.title} description={setupError.description} /> : null}
        <h1 className="text-5xl text-shadow-lg font-bold tracking-tight text-center">Setup your game</h1>
        <SetupForm categories={categories} action={startGame} />
      </div>
    </main>
  )
}
