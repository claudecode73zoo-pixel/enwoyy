import React from 'react';
import {AbsoluteFill, random, useCurrentFrame} from 'remotion';
import {COLORS, HEIGHT, WIDTH} from '../constants';

/** Particules orange déterministes qui montent avec une légère dérive. */
export const Particles: React.FC<{count?: number}> = ({count = 70}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}).map((_, i) => {
        const r = (k: string) => random(`p-${i}-${k}`);
        const speed = 3 + r('s') * 9;
        const size = 4 + r('z') * 14;
        const y = (((r('y') * HEIGHT - frame * speed) % HEIGHT) + HEIGHT) % HEIGHT;
        const x = r('x') * WIDTH + Math.sin(frame / 14 + r('p') * 6) * 30;
        const tw = 0.6 + 0.3 * Math.sin(frame / 12 + r('t') * 9); // scintillement lent, sans clignotement
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: size,
              height: size * (1 + speed / 8),
              borderRadius: size,
              background: r('c') > 0.5 ? COLORS.orange : COLORS.orangeLight,
              opacity: tw,
              boxShadow: `0 0 ${size * 2}px ${COLORS.orange}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
