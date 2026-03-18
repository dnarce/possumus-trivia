import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { GameClient } from '@/components/game-client'
import type { Question } from '@/types/trivia'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockQuestions: Question[] = [
  {
    index: 0,
    text: 'What is the capital of France?',
    options: ['Madrid', 'Paris', 'Rome', 'Berlin'],
    correctAnswer: 'Paris',
  },
  {
    index: 1,
    text: 'How much is 2 + 2?',
    options: ['3', '4', '5', '6'],
    correctAnswer: '4',
  },
]

const defaultProps = {
  questions: mockQuestions,
  sessionId: 'session-abc',
  categoryId: 9,
  difficulty: 'medium',
}

beforeEach(() => {
  mockPush.mockClear()
  sessionStorage.clear()
})

describe('GameClient', () => {
  it('displays the text of the first question', () => {
    render(<GameClient {...defaultProps} />)
    expect(screen.getByText('What is the capital of France?')).toBeInTheDocument()
  })

  it('displays the question counter', () => {
    render(<GameClient {...defaultProps} />)
    expect(screen.getByText('Question 1 of 2')).toBeInTheDocument()
  })

  it('Next button is disabled before answering', () => {
    render(<GameClient {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('Next button is enabled after selecting an option', () => {
    render(<GameClient {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }))
    expect(screen.getByRole('button', { name: 'Next' })).not.toBeDisabled()
  })

  it('does not allow changing the answer once selected', () => {
    render(<GameClient {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Madrid' }))  // incorrect, first click
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }))   // attempt to change
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))       // correct
    fireEvent.click(screen.getByRole('button', { name: 'See results' }))

    const stored = JSON.parse(sessionStorage.getItem('game-session-abc')!)
    expect(stored.answers[0].selectedOption).toBe('Madrid')
    // If Paris had been registered (correct), score would be 40. If Madrid stuck, score is 20.
    expect(stored.score).toBe(20)
  })

  it('advances to the next question after clicking Next', () => {
    render(<GameClient {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByText('How much is 2 + 2?')).toBeInTheDocument()
    expect(screen.getByText('Question 2 of 2')).toBeInTheDocument()
  })

  it('shows "See results" on the last question', () => {
    render(<GameClient {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(screen.getByRole('button', { name: 'See results' })).toBeInTheDocument()
  })

  it('saves the correct score in sessionStorage when finished', () => {
    render(<GameClient {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }))  // correct
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: '3' }))      // incorrect
    fireEvent.click(screen.getByRole('button', { name: 'See results' }))

    const stored = JSON.parse(sessionStorage.getItem('game-session-abc')!)
    expect(stored.score).toBe(20) // 1 correct × 20
  })

  it('redirects to result with correct params when finished', () => {
    render(<GameClient {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: 'Paris' }))
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    fireEvent.click(screen.getByRole('button', { name: '4' }))
    fireEvent.click(screen.getByRole('button', { name: 'See results' }))

    expect(mockPush).toHaveBeenCalledWith(
      '/game/session-abc/result?categoryId=9&difficulty=medium'
    )
  })
})
