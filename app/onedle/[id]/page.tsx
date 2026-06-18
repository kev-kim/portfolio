import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPuzzleById, getAllPuzzles } from "@/lib/onedle/puzzles";
import { GameClient } from "@/components/onedle/GameClient";

export async function generateStaticParams() {
  const puzzles = getAllPuzzles();
  return puzzles.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const puzzle = getPuzzleById(parseInt(id));
  if (!puzzle) return { title: "Puzzle Not Found" };
  const description = `Onedle #${puzzle.id}: a ${puzzle.difficultyTier} one-shot Wordle puzzle for ${puzzle.date}.`;
  return {
    title: `Puzzle #${puzzle.id} — ${puzzle.difficultyTier}`,
    description,
    openGraph: {
      title: `Onedle #${puzzle.id} — ${puzzle.difficultyTier}`,
      description,
      url: `https://kev-kim.com/onedle/${puzzle.id}`,
      siteName: "Onedle",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Onedle #${puzzle.id} — ${puzzle.difficultyTier}`,
      description,
    },
  };
}

export default async function PuzzlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const puzzle = getPuzzleById(parseInt(id));
  if (!puzzle) notFound();

  const allPuzzles = getAllPuzzles();

  return <GameClient puzzle={puzzle} allPuzzles={allPuzzles} />;
}
