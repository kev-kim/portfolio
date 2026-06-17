import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <p className="text-xs font-mono text-muted uppercase tracking-widest mb-4">404</p>
        <h1 className="text-3xl font-semibold mb-3">
          The princess is in another castle.
        </h1>
        <p className="text-muted text-sm mb-8">
          This page doesn&apos;t exist. Try heading back home.
        </p>
        <Link
          href="/"
          className="text-sm font-mono text-accent hover:text-accent-hover transition-colors no-underline"
        >
          ← Back home
        </Link>
      </main>
      <Footer />
    </>
  );
}
