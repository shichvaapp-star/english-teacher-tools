"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiProps {
  active?: boolean;
  durationMs?: number;
  onComplete?: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  vRotation: number;
  opacity: number;
  shape: "rect" | "circle";
}

const CONFETTI_COLORS = [
  "#3b82f6", // vibrant blue
  "#10b981", // emerald green
  "#f59e0b", // warm amber
  "#ec4899", // pink
  "#8b5cf6", // purple
  "#06b6d4", // cyan
  "#f97316", // orange
  "#eab308", // gold
];

export function Confetti({ active = true, durationMs = 4000, onComplete }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    const startTime = performance.now();
    const count = 130;
    const particles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const originX = width * (0.2 + Math.random() * 0.6);
      const originY = height * (0.35 + Math.random() * 0.25);

      particles.push({
        x: originX,
        y: originY,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 15 - 5,
        size: Math.random() * 8 + 5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 14,
        opacity: 1,
        shape: Math.random() > 0.35 ? "rect" : "circle",
      });
    }

    const render = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed > durationMs) {
        ctx.clearRect(0, 0, width, height);
        if (onComplete) onComplete();
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const progress = elapsed / durationMs;
      const fadeStart = 0.65;
      const globalAlpha = progress > fadeStart ? Math.max(0, 1 - (progress - fadeStart) / (1 - fadeStart)) : 1;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.38; // gravity
        p.vx *= 0.985; // air drag
        p.rotation += p.vRotation;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity * globalAlpha);
        ctx.fillStyle = p.color;

        if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, durationMs, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
    />
  );
}
