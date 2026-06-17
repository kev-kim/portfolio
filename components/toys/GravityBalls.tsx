"use client";

import { useEffect, useRef, useCallback } from "react";

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  color: string;
  life: number;
  maxLife: number;
};

const COLORS = ["#7bc9a9", "#5bb393", "#9fd8c4", "#3d9a7a", "#b8e8d8"];

export function GravityBalls() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const animRef = useRef<number>(0);

  const spawnBalls = useCallback((x: number, y: number) => {
    for (let i = 0; i < 5; i++) {
      ballsRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 6,
        vy: -Math.random() * 5 - 1,
        r: Math.random() * 8 + 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 1,
        maxLife: 220 + Math.random() * 120,
      });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = canvas.width;
    const H = canvas.height;

    function tick() {
      ctx.clearRect(0, 0, W, H);
      ballsRef.current = ballsRef.current.filter((b) => b.life > 0.02);

      for (const b of ballsRef.current) {
        b.vy += 0.2;
        b.vx *= 0.998;
        b.x += b.vx;
        b.y += b.vy;

        if (b.x - b.r < 0) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.7; }
        if (b.x + b.r > W) { b.x = W - b.r; b.vx = -Math.abs(b.vx) * 0.7; }
        if (b.y + b.r >= H) { b.y = H - b.r; b.vy = -Math.abs(b.vy) * 0.55; b.vx *= 0.88; }

        b.life -= 1 / b.maxLife;

        ctx.globalAlpha = Math.max(0, b.life);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const handlePointer = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const scaleX = e.currentTarget.width / rect.width;
      const scaleY = e.currentTarget.height / rect.height;
      spawnBalls((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
    },
    [spawnBalls]
  );

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      onPointerDown={handlePointer}
      className="w-full rounded-sm cursor-crosshair"
      style={{ touchAction: "none" }}
    />
  );
}
