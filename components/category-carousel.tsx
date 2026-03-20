"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CATEGORY_IMAGE_MAP, CATEGORY_LABEL_MAP, getCategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/types/trivia";

interface CategoryCarouselProps {
  categories: Category[];
  onSelect?: (category: Category) => void;
}

function numberWithinRange(number: number, min: number, max: number) {
  return Math.min(Math.max(number, min), max);
}

export function CategoryCarousel({ categories, onSelect }: CategoryCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tweenNodes = useRef<HTMLElement[]>([]);

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

  const handleSelect = useCallback(() => {
    if (!emblaApi) return;
    const index = emblaApi.selectedScrollSnap();
    setSelectedIndex(index);
    onSelect?.(categories[index]);
  }, [emblaApi, categories, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    setTweenNodes();
    applyScale();
    handleSelect();

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", applyScale)
      .on("reInit", handleSelect)
      .on("scroll", applyScale)
      .on("select", handleSelect);

    return () => {
      emblaApi
        .off("reInit", setTweenNodes)
        .off("reInit", applyScale)
        .off("reInit", handleSelect)
        .off("scroll", applyScale)
        .off("select", handleSelect);
    };
  }, [emblaApi, setTweenNodes, applyScale, handleSelect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
      else if (e.key === "ArrowRight") emblaApi?.scrollNext();
    },
    [emblaApi]
  );

  return (
    <div
      className="overflow-hidden outline-none"
      ref={emblaRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="flex touch-pan-y">
        {categories.map((category, index) => {
          const CategoryIcon = getCategoryIcon(category.id);
          const imageSrc = CATEGORY_IMAGE_MAP[category.id as keyof typeof CATEGORY_IMAGE_MAP];
          const label = CATEGORY_LABEL_MAP[category.id as keyof typeof CATEGORY_LABEL_MAP] ?? category.name;
          const isSelected = index === selectedIndex;

          return (
            <div
              key={category.id}
              className="flex-[0_0_55%] min-w-0 px-2 cursor-grab active:cursor-grabbing"
              onClick={() => emblaApi?.scrollTo(index)}
            >
              <div
                data-scale
                className="transition-transform duration-200 will-change-transform"
                style={{ transformOrigin: "center center" }}
              >
                <div
                  className={`relative rounded-2xl overflow-hidden transition-colors duration-200 ${
                    isSelected ? "border-primary shadow-lg shadow-primary/20" : "border-white/10"
                  }`}
                >
                  <img
                    src={imageSrc ?? CATEGORY_IMAGE_MAP[9]} // fallback to general knowledge
                    alt={label}
                    className="w-full h-full max-h-[450px] aspect-47/66 object-cover"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-card/65 p-4">
                    <div className="flex items-center gap-2 justify-center">
                      <CategoryIcon className="size-5 text-primary shrink-0" />
                      <span className="text-white text-base font-medium leading-tight">{label}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
