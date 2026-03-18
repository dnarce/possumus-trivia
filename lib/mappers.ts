import type { OpenTDBCategoriesResponse, OpenTDBQuestion, Category, Question } from '@/types/trivia'

export function mapCategories(raw: OpenTDBCategoriesResponse): Category[] {
  return raw.trivia_categories
}

export function mapQuestion(raw: OpenTDBQuestion, index: number): Question {
  const options = [...raw.incorrect_answers, raw.correct_answer].sort(() => Math.random() - 0.5)
  return {
    index,
    text: raw.question,
    options,
    correctAnswer: raw.correct_answer,
  }
}
