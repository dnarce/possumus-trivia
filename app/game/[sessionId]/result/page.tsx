import { ResultClient } from "@/components/result-client";
import { startGame } from "@/app/actions";

interface ResultPageProps {
  params: Promise<{ sessionId: string }>;
  searchParams: Promise<{ categoryId: string; difficulty: string }>;
}

export default async function ResultPage({
  params,
  searchParams,
}: ResultPageProps) {
  const { sessionId } = await params;
  const { categoryId, difficulty } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-4xl space-y-6 px-4">
        <ResultClient
          sessionId={sessionId}
          categoryId={categoryId}
          difficulty={difficulty}
          restartAction={startGame}
        />
      </div>
    </main>
  );
}
