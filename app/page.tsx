import { fetchCategories } from '@/lib/opentdb'
import { mapCategories } from '@/lib/mappers'
import { SetupForm } from '@/components/setup-form'
import { startGame } from '@/app/actions'

export default async function SetupPage() {
  const raw = await fetchCategories()
  const categories = mapCategories(raw)

  return (
    <main>
      <h1>Configurá tu partida</h1>
      <SetupForm categories={categories} action={startGame} />
    </main>
  )
}
