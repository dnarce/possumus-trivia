"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { PlayerAnswer } from "@/types/trivia";
import { GlassCard } from "./ui/glass-card";

interface GameResult {
  answers: PlayerAnswer[];
  score: number;
}

interface ResultClientProps {
  sessionId: string;
  categoryId: string;
  difficulty: string;
  restartAction: (formData: FormData) => void;
}

export function ResultClient({
  sessionId,
  categoryId,
  difficulty,
  restartAction,
}: ResultClientProps) {
  const router = useRouter();
  const [result, setResult] = useState<GameResult | null>(null);

  const loadResult = useCallback(() => {
    const stored = sessionStorage.getItem(`game-${sessionId}`);
    if (stored) {
      setResult(JSON.parse(stored));
    } else {
      router.replace("/");
    }
  }, [sessionId, router]);

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  if (!result) return null;

  return (
    <GlassCard className="px-8 py-12">
      <div className="space-y-6">
        <div className="space-y-1">
          <p className="text-5xl font-bold">{result.score} pts</p>
          <p className="">
            out of {result.answers.length * 20} possible points
          </p>
        </div>

        <div className="space-y-3">
          <form action={restartAction}>
            <input type="hidden" name="categoryId" value={categoryId} />
            <input type="hidden" name="difficulty" value={difficulty} />
            <Button type="submit" className="w-full">
              Restart
            </Button>
          </form>
          <Button className="w-full" variant="outline" asChild>
            <Link href="/">Exit</Link>
          </Button>
        </div>
      </div>
    </GlassCard>
  );
}
