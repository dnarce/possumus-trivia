"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CategoryCarousel } from "@/components/category-carousel";
import type { Category } from "@/types/trivia";

interface SetupFormProps {
  categories: Category[];
  action: (formData: FormData) => void;
}

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function SetupForm({ categories, action }: SetupFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    categories[0] ?? null
  );

  return (
    <form action={action} className="space-y-6 flex flex-col gap-6 items-center justify-center">
      <input
        type="hidden"
        name="categoryId"
        value={selectedCategory ? String(selectedCategory.id) : ""}
      />
      <input
        type="hidden"
        name="categoryName"
        value={selectedCategory?.name ?? ""}
      />

      <div className="w-full space-y-3">
        <Label className="text-lg text-center block">Select a Category</Label>
        <CategoryCarousel categories={categories} onSelect={setSelectedCategory} />
      </div>

      <div className="space-y-3">
        <Label className="text-lg text-center block">Select a Difficulty</Label>
        <RadioGroup name="difficulty" defaultValue="easy" className="flex gap-6">
          {DIFFICULTIES.map(({ value, label }) => (
            <div key={value} className="flex items-center gap-2">
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <Button type="submit" disabled={!selectedCategory} className="w-full">
        Play!
      </Button>
    </form>
  );
}
