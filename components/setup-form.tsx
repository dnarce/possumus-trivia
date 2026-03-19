"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { InputGroupAddon, InputGroupText } from "@/components/ui/input-group";
import { getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/types/trivia";

interface SetupFormProps {
  categories: Category[];
  action: (formData: FormData) => void;
}

interface CategoryOption {
  value: string;
  label: string;
  icon: ReturnType<typeof getCategoryIcon>;
}

const DIFFICULTIES = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function SetupForm({ categories, action }: SetupFormProps) {
  const isHydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: String(category.id),
        label: category.name,
        icon: getCategoryIcon(category.id),
      })),
    [categories]
  );

  const [selectedCategory, setSelectedCategory] = useState<CategoryOption | null>(
    null
  );

  return (
    <GlassCard>
      <CardContent className="space-y-3 p-8">
        <form action={action} className="space-y-6">
          <input
            type="hidden"
            name="categoryId"
            value={selectedCategory?.value ?? ""}
          />

          <div className="space-y-2">
            <Label>Category</Label>
            {isHydrated ? (
              <Combobox
                items={categoryOptions}
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                isItemEqualToValue={(item, value) => item.value === value.value}
              >
                <ComboboxInput
                  className="w-full"
                  placeholder="Search a category"
                  showClear
                >
                  {selectedCategory ? (
                    <InputGroupAddon align="inline-start">
                      <InputGroupText>
                        <selectedCategory.icon className="size-4 text-primary" />
                      </InputGroupText>
                    </InputGroupAddon>
                  ) : null}
                </ComboboxInput>
                <ComboboxContent>
                  <ComboboxEmpty>No category found.</ComboboxEmpty>
                  <ComboboxList>
                    {(category: CategoryOption) => (
                      <ComboboxItem
                        key={category.value}
                        value={category}
                        className="gap-3 py-2"
                      >
                        <category.icon className="size-4 text-primary" />
                        <span>{category.label}</span>
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            ) : (
              <Input
                value=""
                readOnly
                placeholder="Search a category"
                aria-hidden="true"
                tabIndex={-1}
              />
            )}
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

          <Button
            type="submit"
            disabled={!selectedCategory}
            className="w-full bg-black"
          >
            Play!
          </Button>
        </form>
      </CardContent>
    </GlassCard>
  );
}
