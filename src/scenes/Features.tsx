import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CONFIG } from '../config';
import { ImageBg } from '../components/Background';
import { OutlinedText, fitFontSize } from '../components/OutlinedText';
import { useLayout } from '../layout';

/** 8–18 s : cartes de fonctionnalités qui arrivent une par une, la dernière arrivée est mise en avant. */
export const Features: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { safe, u, isVertical } = useLayout();
  const items = CONFIG.features.items;
  const n = items.length;
  // chaque carte a son « créneau » ; les cartes arrivent dans les 80 % du temps, puis tout reste à l'écran
  const slot = (durationInFrames * 0.8) / n;
  const titleS = spring({ frame, fps, config: { damping: 12 } });

  const titleSize = isVertical ? 110 * u : 90 * u;
  const gap = (isVertical ? 34 : 48) * u;
  const cols = isVertical ? 1 : 2;
  const rows = Math.ceil(n / cols);
  const gridH = safe.height - titleSize * 1.4 - gap;
  const cardW = (safe.width - gap * (cols - 1)) / cols;
  const cardH = Math.min((gridH - gap * (rows - 1)) / rows, isVertical ? 270 * u : 320 * u);
  const iconBox = cardH * 0.72;

  return (
    <AbsoluteFill>
      <ImageBg
        image={CONFIG.concept.image}
        blur={18 * u}
        zoomFrom={1.2}
        zoomTo={1.35}
        tint="linear-gradient(160deg, rgba(27,94,32,0.92), rgba(11,36,16,0.95) 60%, rgba(120,20,20,0.9))"
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
          gap,
        }}
      >
        <div style={{ transform: `scale(${titleS}) rotate(-2deg)` }}>
          <OutlinedText size={titleSize} color={CONFIG.colors.gold}>
            {CONFIG.features.title}
          </OutlinedText>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, ${cardW}px)`, gap }}>
          {items.map((it, i) => {
            const start = 8 + i * slot;
            const s = spring({ frame: frame - start, fps, config: { damping: 11, stiffness: 140 } });
            const fromLeft = i % 2 === 0;
            const active = frame >= start && (i === n - 1 ? frame < start + slot * 1.5 : frame < start + slot);
            const pop = spring({ frame: frame - start - 6, fps, config: { damping: 8 } });
            const scale = active ? 1 + 0.05 * pop : 1;
            const pulse = active ? 0.5 + 0.5 * Math.sin(frame / 4) : 0;
            const textW = cardW - iconBox - 70 * u;
            return (
              <div
                key={i}
                style={{
                  width: cardW,
                  height: cardH,
                  transform: `translateX(${interpolate(s, [0, 1], [(fromLeft ? -1 : 1) * 1400 * u, 0])}px) rotate(${interpolate(s, [0, 1], [fromLeft ? -12 : 12, i % 2 ? 1 : -1])}deg) scale(${scale})`,
                  background: `linear-gradient(180deg, #FFFFFF, #F1F1F1)`,
                  borderRadius: 36 * u,
                  border: `${7 * u}px solid ${active ? CONFIG.colors.gold : CONFIG.colors.red}`,
                  boxShadow: `0 ${12 * u}px 0 rgba(0,0,0,0.45), 0 0 ${60 * u * pulse}px ${CONFIG.colors.gold}`,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 24 * u,
                  padding: `0 ${24 * u}px`,
                  boxSizing: 'border-box',
                  opacity: frame < start ? 0 : 1,
                }}
              >
                <div
                  style={{
                    width: iconBox,
                    height: iconBox,
                    flexShrink: 0,
                    borderRadius: '50%',
                    background: i % 2 ? CONFIG.colors.green : CONFIG.colors.red,
                    border: `${6 * u}px solid ${CONFIG.colors.gold}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: iconBox * 0.58,
                    transform: `rotate(${active ? Math.sin(frame / 3) * 8 : 0}deg)`,
                  }}
                >
                  {it.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8 * u, width: textW }}>
                  <OutlinedText
                    size={fitFontSize(it.title, textW, (isVertical ? 66 : 58) * u, 0.52)}
                    style={{ textAlign: 'left' }}
                    color={CONFIG.colors.snow}
                  >
                    {it.title}
                  </OutlinedText>
                  <div
                    style={{
                      fontFamily: `'${CONFIG.font.family}', sans-serif`,
                      fontSize: (isVertical ? 40 : 34) * u,
                      lineHeight: 1.1,
                      color: '#2B2B2B',
                    }}
                  >
                    {it.text}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
