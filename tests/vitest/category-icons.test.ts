import { describe, expect, it } from 'vitest'
import { BadgeQuestionMark, Brain, BookOpen } from 'lucide-react'
import {
  CATEGORY_ICON_MAP,
  DEFAULT_CATEGORY_ICON,
  TRIVIA_CATEGORY_IDS,
  getCategoryIcon,
} from '@/lib/category-icons'

describe('CATEGORY_ICON_MAP', () => {
  it('covers every OpenTDB category id currently supported by the app', () => {
    expect(Object.keys(CATEGORY_ICON_MAP).map(Number).sort((a, b) => a - b)).toEqual(
      [...TRIVIA_CATEGORY_IDS]
    )
  })

  it('returns the mapped icon for known categories', () => {
    expect(getCategoryIcon(9)).toBe(Brain)
    expect(getCategoryIcon(10)).toBe(BookOpen)
  })

  it('falls back to the default icon for unknown categories', () => {
    expect(DEFAULT_CATEGORY_ICON).toBe(BadgeQuestionMark)
    expect(getCategoryIcon(999)).toBe(BadgeQuestionMark)
  })
})
