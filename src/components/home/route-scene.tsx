'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * The live hero scene: route lines tracing between hubs, with pulsing nodes.
 * Canvas 2D rather than WebGL so it costs a few kilobytes instead of a
 * hundred, and it still holds 60fps on mid-range phones. Pauses when the tab
 * is hidden and renders one static frame under prefers-reduced-motion.
 */

interface Node {
  x: number;
  y: number;
  label: string;
  hub: boolean;
}

// Normalised coordinates so the scene scales to any container.
const NODES: Node[] = [
  { x: 0.13, y: 0.34, label: 'Seattle', hub: false },
  { x: 0.1, y: 0.62, label: 'Los Angeles', hub: true },
  { x: 0.24, y: 0.48, label: 'Denver', hub: false },
  { x: 0.33, y: 0.72, label: 'Houston', hub: true },
  { x: 0.29, y: 0.28, label: 'Chicago', hub: true },
  { x: 0.42, y: 0.5, label: 'Atlanta', hub: false },
  { x: 0.45, y: 0.26, label: 'Toronto', hub: true },
  { x: 0.5, y: 0.38, label: 'New York', hub: false },
  { x: 0.66, y: 0.27, label: 'London', hub: true },
  { x: 0.72, y: 0.36, label: 'Frankfurt', hub: false },
  { x: 0.78, y: 0.2, label: 'Warsaw', hub: false },
  { x: 0.86, y: 0.74, label: 'Sydney', hub: true },
  { x: 0.8, y: 0.55, label: 'Lahore', hub: true },
];

const ROUTES: [number, number][] = [
  [1, 3], [3, 5], [5, 7], [7, 6], [6, 4], [4, 2], [2, 1],
  [3, 2], [7, 8], [8, 9], [9, 10], [8, 12], [12, 11], [0, 2], [0, 1], [5, 3],
];

interface Traveller {
  route: number;
  t: number;
  speed: number;
}

export function RouteScene({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let frame = 0;
    let running = true;

    const travellers: Traveller[] = ROUTES.map((_, i) => ({
      route: i,
      t: Math.random(),
      speed: 0.0016 + Math.random() * 0.0022,
    }));

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readToken = (name: string, fallback: string) => {
      const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      return v || fallback;
    };

    const px = (n: Node) => ({ x: n.x * width, y: n.y * height });

    const draw = (time: number) => {
      const accent = readToken('--accent', '255 122 26');
      const line = readToken('--line', '34 45 74');
      const fg = readToken('--fg-subtle', '120 132 163');

      ctx.clearRect(0, 0, width, height);

      // Latitude grid
      ctx.strokeStyle = `rgb(${line} / 0.4)`;
      ctx.lineWidth = 1;
      for (let i = 1; i < 7; i++) {
        const y = (height / 7) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Routes
      ctx.lineWidth = 1.2;
      for (const [a, b] of ROUTES) {
        const p1 = px(NODES[a]);
        const p2 = px(NODES[b]);
        ctx.strokeStyle = `rgb(${line} / 0.9)`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.quadraticCurveTo((p1.x + p2.x) / 2, (p1.y + p2.y) / 2 - height * 0.07, p2.x, p2.y);
        ctx.stroke();
      }

      // Travellers tracing each route
      if (!reduced) {
        for (const tr of travellers) {
          const [a, b] = ROUTES[tr.route];
          const p1 = px(NODES[a]);
          const p2 = px(NODES[b]);
          const cx = (p1.x + p2.x) / 2;
          const cy = (p1.y + p2.y) / 2 - height * 0.07;

          tr.t += tr.speed;
          if (tr.t > 1.25) tr.t = -0.25;

          const t = Math.max(0, Math.min(1, tr.t));
          const trailLength = 0.16;
          const t0 = Math.max(0, t - trailLength);

          const grad = ctx.createLinearGradient(
            quad(p1.x, cx, p2.x, t0),
            quad(p1.y, cy, p2.y, t0),
            quad(p1.x, cx, p2.x, t),
            quad(p1.y, cy, p2.y, t),
          );
          grad.addColorStop(0, `rgb(${accent} / 0)`);
          grad.addColorStop(1, `rgb(${accent} / 0.95)`);

          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.lineCap = 'round';
          ctx.beginPath();
          const steps = 18;
          for (let s = 0; s <= steps; s++) {
            const tt = t0 + ((t - t0) * s) / steps;
            const x = quad(p1.x, cx, p2.x, tt);
            const y = quad(p1.y, cy, p2.y, tt);
            if (s === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();

          // Leading dot
          if (t > 0 && t < 1) {
            ctx.fillStyle = `rgb(${accent})`;
            ctx.beginPath();
            ctx.arc(quad(p1.x, cx, p2.x, t), quad(p1.y, cy, p2.y, t), 2.4, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // Nodes
      for (const node of NODES) {
        const p = px(node);
        const r = node.hub ? 4 : 2.6;

        if (node.hub && !reduced) {
          const pulse = (Math.sin(time / 900 + node.x * 8) + 1) / 2;
          ctx.strokeStyle = `rgb(${accent} / ${0.08 + pulse * 0.2})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(p.x, p.y, r + 5 + pulse * 9, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = node.hub ? `rgb(${accent})` : `rgb(${fg} / 0.8)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fill();

        if (node.hub && width > 640) {
          ctx.fillStyle = `rgb(${fg} / 0.85)`;
          ctx.font = '500 10px ui-sans-serif, system-ui, sans-serif';
          ctx.fillText(node.label, p.x + 8, p.y + 3);
        }
      }

      if (running && !reduced) frame = requestAnimationFrame(draw);
    };

    resize();
    frame = requestAnimationFrame(draw);

    const onResize = () => {
      resize();
      if (reduced) draw(0);
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running && !reduced) frame = requestAnimationFrame(draw);
      else cancelAnimationFrame(frame);
    };

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduced]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      role="presentation"
    />
  );
}

function quad(p0: number, p1: number, p2: number, t: number) {
  const mt = 1 - t;
  return mt * mt * p0 + 2 * mt * t * p1 + t * t * p2;
}
