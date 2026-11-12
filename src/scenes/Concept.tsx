import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CONFIG } from '../config';
import { ImageBg } from '../components/Background';
import { OutlinedText } from '../components/OutlinedText';
import { useLayout } from '../layout';

/** 3–8 s : la phrase concept, mot par mot, sur la capture en zoom lent (Ken Burns). */
export const Concept: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe, u, isVertical, H } = useLayout();
  const c = CONFIG.concept;
  const words = CONFIG.map.concept.split(' ');
  const size = isVertical ? 84 * u : 72 * u;
  const label = spring({ frame: frame - 4, fps, config: { damping: 12 } });

  return (
    <AbsoluteFill>
      <ImageBg image={c.image} zoomFrom={c.zoomFrom} zoomTo={c.zoomTo} panX={c.panX} panY={c.panY} />
      {/* dégradé pour la lisibilité du texte */}
      <AbsoluteFill
        style={{
          background: isVertical
            ? 'linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.25) 85%)'
            : 'linear-gradient(180deg, rgba(0,0,0,0) 35%, rgba(0,0,0,0.65) 85%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          width: safe.width,
          bottom: safe.bottom + (isVertical ? H * 0.04 : 0),
          display: 'flex',
          flexDirection: 'column',
          alignItems: isVertical ? 'center' : 'flex-start',
          gap: 24 * u,
        }}
      >
        <div
          style={{
            transform: `scale(${label}) rotate(-3deg)`,
            background: CONFIG.colors.gold,
            borderRadius: 20 * u,
            padding: `${8 * u}px ${28 * u}px`,
            border: `${5 * u}px solid black`,
          }}
        >
          <OutlinedText size={52 * u} color={CONFIG.colors.red} outline={0} style={{ textShadow: 'none' }}>
            LE CONCEPT
          </OutlinedText>
        </div>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: isVertical ? 'center' : 'flex-start',
            columnGap: size * 0.28,
            rowGap: size * 0.1,
          }}
        >
          {words.map((w, i) => {
            const s = spring({ frame: frame - 10 - i * 3, fps, config: { damping: 10, stiffness: 180 } });
            const clean = w.toLowerCase().replace(/[^\p{L}]/gu, '');
            const highlight = c.highlightWords.some((h) => clean.startsWith(h.toLowerCase()));
            return (
              <div
                key={i}
                style={{
                  opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: 'clamp' }),
                  transform: `translateY(${interpolate(s, [0, 1], [50 * u, 0])}px) scale(${interpolate(s, [0, 1], [1.6, 1])})`,
                }}
              >
                <OutlinedText size={size} color={highlight ? CONFIG.colors.gold : CONFIG.colors.snow}>
                  {w}
                </OutlinedText>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
