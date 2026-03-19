"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
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
  const [categoryId, setCategoryId] = useState("");

  return (
    <GlassCard>
      <CardContent className="space-y-3 p-8">
        <form action={action} className="space-y-6">
          <input type="hidden" name="categoryId" value={categoryId} />

          <div className="space-y-2">
            <Label>Category</Label>
            <Select onValueChange={setCategoryId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
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

          <div className="space-y-3">
            <Label>Difficulty</Label>
            <RadioGroup
              name="difficulty"
              defaultValue="easy"
              className="flex gap-6"
            >
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

          <Button type="submit" disabled={!categoryId} className="w-full bg-black">
            Play!
          </Button>
        </form>
      </CardContent>
    </GlassCard>
  );
}
