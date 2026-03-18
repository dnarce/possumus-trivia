interface GamePageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { sessionId } = await params;

  return (
    <main>
      <h1>Pregunta</h1>
    </main>
  );
}
