import React from 'react';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {COLORS, FONT_FAMILY} from '../constants';

type Props = {
  text: string;
  start?: number;
  size: number;
  stagger?: number;
  color?: string;
  gradient?: boolean;
  style?: React.CSSProperties;
};

/** Texte animé lettre par lettre (spring + flou + montée). */
export const Letters: React.FC<Props> = ({text, start = 0, size, stagger = 2, color = COLORS.white, gradient, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        fontFamily: FONT_FAMILY,
        fontSize: size,
        lineHeight: 1,
        textTransform: 'uppercase',
        letterSpacing: size * 0.02,
        whiteSpace: 'pre',
        ...style,
      }}
    >
      {text.split('').map((ch, i) => {
        const s = spring({frame: frame - start - i * stagger, fps, config: {damping: 11, stiffness: 220}});
        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              opacity: Math.min(1, s * 3),
              transform: `translateY(${(1 - s) * 140}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * 8}deg)`,
              filter: `blur(${(1 - s) * 14}px)`,
              ...(gradient
                ? {backgroundImage: COLORS.gradient, WebkitBackgroundClip: 'text', color: 'transparent'}
                : {color}),
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
};
