import React from 'react';
import { CONFIG } from '../config';

const EMOJI = /(\p{Extended_Pictographic}(?:️|‍\p{Extended_Pictographic})*)/u;

/**
 * Texte « style trailer » : police Lilita One, blanc, gros contour noir + ombre portée.
 * Les emojis sont rendus sans contour pour rester propres.
 */
export const OutlinedText: React.FC<{
  children: string;
  size: number;
  color?: string;
  style?: React.CSSProperties;
  outline?: number;
}> = ({ children, size, color = CONFIG.colors.snow, style, outline }) => {
  const stroke = outline ?? Math.max(3, size * CONFIG.font.outlineRatio);
  const shadow = Math.max(3, size * 0.06);
  const parts = children.split(EMOJI).filter((p) => p.length > 0);
  return (
    <div
      style={{
        fontFamily: `'${CONFIG.font.family}', sans-serif`,
        fontSize: size,
        lineHeight: 1.05,
        color,
        WebkitTextStroke: `${stroke}px ${CONFIG.colors.outline}`,
        paintOrder: 'stroke fill',
        textShadow: `0 ${shadow}px 0 ${CONFIG.colors.outline}, 0 ${shadow * 1.6}px ${shadow * 2}px rgba(0,0,0,0.55)`,
        textAlign: 'center',
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {parts.map((p, i) =>
        EMOJI.test(p) ? (
          <span
            key={i}
            style={{ WebkitTextStroke: 0, textShadow: `0 ${shadow}px ${shadow}px rgba(0,0,0,0.5)` }}
          >
            {p}
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        ),
      )}
    </div>
  );
};

let ctx: CanvasRenderingContext2D | null = null;

/**
 * Taille de police qui fait tenir `text` sur une ligne de `maxWidth` px, mesurée avec la vraie police
 * (repli sur une approximation de `charWidth` em/caractère si le canvas n'est pas dispo).
 */
export const fitFontSize = (text: string, maxWidth: number, maxSize: number, charWidth = 0.56) => {
  if (typeof document !== 'undefined') {
    ctx = ctx ?? document.createElement('canvas').getContext('2d');
    if (ctx) {
      ctx.font = `100px '${CONFIG.font.family}'`;
      const w = ctx.measureText(text).width;
      // + marge pour le contour noir
      if (w > 0) return Math.min(maxSize, (maxWidth / (w / 100)) * 0.92);
    }
  }
  return Math.min(maxSize, maxWidth / (Math.max(1, text.length) * charWidth));
};
