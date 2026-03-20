import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CategoryCarousel } from '@/components/category-carousel'
import { CATEGORY_IMAGE_MAP } from '@/lib/category-icons'
import type { Category } from '@/types/trivia'

// ---------------------------------------------------------------------------
// Mock embla-carousel-react
// ---------------------------------------------------------------------------
const mockEmblaApi = {
  scrollTo: vi.fn(),
  selectedScrollSnap: vi.fn(() => 0),
  scrollProgress: vi.fn(() => 0),
  scrollSnapList: vi.fn(() => [0, 0.5]),
  slideNodes: vi.fn(() => []),
  on: vi.fn(),
  off: vi.fn(),
}
mockEmblaApi.on.mockReturnValue(mockEmblaApi)
mockEmblaApi.off.mockReturnValue(mockEmblaApi)

vi.mock('embla-carousel-react', () => ({
  default: vi.fn(() => [vi.fn(), mockEmblaApi]),
}))

// ---------------------------------------------------------------------------
// Test data
// ---------------------------------------------------------------------------
const MOCK_CATEGORIES: Category[] = [
  { id: 9, name: 'General Knowledge' },
  { id: 11, name: 'Entertainment: Film' },
]

// A category that is not in CATEGORY_IMAGE_MAP / CATEGORY_LABEL_MAP
const UNKNOWN_CATEGORY: Category = { id: 999, name: 'Unknown' }

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('CategoryCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockEmblaApi.on.mockReturnValue(mockEmblaApi)
    mockEmblaApi.off.mockReturnValue(mockEmblaApi)
    mockEmblaApi.selectedScrollSnap.mockReturnValue(0)
  })

  it('renders a slide for every category', () => {
    render(<CategoryCarousel categories={MOCK_CATEGORIES} />)

    expect(screen.getByAltText('General Knowledge')).toBeInTheDocument()
    expect(screen.getByAltText('Entertainment: Film')).toBeInTheDocument()
  })

  it('exposes the categories as a named radio group', () => {
    render(
      <>
        <p id="categories-label">Select a Category</p>
        <CategoryCarousel
          categories={MOCK_CATEGORIES}
          labelledBy="categories-label"
        />
      </>
    )

    expect(
      screen.getByRole('radiogroup', { name: 'Select a Category' })
    ).toBeInTheDocument()
    expect(screen.getAllByRole('radio')).toHaveLength(MOCK_CATEGORIES.length)
  })

  it('renders the correct image src for known categories', () => {
    render(<CategoryCarousel categories={MOCK_CATEGORIES} />)

    const img = screen.getByAltText('General Knowledge') as HTMLImageElement
    expect(decodeURIComponent(img.src)).toContain(CATEGORY_IMAGE_MAP[9])
  })

  it('falls back to the General Knowledge image for unknown categories', () => {
    render(<CategoryCarousel categories={[UNKNOWN_CATEGORY]} />)

    const img = screen.getByAltText('Unknown') as HTMLImageElement
    expect(decodeURIComponent(img.src)).toContain(CATEGORY_IMAGE_MAP[9])
  })

  it('uses the mapped label when one exists', () => {
    render(<CategoryCarousel categories={MOCK_CATEGORIES} />)

    // CATEGORY_LABEL_MAP[11] = 'Entertainment: Film'
    expect(screen.getByText('Entertainment: Film')).toBeInTheDocument()
  })

  it('falls back to category.name when no mapped label exists', () => {
    render(<CategoryCarousel categories={[UNKNOWN_CATEGORY]} />)

    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('calls onSelect when the user selects a category', () => {
    const onSelect = vi.fn()
    render(<CategoryCarousel categories={MOCK_CATEGORIES} onSelect={onSelect} />)

    screen.getAllByRole('radio')[1].click()

    expect(onSelect).toHaveBeenCalledOnce()
    expect(onSelect).toHaveBeenCalledWith(MOCK_CATEGORIES[1])
  })

  it('does not throw when onSelect is not provided', () => {
    expect(() =>
      render(<CategoryCarousel categories={MOCK_CATEGORIES} />)
    ).not.toThrow()
  })

  it('registers scroll and select event listeners on mount', () => {
    render(<CategoryCarousel categories={MOCK_CATEGORIES} />)

    const registeredEvents = mockEmblaApi.on.mock.calls.map(([event]) => event)
    expect(registeredEvents).toContain('scroll')
    expect(registeredEvents).toContain('select')
  })

  it('removes all event listeners on unmount', () => {
    const { unmount } = render(<CategoryCarousel categories={MOCK_CATEGORIES} />)
    unmount()

    const removedEvents = mockEmblaApi.off.mock.calls.map(([event]) => event)
    expect(removedEvents).toContain('scroll')
    expect(removedEvents).toContain('select')
  })
})
