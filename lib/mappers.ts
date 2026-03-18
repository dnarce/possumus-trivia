import he from 'he'
import type { OpenTDBCategoriesResponse, OpenTDBQuestion, Category, Question } from '@/types/trivia'

export function mapCategories(raw: OpenTDBCategoriesResponse): Category[] {
  return raw.trivia_categories
}

export function mapQuestion(raw: OpenTDBQuestion, index: number): Question {
  const options = [...raw.incorrect_answers, raw.correct_answer]
    .map((o) => he.decode(o))
    .sort(() => Math.random() - 0.5)

  return {
    index,
    text: he.decode(raw.question),
    options,
    correctAnswer: he.decode(raw.correct_answer),
  }
}
