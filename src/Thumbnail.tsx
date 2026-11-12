import React from 'react';
import { AbsoluteFill } from 'remotion';
import { CONFIG } from './config';
import { useFont } from './components/FontLoader';
import { ImageBg } from './components/Background';
import { OutlinedText, fitFontSize } from './components/OutlinedText';
import { Garland, Snow, Sparkles } from './components/Decor';
import { useLayout } from './layout';

/** Miniature 1280x720 (YouTube). */
export const Thumbnail: React.FC = () => {
  const ready = useFont();
  const { W, H } = useLayout();
  if (!ready) return null;
  const words = CONFIG.map.name.split(' ');
  const longest = words.reduce((m, w) => (w.length > m.length ? w : m), '');
  const title = fitFontSize(longest, W * 0.55, 210, 0.6);
  return (
    <AbsoluteFill>
      <ImageBg image={CONFIG.thumbnail.image} zoomFrom={1.05} zoomTo={1.05} />
      <AbsoluteFill
        style={{ background: 'linear-gradient(90deg, rgba(214,40,40,0.95) 0%, rgba(214,40,40,0.75) 45%, rgba(0,0,0,0) 75%)' }}
      />
      <Snow count={70} seed="thumb" />
      <Sparkles seed="thumb" />
      <Garland />
      <div
        style={{
          position: 'absolute',
          left: W * 0.05,
          top: H * 0.16,
          width: W * 0.6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 16,
          transform: 'rotate(-4deg)',
        }}
      >
        <div style={{ background: CONFIG.colors.gold, border: '5px solid black', borderRadius: 16, padding: '4px 22px' }}>
          <OutlinedText size={46} color={CONFIG.colors.red} outline={0} style={{ textShadow: 'none' }}>
            {CONFIG.thumbnail.badge}
          </OutlinedText>
        </div>
        {words.map((w, i) => (
          <OutlinedText key={i} size={title} color={i % 2 ? CONFIG.colors.gold : CONFIG.colors.snow} style={{ textAlign: 'left' }}>
            {w}
          </OutlinedText>
        ))}
        <div style={{ background: CONFIG.colors.green, border: `5px solid ${CONFIG.colors.gold}`, borderRadius: 999, padding: '8px 28px' }}>
          <OutlinedText size={fitFontSize(CONFIG.map.tagline, W * 0.5, 54, 0.5)}>{CONFIG.map.tagline}</OutlinedText>
        </div>
      </div>
    </AbsoluteFill>
  );
};
