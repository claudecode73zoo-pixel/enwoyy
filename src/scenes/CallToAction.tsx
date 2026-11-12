import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CONFIG } from '../config';
import { ImageBg } from '../components/Background';
import { OutlinedText, fitFontSize } from '../components/OutlinedText';
import { useLayout } from '../layout';

const Rays: React.FC<{ size: number; rotation: number }> = ({ size, rotation }) => (
  <svg
    width={size}
    height={size}
    viewBox="-100 -100 200 200"
    style={{ position: 'absolute', left: '50%', top: '50%', marginLeft: -size / 2, marginTop: -size / 2, transform: `rotate(${rotation}deg)` }}
  >
    {new Array(16).fill(0).map((_, i) => {
      const a = (i / 16) * Math.PI * 2;
      const b = a + Math.PI / 32;
      const c = a - Math.PI / 32;
      return (
        <path
          key={i}
          d={`M0,0 L${Math.cos(b) * 100},${Math.sin(b) * 100} L${Math.cos(c) * 100},${Math.sin(c) * 100} Z`}
          fill={i % 2 ? 'rgba(255,195,0,0.35)' : 'rgba(255,255,255,0.18)'}
        />
      );
    })}
  </svg>
);

/** 25–30 s : code de l'île en très grand + « Joue maintenant ! » + « Ajoute en favori ». */
export const CallToAction: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { safe, u, isVertical, W, H } = useLayout();
  const s1 = spring({ frame, fps, config: { damping: 9, stiffness: 140 } });
  const s2 = spring({ frame: frame - 8, fps, config: { damping: 8, stiffness: 120 } });
  const s3 = spring({ frame: frame - 22, fps, config: { damping: 10 } });
  const pulse = 1 + Math.sin(frame / 5) * 0.03;
  const code = CONFIG.map.islandCode;
  const codeSize = fitFontSize(code, safe.width - 92 * u, isVertical ? 220 * u : 200 * u, 0.66);

  return (
    <AbsoluteFill>
      <ImageBg
        image={CONFIG.cta.background.image}
        blur={16 * u}
        zoomFrom={1.2}
        zoomTo={1.3}
        tint="radial-gradient(circle at 50% 50%, rgba(214,40,40,0.85), rgba(80,10,10,0.95) 75%)"
      />
      <div style={{ position: 'absolute', left: safe.left, top: safe.top, width: safe.width, height: safe.height }}>
        <Rays size={Math.max(W, H) * 1.4} rotation={frame * 0.6} />
      </div>
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
          gap: (isVertical ? 60 : 36) * u,
        }}
      >
        <div style={{ transform: `scale(${s1}) rotate(-4deg)` }}>
          <OutlinedText size={fitFontSize(CONFIG.cta.playNow, safe.width * 0.92, (isVertical ? 130 : 120) * u, 0.55)}>
            {CONFIG.cta.playNow}
          </OutlinedText>
        </div>
        <div
          style={{
            transform: `scale(${interpolate(s2, [0, 1], [0.2, 1]) * pulse})`,
            opacity: Math.min(1, s2 * 2),
            background: 'white',
            borderRadius: 40 * u,
            border: `${10 * u}px solid ${CONFIG.colors.gold}`,
            boxShadow: `0 ${14 * u}px 0 rgba(0,0,0,0.5), 0 0 ${80 * u}px rgba(255,195,0,0.8)`,
            padding: `${22 * u}px ${30 * u}px ${30 * u}px`,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6 * u,
          }}
        >
          <OutlinedText size={(isVertical ? 52 : 46) * u} color={CONFIG.colors.green} outline={0} style={{ textShadow: 'none' }}>
            {CONFIG.cta.codeLabel}
          </OutlinedText>
          <OutlinedText size={codeSize} color={CONFIG.colors.red} outline={codeSize * 0.07} style={{ whiteSpace: 'nowrap' }}>
            {code}
          </OutlinedText>
        </div>
        <div
          style={{
            transform: `translateY(${interpolate(s3, [0, 1], [80 * u, 0])}px) rotate(${Math.sin(frame / 7) * 2}deg)`,
            opacity: s3,
            background: CONFIG.colors.green,
            borderRadius: 999,
            border: `${6 * u}px solid ${CONFIG.colors.gold}`,
            padding: `${14 * u}px ${44 * u}px`,
          }}
        >
          <OutlinedText size={(isVertical ? 76 : 64) * u}>{CONFIG.cta.favorite}</OutlinedText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
