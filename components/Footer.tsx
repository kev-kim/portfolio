import { profile } from "@/content/profile";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-2xl px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted font-mono">© {year} Kevin Kim</p>
        <nav className="flex items-center gap-6" aria-label="Social links">
          <a
            href={profile.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-text transition-colors no-underline"
          >
            GitHub
          </a>
          <a
            href={profile.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted hover:text-text transition-colors no-underline"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${profile.links.email}`}
            className="text-sm text-muted hover:text-text transition-colors no-underline"
          >
            Email
          </a>
        </nav>
      </div>
    </footer>
  );
}
