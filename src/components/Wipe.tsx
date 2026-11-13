import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {COLORS, HEIGHT, WIDTH} from '../constants';
import {easeInOut} from '../utils';

/** Balayage orange en biais qui traverse l'écran, centré sur la frame `at`. */
export const Wipe: React.FC<{at: number; length?: number}> = ({at, length = 10}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [at - length / 2, at + length / 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });
  if (t <= 0 || t >= 1) return null;
  const w = WIDTH * 1.6;
  const x = interpolate(t, [0, 1], [-w, WIDTH + w * 0.3]);
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: -200,
          height: HEIGHT + 400,
          width: w,
          left: x,
          background: COLORS.gradient,
          transform: 'skewX(-18deg)',
          filter: 'blur(6px)',
          boxShadow: `0 0 120px ${COLORS.orange}`,
        }}
      />
    </AbsoluteFill>
  );
};
