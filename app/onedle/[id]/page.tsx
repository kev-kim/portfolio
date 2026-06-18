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
  return {
    title: `Puzzle #${puzzle.id} — ${puzzle.difficultyTier}`,
    description: `Onedle #${puzzle.id}: a ${puzzle.difficultyTier} one-shot Wordle puzzle for ${puzzle.date}.`,
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
