import he from 'he'
import type { OpenTDBCategoriesResponse, OpenTDBQuestion, Category, Question } from '@/types/trivia'

export function mapCategories(raw: OpenTDBCategoriesResponse): Category[] {
  return raw.trivia_categories
}

function shuffleOptions<T>(items: T[], random: () => number): T[] {
  const shuffled = [...items]

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled
}

export function mapQuestion(raw: OpenTDBQuestion, index: number, random: () => number = Math.random): Question {
  const options = shuffleOptions(
    [...raw.incorrect_answers, raw.correct_answer].map((option) => he.decode(option)),
    random,
  )

  return {
    index,
    text: he.decode(raw.question),
    options,
    correctAnswer: he.decode(raw.correct_answer),
  }
}
