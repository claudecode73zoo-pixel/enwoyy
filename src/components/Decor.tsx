import React from 'react';
import { AbsoluteFill, random, useCurrentFrame, useVideoConfig } from 'remotion';
import { CONFIG } from '../config';
import { useLayout } from '../layout';

/** Neige qui tombe en continu (déterministe : même rendu à chaque fois). */
export const Snow: React.FC<{ count?: number; seed?: string }> = ({ count, seed = 'snow' }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, u, isVertical } = useLayout();
  const n = count ?? Math.round(CONFIG.decor.snowflakes * (isVertical ? 1 : 1.2));
  const t = frame / fps;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(n).fill(0).map((_, i) => {
        const depth = random(`${seed}-d-${i}`); // 0 = loin, 1 = proche
        const size = (4 + depth * 14) * u;
        const speed = (60 + depth * 160) * u; // px / s
        const x0 = random(`${seed}-x-${i}`) * W;
        const y0 = random(`${seed}-y-${i}`) * (H + 100);
        const y = ((y0 + t * speed) % (H + 60 * u)) - 30 * u;
        const sway = Math.sin(t * (0.8 + depth) + i) * 25 * u;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x0 + sway,
              top: y,
              width: size,
              height: size,
              borderRadius: '50%',
              background: 'white',
              opacity: 0.45 + depth * 0.5,
              filter: depth < 0.3 ? `blur(${1.5 * u}px)` : undefined,
              boxShadow: `0 0 ${size}px rgba(255,255,255,0.6)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

const Star: React.FC<{ size: number; color: string }> = ({ size, color }) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={{ overflow: 'visible' }}>
    <path
      d="M0,-50 C6,-10 10,-6 50,0 C10,6 6,10 0,50 C-6,10 -10,6 -50,0 C-10,-6 -6,-10 0,-50 Z"
      fill={color}
      style={{ filter: `drop-shadow(0 0 12px ${color})` }}
    />
  </svg>
);

/** Étoiles dorées qui scintillent, placées en périphérie (pas au centre du texte). */
export const Sparkles: React.FC<{ seed?: string }> = ({ seed = 'spark' }) => {
  const frame = useCurrentFrame();
  const { W, H, u } = useLayout();
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {new Array(CONFIG.decor.sparkles).fill(0).map((_, i) => {
        const side = random(`${seed}-s-${i}`) > 0.5;
        const x = side ? random(`${seed}-x-${i}`) * W * 0.22 : W - random(`${seed}-x-${i}`) * W * 0.22;
        const y = random(`${seed}-y-${i}`) * H;
        const period = 25 + random(`${seed}-p-${i}`) * 35;
        const phase = random(`${seed}-ph-${i}`) * period;
        const k = Math.sin(((frame + phase) / period) * Math.PI * 2);
        const s = Math.max(0, k) * (26 + random(`${seed}-z-${i}`) * 30) * u;
        return (
          <div key={i} style={{ position: 'absolute', left: x - s / 2, top: y - s / 2, transform: `rotate(${frame * 2}deg)` }}>
            {s > 1 ? <Star size={s} color={i % 3 === 0 ? CONFIG.colors.snow : CONFIG.colors.gold} /> : null}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

/** Guirlande lumineuse qui pend en haut de l'écran, ampoules qui clignotent. */
export const Garland: React.FC = () => {
  const frame = useCurrentFrame();
  const { W, u } = useLayout();
  if (!CONFIG.decor.garland) return null;
  const sag = 55 * u;
  const bulbs = Math.round(W / (70 * u));
  const colors = [CONFIG.colors.red, CONFIG.colors.gold, '#2ECC71', '#4FC3F7'];
  const yAt = (x: number) => 8 * u + sag * Math.sin((x / W) * Math.PI);
  const path = new Array(41)
    .fill(0)
    .map((_, i) => `${i === 0 ? 'M' : 'L'}${(i / 40) * W},${yAt((i / 40) * W)}`)
    .join(' ');
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width={W} height={sag + 60 * u} style={{ position: 'absolute', top: 0, left: 0 }}>
        <path d={path} stroke="#0E3B12" strokeWidth={5 * u} fill="none" />
        {new Array(bulbs).fill(0).map((_, i) => {
          const x = ((i + 0.5) / bulbs) * W;
          const y = yAt(x) + 14 * u;
          const on = Math.floor(frame / 8 + i) % 3 !== 0;
          const c = colors[i % colors.length];
          return (
            <g key={i} transform={`rotate(${Math.sin(i) * 12} ${x} ${y - 14 * u})`}>
              <rect x={x - 5 * u} y={y - 16 * u} width={10 * u} height={8 * u} fill="#333" rx={2 * u} />
              <ellipse
                cx={x}
                cy={y}
                rx={10 * u}
                ry={15 * u}
                fill={c}
                opacity={on ? 1 : 0.35}
                style={{ filter: on ? `drop-shadow(0 0 ${10 * u}px ${c})` : undefined }}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
