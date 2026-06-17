import { redirect } from "next/navigation";
import { getTodaysPuzzleId } from "@/lib/onedle/puzzles";

export default function OnedlePage() {
  const id = getTodaysPuzzleId();
  redirect(`/onedle/${id}`);
}
