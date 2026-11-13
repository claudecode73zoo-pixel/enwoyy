import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {COLORS, HEIGHT, WIDTH} from '../constants';

/** Nappes de lumière orange qui dérivent lentement : donne de la profondeur au fond noir. */
export const Smoke: React.FC<{seed?: string; opacity?: number; count?: number}> = ({seed = 's', opacity = 1, count = 4}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity, pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const r = (k: string) => random(`${seed}-${i}-${k}`);
        const size = 700 + r('z') * 700;
        const x = r('x') * WIDTH + Math.sin(frame / 70 + r('p') * 6) * 90;
        const y = HEIGHT * (0.15 + r('y') * 0.7) + Math.cos(frame / 90 + r('q') * 6) * 70;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x - size / 2,
              top: y - size / 2,
              width: size,
              height: size,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${i % 2 ? COLORS.orange : COLORS.red}30 0%, ${COLORS.orange}10 45%, transparent 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Assombrit les bords pour concentrer le regard sur la paire. */
export const Vignette: React.FC<{strength?: number}> = ({strength = 0.62}) => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background: `radial-gradient(ellipse 78% 62% at 50% 46%, transparent 50%, rgba(0,0,0,${strength}) 100%)`,
    }}
  />
);

/** Lignes de sol en perspective, sous l'horizon, qui avancent lentement vers la caméra. */
export const FloorLines: React.FC<{horizon: number; opacity?: number}> = ({horizon, opacity = 1}) => {
  const frame = useCurrentFrame();
  const phase = (frame / 60) % 1;
  return (
    <AbsoluteFill style={{pointerEvents: 'none', opacity}}>
      {Array.from({length: 9}).map((_, k) => {
        const d = k + phase; // profondeur : 0 = horizon
        const y = horizon + 10 * d ** 1.95;
        const fadeIn = Math.min(1, d / 1.2);
        const fadeOut = Math.max(0, 1 - d / 9);
        return (
          <div
            key={k}
            style={{
              position: 'absolute',
              left: 0,
              top: y,
              width: WIDTH,
              height: 2,
              background: `linear-gradient(90deg, transparent 0%, ${COLORS.orange} 50%, transparent 100%)`,
              opacity: 0.4 * fadeIn * fadeOut,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
