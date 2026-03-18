interface ResultPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { sessionId } = await params;

  return (
    <main>
      <h1>Resultados</h1>
    </main>
  );
}
