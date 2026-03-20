"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { CATEGORY_IMAGE_MAP, CATEGORY_LABEL_MAP, getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/types/trivia";

interface CategoryCarouselProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
  labelledBy?: string;
}

function numberWithinRange(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}

export function CategoryCarousel({
  categories,
  onSelect,
  labelledBy,
}: CategoryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  const lastNotifiedIndex = useRef<number | null>(null);
  const groupName = useId();

  const commitSelection = useCallback(
    (index: number) => {
      setSelectedIndex(index);

      if (lastNotifiedIndex.current === index) return;

      lastNotifiedIndex.current = index;
      const category = categories[index];
      if (category) {
        onSelect?.(category);
      }
    },
    [categories, onSelect]
  );

  const setTweenNodes = useCallback(() => {
    if (!emblaApi) return;
    tweenNodes.current = emblaApi.slideNodes().map(
      (slideNode) => slideNode.querySelector("[data-scale]") as HTMLElement
    );
  }, [emblaApi]);

  const applyScale = useCallback(() => {
    if (!emblaApi) return;
    const scrollProgress = emblaApi.scrollProgress();
    const slideCount = emblaApi.scrollSnapList().length;

    emblaApi.scrollSnapList().forEach((snap, index) => {
      const target = tweenNodes.current[index];
      if (!target) return;

      const scaleDiff = Math.abs((snap - scrollProgress) * slideCount);
      target.style.transform = `scale(${numberWithinRange(1 - scaleDiff * 0.15, 0.7, 1)})`;
      target.style.opacity = String(numberWithinRange(1 - scaleDiff * 0.3, 0.4, 1));
    });
  }, [emblaApi]);

  const updateSelectedIndex = useCallback(() => {
    if (!emblaApi) return;
    commitSelection(emblaApi.selectedScrollSnap());
  }, [commitSelection, emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenNodes();
    applyScale();

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", applyScale)
      .on("reInit", updateSelectedIndex)
      .on("scroll", applyScale)
      .on("select", updateSelectedIndex);

    return () => {
      emblaApi
        .off("reInit", setTweenNodes)
        .off("reInit", applyScale)
        .off("reInit", updateSelectedIndex)
        .off("scroll", applyScale)
        .off("select", updateSelectedIndex);
    };
  }, [emblaApi, setTweenNodes, applyScale, updateSelectedIndex]);

  const selectCategory = useCallback(
    (index: number) => {
      commitSelection(index);
      emblaApi?.scrollTo(index);
    },
    [commitSelection, emblaApi]
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div
        className="flex touch-pan-y"
        role="radiogroup"
        aria-labelledby={labelledBy}
      >
        {categories.map((category, index) => {
          const CategoryIcon = getCategoryIcon(category.id);
          const imageSrc = CATEGORY_IMAGE_MAP[category.id as keyof typeof CATEGORY_IMAGE_MAP];
          const label = CATEGORY_LABEL_MAP[category.id as keyof typeof CATEGORY_LABEL_MAP] ?? category.name;
          const isSelected = index === selectedIndex;
          const inputId = `${groupName}-${category.id}`;

          return (
            <div
              key={category.id}
              className="flex-[0_0_55%] min-w-0 px-2 cursor-grab active:cursor-grabbing"
              role="presentation"
            >
              <input
                id={inputId}
                type="radio"
                name={groupName}
                value={category.id}
                checked={isSelected}
                onChange={() => selectCategory(index)}
                onFocus={() => emblaApi?.scrollTo(index)}
                className="peer sr-only"
              />
              <div
                data-scale
                className="will-change-transform"
                style={{ transformOrigin: "center center" }}
              >
                <label
                  htmlFor={inputId}
                  className={`relative rounded-2xl overflow-hidden transition-colors duration-200 ${
                    isSelected ? "border-primary shadow-lg shadow-primary/20" : "border-white/10"
                  } block cursor-pointer peer-focus-visible:ring-3 peer-focus-visible:ring-ring/50`}
                >
                  <Image
                    src={imageSrc ?? CATEGORY_IMAGE_MAP[9]} // fallback to general knowledge
                    alt={label}
                    width={470}
                    height={660}
                    className="w-full h-full max-h-[450px] aspect-47/66 object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-card/65 p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <CategoryIcon className="size-5 text-primary shrink-0" />
                      <span className="text-white text-base font-medium leading-tight">{label}</span>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
