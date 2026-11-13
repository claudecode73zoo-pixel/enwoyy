import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {BEAT, COLORS, HEIGHT, WIDTH} from '../constants';
import {beatPulse, easeInOut} from '../utils';

const LINES = 13;
const STEP = 18;

/** 0-2s : lignes orange ondulées (nervures de la TN) qui traversent l'écran. */
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = beatPulse(frame);
  // Les lignes se resserrent légèrement vers le flash (frame 60)
  const squeeze = interpolate(frame, [BEAT * 3, BEAT * 4], [1, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', filter: `drop-shadow(0 0 18px ${COLORS.orange})`}}>
        <defs>
          <linearGradient id="ln" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor={COLORS.orange} />
            <stop offset="1" stopColor={COLORS.orangeLight} />
          </linearGradient>
        </defs>
        {Array.from({length: LINES}).map((_, i) => {
          const baseY = HEIGHT * 0.12 + (i / (LINES - 1)) * HEIGHT * 0.76;
          const delay = Math.floor(random(`d${i}`) * 3) * BEAT * 0.5;
          const dir = i % 2 === 0 ? 1 : -1;
          const head = interpolate(frame, [delay, delay + BEAT * 3.2], [-200, WIDTH + 700], {
            extrapolateRight: 'clamp',
            easing: easeInOut,
          });
          const trail = 500 + random(`t${i}`) * 400;
          const amp = (50 + random(`a${i}`) * 70) * squeeze * (1 + pulse * 0.25);
          const k = 0.008 + random(`k${i}`) * 0.006;
          const phase = frame * 0.22 * dir + i;
          const pts: string[] = [];
          for (let x = -40; x <= WIDTH + 40; x += STEP) {
            const pos = dir === 1 ? x : WIDTH - x; // sens de balayage alterné
            if (pos > head || pos < head - trail) continue;
            const y = baseY + Math.sin(x * k + phase) * amp + Math.sin(x * k * 2.3 - phase) * amp * 0.3;
            pts.push(`${pts.length ? 'L' : 'M'}${x},${y.toFixed(1)}`);
          }
          if (pts.length < 2) return null;
          return (
            <path
              key={i}
              d={pts.join(' ')}
              fill="none"
              stroke="url(#ln)"
              strokeWidth={5 + pulse * 5 + (i % 3)}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};
