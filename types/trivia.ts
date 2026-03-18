// --- API raw types (OpenTDB response shapes) ---

export interface OpenTDBQuestion {
  type: 'multiple' | 'boolean'
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export interface OpenTDBQuestionsResponse {
  response_code: 0 | 1 | 2 | 3 | 4 | 5
  results: OpenTDBQuestion[]
}

export interface OpenTDBCategoriesResponse {
  trivia_categories: Category[]
}

// --- Domain types ---

export interface Category {
  id: number
  name: string
}

export const TRIVIA_DEFAULTS = {
  amount: 5 as const,
  type: 'multiple' as const,
}

export interface TriviaConfig {
  categoryId: number
  categoryName: string
  difficulty: 'easy' | 'medium' | 'hard'
  amount?: number
  type?: 'multiple' | 'boolean'
}

export interface Question {
  index: number
  text: string
  options: string[]
  correctAnswer: string
}

export interface PlayerAnswer {
  questionIndex: number
  selectedOption: string
  correctAnswer: string
  isCorrect: boolean
}

export type GameStatus = 'setup' | 'playing' | 'finished'

export interface GameState {
  config: TriviaConfig | null
  questions: Question[]
  currentQuestionIndex: number
  answers: PlayerAnswer[]
  score: number
  status: GameStatus
}
