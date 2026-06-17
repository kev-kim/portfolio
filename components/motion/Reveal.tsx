"use client";

import { motion, useReducedMotion, useInView } from "framer-motion";
import { useRef } from "react";

const motionElements = {
  div: motion.div,
  li: motion.li,
} as const;

type RevealTag = keyof typeof motionElements;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: RevealTag;
};

export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const Tag = motionElements[as];

  return (
    <Tag
      ref={ref}
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </Tag>
  );
}
