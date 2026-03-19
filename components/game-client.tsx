'use client'

import { createElement, useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle } from 'lucide-react'
import { CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { Question, PlayerAnswer } from '@/types/trivia'
import { getCategoryIcon, getCategoryLabel } from '@/lib/category-icons'
import { GlassCard } from './ui/glass-card'

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
  const categoryLabel = getCategoryLabel(categoryId)
  const difficultyLabel = difficulty.charAt(0).toUpperCase() + difficulty.slice(1)
  const score =
    answers.filter((answer) => answer.isCorrect).length * POINTS_PER_CORRECT +
    (selectedOption === currentQuestion.correctAnswer ? POINTS_PER_CORRECT : 0)

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

  function getOptionVariant(option: string): 'default' | 'success' | 'destructive' {
    if (!isAnswered) return 'default'
    if (option === currentQuestion.correctAnswer) return 'success'
    if (option === selectedOption) return 'destructive'
    return 'default'
  }

  return (
    <div className="flex flex-col justify-between h-full py-16">
      <div className="grid gap-3 text-sm sm:grid-cols-[1fr_auto_1fr] sm:items-center">
        <div className="flex flex-wrap items-center gap-2 sm:justify-self-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm px-3 py-1.5 shadow-sm">
            {createElement(getCategoryIcon(categoryId), { className: 'size-4' })}
            <span>{categoryLabel}</span>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 backdrop-blur-sm px-3 py-1.5 shadow-sm">
            {difficultyLabel}
          </div>
        </div>

        <p className="text-center font-medium sm:justify-self-center">
          Question {currentIndex + 1}/{questions.length}
        </p>

        <p className="text-center font-medium sm:justify-self-end">
          Score {score} pts
        </p>
      </div>

      <h2 className="text-6xl text-shadow-lg font-bold tracking-tight text-center">{currentQuestion.text}</h2>

      <div className="px-8 py-12 space-y-3">
      {currentQuestion.options.map((option) => (
            <Button
              key={option}
              variant={getOptionVariant(option)}
              className="w-full justify-center gap-2"
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              size="lg"
            >
              {isAnswered && option === currentQuestion.correctAnswer ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isAnswered && option === selectedOption ? (
                <XCircle className="h-5 w-5" />
              ) : null}
              {option}
            </Button>
          ))}
      </div>

      {!isLastQuestion && (
        <Button className="w-full" variant="outline" disabled={!isAnswered} onClick={handleNext}>
          Next
        </Button>
      )}
    </div>
  )
}
