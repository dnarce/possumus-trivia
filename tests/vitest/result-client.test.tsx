import type { ReactNode } from 'react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ResultClient } from '@/components/result-client'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

vi.mock('next/image', () => ({
  default: ({ alt }: { alt: string }) => <div aria-label={alt} />,
}))

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => <a href={href}>{children}</a>,
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTrigger: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}))

const defaultProps = {
  sessionId: 'session-abc',
  categoryId: '9',
  difficulty: 'easy',
  restartAction: vi.fn(),
}

const storedResult = {
  answers: [
    {
      questionIndex: 0,
      selectedOption: 'Paris',
      correctAnswer: 'Paris',
      isCorrect: true,
    },
  ],
  score: 20,
  questions: [
    {
      index: 0,
      text: 'What is the capital of France?',
      options: ['Paris', 'Madrid', 'Rome', 'Berlin'],
      correctAnswer: 'Paris',
    },
  ],
  categoryId: 9,
  difficulty: 'easy',
} as const

describe('ResultClient', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    sessionStorage.clear()
    localStorage.clear()
  })

  it('restores the result from localStorage when sessionStorage is empty', () => {
    localStorage.setItem('game-session-abc', JSON.stringify(storedResult))

    render(<ResultClient {...defaultProps} />)

    expect(screen.getByText('20 pts')).toBeInTheDocument()
    expect(screen.getByText(/1 \/ 1 correct/i)).toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('redirects to setup when no persisted result exists', async () => {
    render(<ResultClient {...defaultProps} />)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/')
    })
  })

  it('redirects to setup when the persisted result belongs to a different config', async () => {
    localStorage.setItem(
      'game-session-abc',
      JSON.stringify({ ...storedResult, difficulty: 'hard' }),
    )

    render(<ResultClient {...defaultProps} />)

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/')
    })
  })
})
