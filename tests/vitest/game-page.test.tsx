import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import GamePage from '@/app/game/[sessionId]/page'
import { fetchQuestions, resetSession } from '@/lib/opentdb'

vi.mock('@/lib/opentdb', () => ({
  fetchQuestions: vi.fn(),
  resetSession: vi.fn(),
}))

vi.mock('@/components/game-client', () => ({
  GameClient: () => <div>game</div>,
}))

describe('GamePage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a controlled error modal when questions cannot be loaded', async () => {
    vi.mocked(fetchQuestions).mockRejectedValue(new Error('timeout'))

    render(
      await GamePage({
        params: Promise.resolve({ sessionId: 'session-abc' }),
        searchParams: Promise.resolve({ categoryId: '9', difficulty: 'easy' }),
      })
    )

    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('Could not load questions. Please try again.')).toBeInTheDocument()
  })

  it('shows the specific response-code error when OpenTDB returns a known code', async () => {
    vi.mocked(fetchQuestions).mockResolvedValue({ response_code: 1, results: [] })
    vi.mocked(resetSession).mockResolvedValue()

    render(
      await GamePage({
        params: Promise.resolve({ sessionId: 'session-abc' }),
        searchParams: Promise.resolve({ categoryId: '9', difficulty: 'easy' }),
      })
    )

    expect(screen.getByText('Not enough questions')).toBeInTheDocument()
  })

  it('shows a controlled error when category or difficulty are outside the allowed domain', async () => {
    render(
      await GamePage({
        params: Promise.resolve({ sessionId: 'session-abc' }),
        searchParams: Promise.resolve({ categoryId: '999', difficulty: 'legendary' }),
      })
    )

    expect(screen.getByText('Invalid game configuration')).toBeInTheDocument()
    expect(vi.mocked(fetchQuestions)).not.toHaveBeenCalled()
  })
})
