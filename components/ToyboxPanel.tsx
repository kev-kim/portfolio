"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { GravityBalls } from "@/components/toys/GravityBalls";

type Toy = {
  id: string;
  name: string;
  hint: string;
  component: React.ComponentType;
};

function OnedleCard() {
  return (
    <div className="flex flex-col items-center gap-3 py-1">
      <p className="font-mono text-[10px] text-muted text-center leading-relaxed">
        A Wordle variant where the clues narrow it to one word — how many tries does it take you?
      </p>
      <Link
        href="/onedle"
        className="font-mono text-xs px-3 py-1.5 border border-accent text-accent hover:bg-accent/10 transition-colors rounded-sm w-full text-center"
      >
        Play today →
      </Link>
    </div>
  );
}

const toys: Toy[] = [
  {
    id: "onedle",
    name: "Onedle",
    hint: "one word. every day.",
    component: OnedleCard,
  },
  {
    id: "gravity",
    name: "Gravity",
    hint: "tap to drop balls",
    component: GravityBalls,
  },
];

export function ToyboxPanel() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [activeToy, setActiveToy] = useState(toys[0]);
  const [footerOverlap, setFooterOverlap] = useState(0);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    const update = () => {
      const rect = footer.getBoundingClientRect();
      setFooterOverlap(Math.max(0, window.innerHeight - rect.top));
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // smoothY springs toward scrollY with lag. The gap (scrollY - smoothY) is the
  // "how far behind" value — positive when scrolling down, negative when up.
  // Scaling that gap drives the card to drift in the scroll direction then spring back.
  // The spring chases scrollY. The difference (spring - actual) is how far behind
  // the card is: positive when scrolled up past it, negative when scrolled down past it.
  // The card always wants to be at the center; lag is how far it hasn't caught up yet.
  const { scrollY } = useScroll();
  const springScrollY = useSpring(scrollY, { stiffness: 40, damping: 18, mass: 1 });
  const floatY = useTransform(
    [scrollY, springScrollY],
    ([sy, spy]: number[]) => spy - sy
  );

  const ToyComponent = activeToy.component;

  return (
    <>
      {/* ── Desktop track (xl+) ──────────────────────────────── */}
      <svg
        className="hidden xl:block fixed top-0 left-5 z-30 pointer-events-none"
        width="220"
        style={{ height: `calc(100dvh - ${footerOverlap}px)`, opacity: 0.18 }}
        aria-hidden
      >
        <defs>
          <pattern id="track" x="0" y="0" width="220" height="36" patternUnits="userSpaceOnUse">
            {/* left rail */}
            <line x1="12" y1="0" x2="12" y2="36" stroke="var(--color-border)" strokeWidth="1.5" />
            {/* right rail */}
            <line x1="208" y1="0" x2="208" y2="36" stroke="var(--color-border)" strokeWidth="1.5" />
            {/* cross-tie */}
            <line x1="8" y1="31" x2="212" y2="31" stroke="var(--color-border)" strokeWidth="2.5" />
          </pattern>
        </defs>
        <rect width="220" height="100%" fill="url(#track)" />
      </svg>

      {/* ── Desktop panel (xl+) ───────────────────────────── */}
      <div className="hidden xl:block fixed left-5 top-1/2 -translate-y-1/2 z-40">
        <motion.div
          style={{ y: floatY }}
          className="w-[220px] border border-border bg-surface rounded-sm flex flex-col"
        >
          {/* Header — always visible; minimize toggle on the right */}
          <div className="px-4 py-3 flex items-center justify-between border-b border-border">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono uppercase tracking-widest text-muted">Toybox</p>
              <AnimatePresence>
                {!minimized && toys.length > 1 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {toys.map((toy) => (
                        <button
                          key={toy.id}
                          onClick={() => setActiveToy(toy)}
                          className={`text-xs font-mono px-2 py-0.5 rounded-sm border transition-colors ${
                            activeToy.id === toy.id
                              ? "border-accent text-accent"
                              : "border-border text-muted hover:text-text"
                          }`}
                        >
                          {toy.name}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Minimize / expand button */}
            <button
              onClick={() => setMinimized((m) => !m)}
              aria-label={minimized ? "Expand Toybox" : "Minimize Toybox"}
              className="ml-3 w-5 h-5 flex items-center justify-center text-muted hover:text-text transition-colors shrink-0"
            >
              <motion.span
                animate={{ rotate: minimized ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="block leading-none text-base"
                style={{ transformOrigin: "center" }}
              >
                {/* Chevron — points down when expanded, up when minimized */}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,4 6,8 10,4" />
                </svg>
              </motion.span>
            </button>
          </div>

          {/* Toy body — collapses on minimize */}
          <AnimatePresence initial={false}>
            {!minimized && (
              <motion.div
                key="toy-body"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="p-3">
                  <ToyComponent />
                  <p className="text-xs font-mono text-muted mt-2 text-center">{activeToy.hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ── Mobile icon + modal (below xl) ───────────────────── */}
      <div className="xl:hidden fixed bottom-5 left-5 z-40">
        <motion.button
          onClick={() => setMobileOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.93 }}
          aria-label="Open Toybox"
          className="w-11 h-11 rounded-full bg-text text-bg border border-border flex items-center justify-center text-sm font-mono font-bold shadow-sm"
        >
          ✦
        </motion.button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="toybox-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="xl:hidden fixed inset-0 bg-text/20 backdrop-blur-sm z-40"
            />

            {/* Bottom sheet */}
            <motion.div
              key="toybox-sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="xl:hidden fixed bottom-0 left-0 right-0 z-50 bg-bg border-t border-border rounded-t-lg p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-mono uppercase tracking-widest text-muted">Toybox</p>
                  {toys.length > 1 && (
                    <div className="flex gap-1.5 mt-2">
                      {toys.map((toy) => (
                        <button
                          key={toy.id}
                          onClick={() => setActiveToy(toy)}
                          className={`text-xs font-mono px-2 py-0.5 rounded-sm border transition-colors ${
                            activeToy.id === toy.id
                              ? "border-accent text-accent"
                              : "border-border text-muted hover:text-text"
                          }`}
                        >
                          {toy.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close Toybox"
                  className="text-muted hover:text-text transition-colors text-2xl leading-none pb-1"
                >
                  ×
                </button>
              </div>

              <ToyComponent />
              <p className="text-xs font-mono text-muted mt-3 text-center">{activeToy.hint}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
