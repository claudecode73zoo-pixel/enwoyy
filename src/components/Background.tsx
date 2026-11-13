import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {COLORS} from '../constants';
import {beatPulse} from '../utils';

/** Fond noir + halo dégradé orange qui pulse sur chaque temps. */
export const Background: React.FC<{intensity?: number; x?: number; y?: number}> = ({intensity = 1, x = 50, y = 62}) => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + 0.25 * beatPulse(frame);
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 75% 45% at ${x}% ${y}%, ${COLORS.orange} 0%, ${COLORS.orangeLight}55 38%, transparent 72%)`,
          opacity: pulse * intensity,
        }}
      />
    </AbsoluteFill>
  );
};
