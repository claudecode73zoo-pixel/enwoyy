import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, FONT_FAMILY, MONO_FAMILY, WIDTH} from '../constants';
import {easeOut} from '../utils';

/** Petite légende en chasse fixe, tapée lettre par lettre. */
export const Label: React.FC<{
  text: string;
  start?: number;
  size?: number;
  color?: string;
  style?: React.CSSProperties;
}> = ({text, start = 0, size = 28, color = COLORS.orangeLight, style}) => {
  const frame = useCurrentFrame();
  const chars = Math.floor(
    interpolate(frame, [start, start + text.length / 2], [0, text.length], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }),
  );
  return (
    <div
      style={{
        fontFamily: MONO_FAMILY,
        fontSize: size,
        letterSpacing: size * 0.24,
        color,
        whiteSpace: 'pre',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {/* le texte complet réserve la place : pas de saut de mise en page pendant la frappe */}
      <span>{text.slice(0, chars)}</span>
      <span style={{opacity: 0}}>{text.slice(chars)}</span>
    </div>
  );
};

/** Filet orange qui se trace de gauche à droite. */
export const Rule: React.FC<{start?: number; width: number; style?: React.CSSProperties}> = ({start = 0, width, style}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [start, start + 14], [0, width], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeOut,
  });
  return <div style={{height: 4, width: w, background: COLORS.gradient, borderRadius: 2, ...style}} />;
};

/** Ligne de texte géant répété, au contour seul, qui défile lentement. */
export const OutlineRow: React.FC<{text: string; y: number; size: number; speed: number; opacity?: number}> = ({
  text,
  y,
  size,
  speed,
  opacity = 0.42,
}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: speed > 0 ? -1400 : 0,
        whiteSpace: 'nowrap',
        transform: `translateX(${frame * speed}px)`,
        fontFamily: FONT_FAMILY,
        fontSize: size,
        lineHeight: 1,
        letterSpacing: size * 0.03,
        color: 'transparent',
        WebkitTextStroke: `3px ${COLORS.orange}`,
        opacity,
      }}
    >
      {Array.from({length: 10})
        .map(() => text)
        .join('  —  ')}
    </div>
  );
};

/** Bandeau incliné façon ruban, avec texte répété qui défile. */
export const Tape: React.FC<{
  text: string;
  y: number;
  angle: number;
  speed: number;
  variant?: 'solid' | 'dark';
}> = ({text, y, angle, speed, variant = 'solid'}) => {
  const frame = useCurrentFrame();
  const solid = variant === 'solid';
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: -WIDTH * 0.4,
        width: WIDTH * 1.8,
        height: 104,
        overflow: 'hidden',
        transform: `rotate(${angle}deg)`,
        background: solid ? COLORS.gradient : COLORS.black,
        borderTop: solid ? 'none' : `3px solid ${COLORS.orange}`,
        borderBottom: solid ? 'none' : `3px solid ${COLORS.orange}`,
        boxShadow: solid ? `0 0 50px ${COLORS.orange}66` : 'none',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          whiteSpace: 'nowrap',
          marginLeft: speed > 0 ? -1600 : 0,
          transform: `translateX(${frame * speed}px)`,
          fontFamily: FONT_FAMILY,
          fontSize: 62,
          letterSpacing: 5,
          color: solid ? COLORS.black : COLORS.orangeLight,
        }}
      >
        {Array.from({length: 14})
          .map(() => text)
          .join('   •   ')}
      </div>
    </div>
  );
};
