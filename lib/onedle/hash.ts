export async function hashAnswer(answer: string, salt: string): Promise<string> {
  const data = new TextEncoder().encode(answer.toUpperCase() + salt);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function validateGuess(
  guess: string,
  salt: string,
  answerHash: string
): Promise<boolean> {
  const h = await hashAnswer(guess, salt);
  return h === answerHash;
}
