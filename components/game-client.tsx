'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Question, PlayerAnswer } from '@/types/trivia'

const POINTS_PER_CORRECT = 20

interface GameClientProps {
  questions: Question[]
  sessionId: string
  categoryId: number
  difficulty: string
}

export function GameClient({ questions, sessionId, categoryId, difficulty }: GameClientProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [answers, setAnswers] = useState<PlayerAnswer[]>([])

  const currentQuestion = questions[currentIndex]
  const isAnswered = selectedOption !== null
  const isLastQuestion = currentIndex === questions.length - 1

  function handleSelect(option: string) {
    if (isAnswered) return
    setSelectedOption(option)
  }

  const handleNext = useCallback(() => {
    const answer: PlayerAnswer = {
      questionIndex: currentIndex,
      selectedOption: selectedOption!,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: selectedOption === currentQuestion.correctAnswer,
    }

    const updatedAnswers = [...answers, answer]
    setAnswers(updatedAnswers)

    if (isLastQuestion) {
      const score = updatedAnswers.filter((a) => a.isCorrect).length * POINTS_PER_CORRECT
      sessionStorage.setItem(`game-${sessionId}`, JSON.stringify({ answers: updatedAnswers, score }))
      router.push(`/game/${sessionId}/result?categoryId=${categoryId}&difficulty=${difficulty}`)
    } else {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
    }
  }, [answers, categoryId, currentIndex, currentQuestion, difficulty, isLastQuestion, router, selectedOption, sessionId])

  useEffect(() => {
    if (!isLastQuestion || selectedOption === null) return
    const timer = setTimeout(handleNext, 1000)
    return () => clearTimeout(timer)
  }, [isLastQuestion, selectedOption, handleNext])

  function getOptionVariant(option: string): 'outline' | 'default' | 'destructive' {
    if (!isAnswered) return 'outline'
    if (option === currentQuestion.correctAnswer) return 'default'
    if (option === selectedOption) return 'destructive'
    return 'outline'
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Question {currentIndex + 1} of {questions.length}
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg leading-snug">{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option) => (
            <Button
              key={option}
              variant={getOptionVariant(option)}
              className="w-full justify-start"
              onClick={() => handleSelect(option)}
            >
              {option}
            </Button>
          ))}
        </CardContent>
      </Card>

      {!isLastQuestion && (
        <Button className="w-full" disabled={!isAnswered} onClick={handleNext}>
          Next
        </Button>
      )}
    </div>
  )
}
