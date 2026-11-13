import React from 'react';
import {Easing, interpolate, random, useCurrentFrame} from 'remotion';
import {BEAT, COLORS, HEIGHT, WIDTH} from '../constants';

const LINES = 13;
const STEP = 18;

type Props = {
  /** true : les lignes traversent l'écran puis disparaissent ; false : elles restent en place. */
  passThrough?: boolean;
  /** Multiplicateur d'amplitude (1 = normal). */
  amplitude?: number;
  id: string;
};

/** Lignes orange ondulées, rappel des nervures de la TN. */
export const WaveLines: React.FC<Props> = ({passThrough = true, amplitude = 1, id}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', filter: `drop-shadow(0 0 18px ${COLORS.orange})`}}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor={COLORS.orange} />
          <stop offset="1" stopColor={COLORS.orangeLight} />
        </linearGradient>
      </defs>
      {Array.from({length: LINES}).map((_, i) => {
        const baseY = HEIGHT * 0.12 + (i / (LINES - 1)) * HEIGHT * 0.76;
        const delay = Math.floor(random(`d${i}`) * 3) * BEAT * 0.3;
        const dir = i % 2 === 0 ? 1 : -1;
        // départ rapide (les lignes sont à l'écran dès les premières images), puis ralentissement
        const head = interpolate(frame, [delay, delay + BEAT * 3], [-100, WIDTH + 900], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        const trail = passThrough ? 700 + random(`t${i}`) * 500 : Infinity;
        const amp = (50 + random(`a${i}`) * 70) * amplitude;
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
            stroke={`url(#${id})`}
            strokeWidth={7 + (i % 3)}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        );
      })}
    </svg>
  );
};
