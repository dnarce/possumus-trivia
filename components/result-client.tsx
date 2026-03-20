"use client";

import { createElement, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  deserializeGameResult,
  readGameResultSnapshot,
} from "@/lib/game-result-storage";
import { getCategoryIcon, getCategoryLabel } from "@/lib/category-icons";
import type { PlayerAnswer, Question } from "@/types/trivia";

interface ResultClientProps {
  sessionId: string;
  categoryId: string;
  difficulty: string;
  restartAction: (formData: FormData) => void;
}

function subscribeToStorage() {
  return () => {};
}

function ReviewDialog({
  questions,
  answers,
}: {
  questions: Question[];
  answers: PlayerAnswer[];
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="outline">
          Review answers
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Question review</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 pt-2">
          {questions.map((question, i) => {
            const answer = answers[i];
            const isCorrect = answer?.isCorrect;

            return (
              <div key={question.index} className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {isCorrect ? (
                      <CheckCircle2 className="size-5 text-success" />
                    ) : (
                      <XCircle className="size-5 text-destructive" />
                    )}
                  </div>
                  <p className="text-sm font-semibold leading-snug">
                    {question.text}
                  </p>
                </div>
                <div className="pl-8 space-y-1 text-sm">
                  {!isCorrect && (
                    <div className="flex items-center gap-2">
                      <span className="shrink-0 text-white/60">Your answer:</span>
                      <span className="text-destructive font-medium">
                        {answer?.selectedOption ?? "—"}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-white/60">Correct answer:</span>
                    <span className="text-success font-medium">
                      {question.correctAnswer}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ResultClient({
  sessionId,
  categoryId,
  difficulty,
  restartAction,
}: ResultClientProps) {
  const router = useRouter();
  const categoryIdNum = Number(categoryId);
  const storedResult = useSyncExternalStore<string | null>(
    subscribeToStorage,
    () => readGameResultSnapshot(sessionId),
    () => null,
  );
  const result = deserializeGameResult(storedResult);

  useEffect(() => {
    if (
      result === null
      || result.categoryId !== categoryIdNum
      || result.difficulty !== difficulty
    ) {
      router.replace("/");
    }
  }, [categoryIdNum, difficulty, result, router]);

  if (
    !result
    || result.categoryId !== categoryIdNum
    || result.difficulty !== difficulty
  ) {
    return null;
  }

  const categoryLabel = getCategoryLabel(categoryIdNum);
  const difficultyLabel =
    difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  const correctCount = result.answers.filter((a) => a.isCorrect).length;
  const maxScore = result.answers.length * 20;
  const scoreRatio = result.score / maxScore;
  const scoreImage =
    scoreRatio >= 0.7
      ? "/images/winner.avif"
      : scoreRatio >= 0.4
        ? "/images/meh.avif"
        : "/images/loose.avif";

  return (
    <div className="space-y-6">
      {/* Score summary */}
      <div className="space-y-2 text-center">
        <Image
          src={scoreImage}
          alt="score result"
          width={400}
          height={400}
          className="mx-auto w-52 sm:w-60 md:w-[400px] aspect-square"
        />
        <p className="text-4xl font-bold text-shadow-lg">{result.score} pts</p>
        <p className="text-white/70">
          {correctCount} / {result.answers.length} correct &middot; out of{" "}
          {maxScore} possible points
        </p>
      </div>

      {/* Category & difficulty badge */}
      <div className="flex items-center justify-center gap-2 flex-wrap">
        <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
          {createElement(getCategoryIcon(categoryIdNum), {
            className: "size-4",
          })}
          <span>{categoryLabel}</span>
        </div>
        <div className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm shadow-sm backdrop-blur-sm">
          {difficultyLabel}
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        {result.questions?.length > 0 && (
          <ReviewDialog questions={result.questions} answers={result.answers} />
        )}

        <form action={restartAction}>
          <input type="hidden" name="categoryId" value={categoryId} />
          <input type="hidden" name="difficulty" value={difficulty} />
          <Button variant="default" type="submit" className="w-full">
            Restart
          </Button>
        </form>
        <Button className="w-full" variant="secondary" asChild>
          <Link href="/">Exit</Link>
        </Button>
      </div>
    </div>
  );
}
