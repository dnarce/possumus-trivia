import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import SetupPage from '@/app/page'
import { fetchCategories } from '@/lib/opentdb'

vi.mock('@/lib/opentdb', () => ({
  fetchCategories: vi.fn(),
}))

vi.mock('@/app/actions', () => ({
  startGame: vi.fn(),
}))

describe('SetupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a controlled error modal when categories cannot be loaded', async () => {
    vi.mocked(fetchCategories).mockRejectedValue(new Error('network down'))

    render(await SetupPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByText('Could not load categories')).toBeInTheDocument()
    expect(screen.getByText('Could not load trivia categories. Please try again.')).toBeInTheDocument()
  })

  it('shows a controlled error modal when session creation fails in the server action', async () => {
    vi.mocked(fetchCategories).mockResolvedValue({
      trivia_categories: [{ id: 9, name: 'General Knowledge' }],
    })

    render(await SetupPage({ searchParams: Promise.resolve({ error: 'session' }) }))

    expect(screen.getByText('Could not start the game')).toBeInTheDocument()
    expect(screen.getByText('Could not create a trivia session. Please try again.')).toBeInTheDocument()
  })

  it('shows a controlled error modal when the submitted config is invalid', async () => {
    vi.mocked(fetchCategories).mockResolvedValue({
      trivia_categories: [{ id: 9, name: 'General Knowledge' }],
    })

    render(await SetupPage({ searchParams: Promise.resolve({ error: 'config' }) }))

    expect(screen.getByText('Invalid game configuration')).toBeInTheDocument()
    expect(screen.getByText('The selected category or difficulty is not valid. Please choose them again.')).toBeInTheDocument()
  })

  it('groups category and difficulty selectors with semantic legends', async () => {
    vi.mocked(fetchCategories).mockResolvedValue({
      trivia_categories: [{ id: 9, name: 'General Knowledge' }],
    })

    render(await SetupPage({ searchParams: Promise.resolve({}) }))

    expect(screen.getByText('Select a Category', { selector: 'legend' })).toBeInTheDocument()
    expect(screen.getByRole('radiogroup', { name: 'Select a Category' })).toBeInTheDocument()
    expect(screen.getByText('Select a Difficulty', { selector: 'legend' })).toBeInTheDocument()
  })
})
