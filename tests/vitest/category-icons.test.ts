import { describe, expect, it } from 'vitest'
import { BadgeQuestionMark, Brain, BookOpen } from 'lucide-react'
import {
  CATEGORY_ICON_MAP,
  CATEGORY_LABEL_MAP,
  DEFAULT_CATEGORY_ICON,
  DEFAULT_CATEGORY_LABEL,
  TRIVIA_CATEGORY_IDS,
  getCategoryIcon,
  getCategoryLabel,
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

describe('CATEGORY_LABEL_MAP', () => {
  it('covers every OpenTDB category id currently supported by the app', () => {
    expect(Object.keys(CATEGORY_LABEL_MAP).map(Number).sort((a, b) => a - b)).toEqual(
      [...TRIVIA_CATEGORY_IDS]
    )
  })

  it('returns the mapped label for known categories', () => {
    expect(getCategoryLabel(9)).toBe('General Knowledge')
    expect(getCategoryLabel(10)).toBe('Entertainment: Books')
  })

  it('falls back to the default label for unknown categories', () => {
    expect(getCategoryLabel(999)).toBe(DEFAULT_CATEGORY_LABEL)
  })
})
