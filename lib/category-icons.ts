import type { LucideIcon } from 'lucide-react'
import {
  BookImage,
  BookOpen,
  Brain,
  CarFront,
  Clapperboard,
  Dices,
  Drama,
  Gamepad2,
  Globe2,
  Landmark,
  LaptopMinimal,
  Music,
  Palette,
  PanelsTopLeft,
  PawPrint,
  Star,
  Trophy,
  Tv,
  WandSparkles,
  Atom,
  Sigma,
  ScrollText,
  Smartphone,
  MonitorPlay,
  BadgeQuestionMark,
} from 'lucide-react'

export const TRIVIA_CATEGORY_IDS = [
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  32,
] as const

export type TriviaCategoryId = (typeof TRIVIA_CATEGORY_IDS)[number]

export const DEFAULT_CATEGORY_ICON = BadgeQuestionMark
export const DEFAULT_CATEGORY_LABEL = 'Unknown Category'

export const CATEGORY_ICON_MAP: Record<TriviaCategoryId, LucideIcon> = {
  9: Brain,
  10: BookOpen,
  11: Clapperboard,
  12: Music,
  13: Drama,
  14: Tv,
  15: Gamepad2,
  16: Dices,
  17: Atom,
  18: LaptopMinimal,
  19: Sigma,
  20: WandSparkles,
  21: Trophy,
  22: Globe2,
  23: ScrollText,
  24: Landmark,
  25: Palette,
  26: Star,
  27: PawPrint,
  28: CarFront,
  29: PanelsTopLeft,
  30: Smartphone,
  31: BookImage,
  32: MonitorPlay,
}

export const CATEGORY_LABEL_MAP: Record<TriviaCategoryId, string> = {
  9: 'General Knowledge',
  10: 'Entertainment: Books',
  11: 'Entertainment: Film',
  12: 'Entertainment: Music',
  13: 'Entertainment: Musicals & Theatres',
  14: 'Entertainment: Television',
  15: 'Entertainment: Video Games',
  16: 'Entertainment: Board Games',
  17: 'Science & Nature',
  18: 'Science: Computers',
  19: 'Science: Mathematics',
  20: 'Mythology',
  21: 'Sports',
  22: 'Geography',
  23: 'History',
  24: 'Politics',
  25: 'Art',
  26: 'Celebrities',
  27: 'Animals',
  28: 'Vehicles',
  29: 'Entertainment: Comics',
  30: 'Science: Gadgets',
  31: 'Entertainment: Japanese Anime & Manga',
  32: 'Entertainment: Cartoon & Animations',
}

export function getCategoryIcon(categoryId: number): LucideIcon {
  return CATEGORY_ICON_MAP[categoryId as TriviaCategoryId] ?? DEFAULT_CATEGORY_ICON
}

export function getCategoryLabel(categoryId: number): string {
  return CATEGORY_LABEL_MAP[categoryId as TriviaCategoryId] ?? DEFAULT_CATEGORY_LABEL
}
