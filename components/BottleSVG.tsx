import { useState, useEffect, useRef } from "react";

/* ─── Types ─── */
interface BottleProps {
  tilt?: { x: number; y: number };
  liquidLevel?: number;
  liquidColorA?: [number,number,number];
  liquidColorB?: [number,number,number];
  glowColor?: [number,number,number];
  glowOpacity?: number;
  rotateY?: number;
  particles?: string;
  scale?: number;
}

/* ─── Lerp utility ─── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * Math.max(0, Math.min(1, t));

export function BottleSVG({
  tilt = { x: 0, y: 0 },
  liquidLevel = 0.85,
  liquidColorA = [201, 169, 110],
  liquidColorB = [122, 80, 48],
  glowColor = [201, 169, 110],
  glowOpacity = 0.15,
  rotateY = 0,
  particles = "none",
  scale = 1,
}: BottleProps) {
  const bottleTop = 165;
  const bottleBottom = 405;
  const fillHeight = (bottleBottom - bottleTop) * liquidLevel;
  const fillY = bottleBottom - fillHeight;

  const liquidA = `rgba(${liquidColorA[0]},${liquidColorA[1]},${liquidColorA[2]},0.7)`;
  const liquidB = `rgba(${liquidColorB[0]},${liquidColorB[1]},${liquidColorB[2]},0.35)`;
  const glowRgb = `${glowColor[0]},${glowColor[1]},${glowColor[2]}`;

  const totalRotY = tilt.x * 12 + rotateY;
  const totalRotX = -tilt.y * 8;

  return (
    <svg
      viewBox="0 0 240 440"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: `perspective(1000px) rotateY(${totalRotY}deg) rotateX(${totalRotX}deg) scale(${scale})`,
        transition: "transform 0.15s ease-out",
        width: "100%",
        filter: `drop-shadow(0 0 50px rgba(${glowRgb},${glowOpacity * 0.8})) drop-shadow(0 0 100px rgba(${glowRgb},${glowOpacity * 0.5}))`,
      }}
    >
      <defs>
        <linearGradient id="sb-body" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d0b08" />
          <stop offset="15%" stopColor="#1e1810" />
          <stop offset="38%" stopColor={`rgba(${glowRgb},0.35)`} />
          <stop offset="55%" stopColor={`rgba(${glowRgb},0.25)`} />
          <stop offset="78%" stopColor="#1e1810" />
          <stop offset="100%" stopColor="#080706" />
        </linearGradient>
        <linearGradient id="sb-liquid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={liquidA} />
          <stop offset="100%" stopColor={liquidB} />
        </linearGradient>
        <linearGradient id="sb-neck" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0d0b08" />
          <stop offset="30%" stopColor={`rgba(${glowRgb},0.3)`} />
          <stop offset="70%" stopColor={`rgba(${glowRgb},0.2)`} />
          <stop offset="100%" stopColor="#080706" />
        </linearGradient>
        <linearGradient id="sb-cap" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`rgba(${glowRgb},1)`} />
          <stop offset="50%" stopColor={`rgba(${Math.min(255,glowColor[0]+40)},${Math.min(255,glowColor[1]+35)},${Math.min(255,glowColor[2]+30)},1)`} />
          <stop offset="100%" stopColor={`rgba(${Math.round(glowColor[0]*0.55)},${Math.round(glowColor[1]*0.55)},${Math.round(glowColor[2]*0.55)},1)`} />
        </linearGradient>
        <radialGradient id="sb-reflect" cx="28%" cy="18%" r="55%">
          <stop offset="0%" stopColor={`rgba(${glowRgb},0.28)`} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <radialGradient id="sb-inner-glow" cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor={`rgba(${glowRgb},0.18)`} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <filter id="sb-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <clipPath id="sb-bottle-clip">
          <path d="M 54 163 C 52 182 48 202 46 232 C 44 268 44 304 46 334 C 48 364 55 383 65 395 C 75 406 90 411 120 411 C 150 411 165 406 175 395 C 185 383 192 364 194 334 C 196 304 196 268 194 232 C 192 202 188 182 186 163 Z" />
        </clipPath>
      </defs>

      <ellipse cx="120" cy="430" rx="58" ry="5" fill="rgba(0,0,0,0.45)" />

      <path
        d="M 54 163 C 52 182 48 202 46 232 C 44 268 44 304 46 334 C 48 364 55 383 65 395 C 75 406 90 411 120 411 C 150 411 165 406 175 395 C 185 383 192 364 194 334 C 196 304 196 268 194 232 C 192 202 188 182 186 163 Z"
        fill="url(#sb-body)"
        stroke={`rgba(${glowRgb},0.18)`}
        strokeWidth="1"
      />

      {liquidLevel > 0.01 && (
        <g clipPath="url(#sb-bottle-clip)">
          <rect
            x="46" y={fillY} width="148" height={fillHeight + 2}
            fill="url(#sb-liquid)"
            style={{ transition: "y 0.6s cubic-bezier(0.22,1,0.36,1), height 0.6s cubic-bezier(0.22,1,0.36,1)" }}
          />
          <ellipse
            cx="120" cy={fillY}
            rx="72" ry="5"
            fill={liquidA}
            style={{ transition: "cy 0.6s cubic-bezier(0.22,1,0.36,1)" }}
          />
          <ellipse
            cx="95" cy={fillY + 12}
            rx="18" ry="3"
            fill={`rgba(${glowRgb},0.25)`}
          />
        </g>
      )}

      <path
        d="M 54 163 C 52 182 48 202 46 232 C 44 268 44 304 46 334 C 48 364 55 383 65 395 C 75 406 90 411 120 411 C 150 411 165 406 175 395 C 185 383 192 364 194 334 C 196 304 196 268 194 232 C 192 202 188 182 186 163 Z"
        fill="url(#sb-inner-glow)"
      />

      <path
        d="M 54 163 C 52 182 48 202 46 232 C 44 268 44 304 46 334 C 48 364 55 383 65 395 C 75 406 90 411 120 411 C 150 411 165 406 175 395 C 185 383 192 364 194 334 C 196 304 196 268 194 232 C 192 202 188 182 186 163 Z"
        fill="url(#sb-reflect)"
      />

      <line x1="54" y1="165" x2="54" y2="393" stroke={`rgba(${glowRgb},0.3)`} strokeWidth="1.8" filter="url(#sb-glow)" />

      <rect x="88" y="110" width="64" height="56" rx="3" fill="url(#sb-neck)" stroke={`rgba(${glowRgb},0.12)`} strokeWidth="1" />
      <path d="M 54 163 Q 88 155 88 163 L 152 163 Q 152 155 186 163 Z" fill={`rgba(${glowRgb},0.07)`} />

      <rect x="92" y="58" width="56" height="54" rx="3" fill="url(#sb-cap)" />
      <rect x="94" y="60" width="26" height="50" rx="2" fill="rgba(255,255,255,0.07)" />
      <rect x="90" y="104" width="60" height="7" rx="1" fill={`rgba(${glowRgb},0.75)`} />
      <rect x="90" y="109" width="60" height="2" fill="rgba(255,255,255,0.12)" />
      <rect x="96" y="50" width="48" height="12" rx="2" fill={`rgba(${glowRgb},0.9)`} />
      <rect x="112" y="42" width="16" height="12" rx="1" fill={`rgba(${glowRgb},0.8)`} />

      <rect x="68" y="234" width="104" height="82" rx="1" fill="transparent" stroke={`rgba(${glowRgb},0.15)`} strokeWidth="0.5" />
      <line x1="72" y1="248" x2="168" y2="248" stroke={`rgba(${glowRgb},0.1)`} strokeWidth="0.5" />
      <line x1="72" y1="304" x2="168" y2="304" stroke={`rgba(${glowRgb},0.1)`} strokeWidth="0.5" />
      <text x="120" y="272" textAnchor="middle" fill={`rgba(${glowRgb},0.7)`} fontSize="9" fontFamily="'Playfair Display', serif" letterSpacing="3" fontStyle="italic">NOCTIS</text>
      <text x="120" y="288" textAnchor="middle" fill={`rgba(${glowRgb},0.4)`} fontSize="5.5" fontFamily="'Space Mono', monospace" letterSpacing="4">MAISON AURORE</text>
      <text x="120" y="299" textAnchor="middle" fill={`rgba(${glowRgb},0.28)`} fontSize="4.5" fontFamily="'Space Mono', monospace" letterSpacing="3">PARIS · 50 ML</text>

      {particles === "pepper" && (
        <g opacity="0.55">
          {[[36, 190, 3.5], [198, 210, 2.5], [30, 280, 2], [205, 320, 3], [42, 370, 2.5]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={`rgba(${glowRgb},0.6)`} />
          ))}
        </g>
      )}
      {particles === "rose" && (
        <g opacity="0.4">
          {[[35, 200], [202, 230], [28, 310], [208, 280], [40, 380]].map(([x, y], i) => (
            <ellipse key={i} cx={x} cy={y} rx={6} ry={3} fill={`rgba(180,70,90,0.5)`} transform={`rotate(${i * 36} ${x} ${y})`} />
          ))}
        </g>
      )}
      {particles === "oud" && (
        <g opacity="0.35">
          {[[32, 220, 4, 2], [204, 260, 6, 2], [30, 330, 5, 3], [206, 370, 4, 2]].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} fill={`rgba(120,70,20,0.6)`} transform={`rotate(${i * 20} ${x} ${y})`} />
          ))}
        </g>
      )}
      {particles === "gold" && (
        <g>
          {[[34, 195, 1.5], [202, 215, 1], [26, 285, 2], [208, 305, 1.5], [36, 365, 1], [206, 390, 2]].map(([x, y, r], i) => (
            <circle key={i} cx={x} cy={y} r={r} fill={`rgba(${glowRgb},0.9)`} filter="url(#sb-glow)" />
          ))}
        </g>
      )}
    </svg>
  );
}
