"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { puzzleIdForLocalDate } from "@/lib/onedle/puzzles";

export default function OnedlePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace(`/onedle/${puzzleIdForLocalDate()}`);
  }, [router]);
  return null;
}
