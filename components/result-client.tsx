'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { PlayerAnswer } from '@/types/trivia'

interface GameResult {
  answers: PlayerAnswer[]
  score: number
}

interface ResultClientProps {
  sessionId: string
  categoryId: string
  difficulty: string
  restartAction: (formData: FormData) => void
}

export function ResultClient({ sessionId, categoryId, difficulty, restartAction }: ResultClientProps) {
  const router = useRouter()
  const [result, setResult] = useState<GameResult | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem(`game-${sessionId}`)
    if (stored) {
      setResult(JSON.parse(stored))
    } else {
      router.replace('/')
    }
  }, [sessionId, router])

  if (!result) return null

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <p className="text-5xl font-bold">{result.score} pts</p>
        <p className="text-muted-foreground">de {result.answers.length * 20} puntos posibles</p>
      </div>

      <div className="space-y-3">
        <form action={restartAction}>
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="difficulty" value={difficulty} />
          <Button type="submit" className="w-full">Reiniciar</Button>
        </form>
        <Button className="w-full" variant="outline" asChild>
          <Link href="/">Salir</Link>
        </Button>
      </div>
    </div>
  )
}
