import { type NextRequest } from 'next/server'

const MOCK_TOKEN = 'mock-token-abc123'

const MOCK_CATEGORIES = {
  trivia_categories: [
    { id: 9, name: 'General Knowledge' },
    { id: 11, name: 'Entertainment: Film' },
  ],
}

const MOCK_QUESTIONS = {
  response_code: 0,
  results: [
    {
      type: 'multiple',
      difficulty: 'easy',
      category: 'General Knowledge',
      question: 'What is the capital of France?',
      correct_answer: 'Paris',
      incorrect_answers: ['Madrid', 'Rome', 'Berlin'],
    },
    {
      type: 'multiple',
      difficulty: 'easy',
      category: 'General Knowledge',
      question: 'How much is 2 + 2?',
      correct_answer: '4',
      incorrect_answers: ['3', '5', '6'],
    },
    {
      type: 'multiple',
      difficulty: 'easy',
      category: 'General Knowledge',
      question: 'What color is the sky?',
      correct_answer: 'Blue',
      incorrect_answers: ['Red', 'Green', 'Yellow'],
    },
    {
      type: 'multiple',
      difficulty: 'easy',
      category: 'General Knowledge',
      question: 'How many days are in a week?',
      correct_answer: '7',
      incorrect_answers: ['5', '6', '8'],
    },
    {
      type: 'multiple',
      difficulty: 'easy',
      category: 'General Knowledge',
      question: 'What is the largest planet in our solar system?',
      correct_answer: 'Jupiter',
      incorrect_answers: ['Saturn', 'Earth', 'Mars'],
    },
  ],
}

export function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Not found', { status: 404 })
  }

  const { pathname } = new URL(request.url)

  if (pathname.includes('api_token.php')) {
    return Response.json({ response_code: 0, token: MOCK_TOKEN })
  }

  if (pathname.includes('api_category.php')) {
    return Response.json(MOCK_CATEGORIES)
  }

  if (pathname.includes('api.php')) {
    return Response.json(MOCK_QUESTIONS)
  }

  return new Response('Not found', { status: 404 })
}
