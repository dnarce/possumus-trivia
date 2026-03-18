'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/trivia'

interface SetupFormProps {
  categories: Category[]
  action: (formData: FormData) => void
}

const DIFFICULTIES = [
  { value: 'easy', label: 'Fácil' },
  { value: 'medium', label: 'Media' },
  { value: 'hard', label: 'Difícil' },
]

export function SetupForm({ categories, action }: SetupFormProps) {
  const [categoryId, setCategoryId] = useState('')

  return (
    <form action={action}>
      <input type="hidden" name="categoryId" value={categoryId} />

      <div>
        <Label>Categoría</Label>
        <Select onValueChange={setCategoryId}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccioná una categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Dificultad</Label>
        <RadioGroup name="difficulty" defaultValue="easy">
          {DIFFICULTIES.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-3">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value}>{label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" disabled={!categoryId}>
        Jugar!
      </Button>
    </form>
  )
}
