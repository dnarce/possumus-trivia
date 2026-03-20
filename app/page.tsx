import { fetchCategories } from '@/lib/opentdb'
import { mapCategories } from '@/lib/mappers'
import { SetupForm } from '@/components/setup-form'
import { startGame } from '@/app/actions'

export default async function SetupPage() {
  const raw = await fetchCategories()
  const categories = mapCategories(raw)

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-3xl space-y-6 px-4">
        <h1 className="text-5xl text-shadow-lg font-bold tracking-tight text-center">Setup your game</h1>
        <SetupForm categories={categories} action={startGame} />
      </div>
    </main>
  )
}
