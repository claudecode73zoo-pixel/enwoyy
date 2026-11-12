import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CONFIG } from '../config';
import { ImageBg } from '../components/Background';
import { OutlinedText, fitFontSize } from '../components/OutlinedText';
import { useLayout } from '../layout';

/** 0–3 s : gros titre qui rebondit lettre par lettre + sous-titre. */
export const Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe, u, isVertical } = useLayout();
  const words = CONFIG.map.name.split(' ');
  const longest = words.reduce((m, w) => (w.length > m.length ? w : m), '');
  const titleSize = fitFontSize(longest, safe.width * 0.88, isVertical ? 240 * u : 200 * u, 0.68);

  let letterIndex = 0;
  const sub = spring({ frame: frame - 18, fps, config: { damping: 11, stiffness: 120 } });
  const wobble = Math.sin(frame / 6) * 2;

  return (
    <AbsoluteFill>
      <ImageBg
        image={CONFIG.hook.background.image}
        blur={14 * u}
        zoomFrom={1.15}
        zoomTo={1.3}
        tint={`radial-gradient(circle at 50% 45%, rgba(214,40,40,0.55), rgba(11,36,16,0.92) 70%)`}
      />
      <div
        style={{
          position: 'absolute',
          left: safe.left,
          top: safe.top,
          width: safe.width,
          height: safe.height,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 30 * u,
        }}
      >
        <div style={{ transform: `rotate(${-4 + wobble * 0.3}deg)`, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {words.map((word, wi) => (
            <div key={wi} style={{ display: 'flex' }}>
              {word.split('').map((ch, ci) => {
                const delay = letterIndex++ * 2;
                const s = spring({ frame: frame - delay, fps, config: { damping: 7, stiffness: 160, mass: 0.6 } });
                const y = interpolate(s, [0, 1], [-600 * u, 0]);
                const sq = interpolate(s, [0, 0.9, 1, 1.1], [1, 1, 1, 0.85], { extrapolateRight: 'clamp' });
                return (
                  <div key={ci} style={{ transform: `translateY(${y}px) scaleY(${sq})`, opacity: s > 0.01 ? 1 : 0 }}>
                    <OutlinedText
                      size={titleSize}
                      color={(wi + ci) % 2 === 0 ? CONFIG.colors.snow : CONFIG.colors.gold}
                    >
                      {ch}
                    </OutlinedText>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(sub, [0, 1], [120 * u, 0])}px) scale(${interpolate(sub, [0, 1], [0.6, 1])})`,
            opacity: sub,
            background: CONFIG.colors.red,
            border: `${6 * u}px solid ${CONFIG.colors.gold}`,
            borderRadius: 30 * u,
            padding: `${14 * u}px ${36 * u}px`,
            boxShadow: `0 ${10 * u}px 0 rgba(0,0,0,0.5)`,
          }}
        >
          <OutlinedText size={fitFontSize(CONFIG.map.tagline, safe.width * 0.85, 80 * u, 0.5)}>
            {CONFIG.map.tagline}
          </OutlinedText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
