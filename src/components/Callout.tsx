import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {COLORS, MONO_FAMILY, SAFE} from '../constants';
import {easeOut} from '../utils';

type Props = {
  /** Centre de l'anneau (le détail pointé). */
  x: number;
  y: number;
  text: string;
  start?: number;
  /** Côté de l'écran où s'ancre l'étiquette (toujours dans la zone sûre). */
  side?: 'left' | 'right';
  /** Hauteur de l'étiquette par rapport à l'anneau. */
  dy?: number;
};

const FONT = 26;
const SPACING = 4;
const PAD = 18;
const R = 44;

/** Repère technique : anneau sur le détail, trait coudé et étiquette ancrée au bord de la zone sûre. */
export const Callout: React.FC<Props> = ({x, y, text, start = 0, side = 'right', dy = -200}) => {
  const frame = useCurrentFrame();
  const p = (a: number, b: number) =>
    interpolate(frame, [start + a, start + b], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: easeOut});
  const ring = p(0, 8);
  const line = p(4, 14);
  const tag = p(11, 18);

  const s = side === 'right' ? 1 : -1;
  const labelW = text.length * (FONT * 0.612 + SPACING) + PAD * 2; // Space Mono : chasse fixe de 0,612 em
  const labelLeft = side === 'right' ? SAFE.right - labelW : SAFE.left;
  const hx = side === 'right' ? labelLeft - 8 : labelLeft + labelW + 8; // fin du trait horizontal
  const ex = hx - 56 * s; // coude
  const ey = y + dy;
  const k = R / Math.hypot(ex - x, ey - y);
  const sx = x + (ex - x) * k;
  const sy = y + (ey - y) * k;
  const len = Math.hypot(ex - sx, ey - sy) + 56;
  const C = 2 * Math.PI * R;
  return (
    <>
      <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.7))'}}>
        <circle
          cx={x}
          cy={y}
          r={R}
          fill="none"
          stroke={COLORS.white}
          strokeWidth={4}
          strokeDasharray={C}
          strokeDashoffset={C * (1 - ring)}
          transform={`rotate(-90 ${x} ${y})`}
        />
        <circle cx={x} cy={y} r={7 * ring} fill={COLORS.white} />
        <polyline
          points={`${sx},${sy} ${ex},${ey} ${hx},${ey}`}
          fill="none"
          stroke={COLORS.white}
          strokeWidth={4}
          strokeLinejoin="round"
          strokeDasharray={len}
          strokeDashoffset={len * (1 - line)}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          left: labelLeft,
          top: ey - (FONT + 28) / 2,
          width: labelW,
          boxSizing: 'border-box',
          opacity: tag,
          transform: `translateX(${(1 - tag) * 16 * s}px)`,
          fontFamily: MONO_FAMILY,
          fontSize: FONT,
          letterSpacing: SPACING,
          lineHeight: 1,
          whiteSpace: 'nowrap',
          textAlign: 'center',
          color: COLORS.black,
          background: COLORS.gradient,
          padding: `14px ${PAD}px`,
          borderRadius: 6,
          boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
        }}
      >
        {text}
      </div>
    </>
  );
};
