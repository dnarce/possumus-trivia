"use client";

import { createElement, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Question, PlayerAnswer } from "@/types/trivia";
import { getCategoryIcon, getCategoryLabel } from "@/lib/category-icons";
import { GlassCard } from "./ui/glass-card";
import SplitText from "./SplitText";

const POINTS_PER_CORRECT = 20;

interface GameClientProps {
  questions: Question[];
  sessionId: string;
  categoryId: number;
  difficulty: string;
}

export function GameClient({
  questions,
  sessionId,
  categoryId,
  difficulty,
}: GameClientProps) {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selectedOption !== null;
  const isLastQuestion = currentIndex === questions.length - 1;
  const categoryLabel = getCategoryLabel(categoryId);
  const difficultyLabel =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const score =
    answers.filter((answer) => answer.isCorrect).length * POINTS_PER_CORRECT +
    (selectedOption === currentQuestion.correctAnswer ? POINTS_PER_CORRECT : 0);

  function handleSelect(option: string) {
    if (isAnswered) return;
    setSelectedOption(option);
  }

  const handleNext = useCallback(() => {
    const answer: PlayerAnswer = {
      questionIndex: currentIndex,
      selectedOption: selectedOption!,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect: selectedOption === currentQuestion.correctAnswer,
    };

    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      const score =
        updatedAnswers.filter((a) => a.isCorrect).length * POINTS_PER_CORRECT;
      sessionStorage.setItem(
        `game-${sessionId}`,
        JSON.stringify({ answers: updatedAnswers, score, questions }),
      );
      router.push(
        `/game/${sessionId}/result?categoryId=${categoryId}&difficulty=${difficulty}`,
      );
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    }
  }, [
    answers,
    categoryId,
    currentIndex,
    currentQuestion,
    difficulty,
    isLastQuestion,
    router,
    selectedOption,
    sessionId,
  ]);

  useEffect(() => {
    if (!isLastQuestion || selectedOption === null) return;
    const timer = setTimeout(handleNext, 1000);
    return () => clearTimeout(timer);
  }, [isLastQuestion, selectedOption, handleNext]);

  function getOptionVariant(
    option: string,
  ): "default" | "success" | "destructive" {
    if (!isAnswered) return "default";
    if (option === currentQuestion.correctAnswer) return "success";
    if (option === selectedOption) return "destructive";
    return "default";
  }

  return (
    <div className="flex flex-col justify-between h-full py-8 sm:py-16">
      <div className="flex flex-col gap-2 text-sm sm:grid sm:grid-cols-[1fr_auto_1fr] sm:items-center sm:gap-3">
        <div className="flex items-center justify-between gap-2 whitespace-nowrap text-sm font-medium sm:contents">
          <p className="sm:justify-self-center sm:text-center mx-1 font-semibold">
            Question {currentIndex + 1}/{questions.length}
          </p>
          <p className="sm:justify-self-end font-semibold">
            Score {score} pts
          </p>
        </div>
        <div className="flex min-w-0 items-center gap-1.5 sm:order-first sm:justify-self-start sm:gap-2">
          <div className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
            {createElement(getCategoryIcon(categoryId), {
              className: "size-4",
            })}
            <span className="truncate">{categoryLabel}</span>
          </div>
          <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
            {difficultyLabel}
          </div>
        </div>
      </div>

      <SplitText
        key={currentIndex}
        text={currentQuestion.text}
        className="text-3xl sm:text-6xl text-shadow-lg font-bold tracking-tight text-center py-6 sm:py-10"
        delay={25}
        duration={0.5}
        ease="power3.out"
        splitType="chars"
        from={{ opacity: 0, y: 40 }}
        to={{ opacity: 1, y: 0 }}
        threshold={0.1}
        rootMargin="-100px"
        textAlign="center"
      />

      <div className="flex flex-col gap-3">
        <div className="px-4 sm:px-8 space-y-2 sm:space-y-2.5 pb-4 sm:pb-6">
          {currentQuestion.options.map((option) => (
            <Button
              key={option}
              variant={getOptionVariant(option)}
              className="w-full justify-center gap-2 h-auto min-h-10 py-2.5 whitespace-normal text-center sm:min-h-12 sm:px-4 sm:text-lg sm:font-semibold"
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
              size="default"
            >
              {isAnswered && option === currentQuestion.correctAnswer ? (
                <CheckCircle2 className="h-5 w-5" />
              ) : isAnswered && option === selectedOption ? (
                <XCircle className="h-5 w-5" />
              ) : null}
              {option}
            </Button>
          ))}
        </div>

        {!isLastQuestion && (
          <Button
            className="w-full"
            variant="outline"
            disabled={!isAnswered}
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
