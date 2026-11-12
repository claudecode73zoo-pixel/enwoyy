import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CONFIG } from '../config';

/** Capture plein écran (cover) avec zoom lent optionnel, flou et voile coloré. */
export const ImageBg: React.FC<{
  image: string;
  blur?: number;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  tint?: string;
}> = ({ image, blur = 0, zoomFrom = 1.05, zoomTo = 1.15, panX = 0, panY = 0, tint }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const p = interpolate(frame, [0, durationInFrames], [0, 1], { extrapolateRight: 'clamp' });
  const scale = zoomFrom + (zoomTo - zoomFrom) * p;
  return (
    <AbsoluteFill style={{ backgroundColor: CONFIG.colors.darkBg, overflow: 'hidden' }}>
      <Img
        src={staticFile(image)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `scale(${scale + (blur ? 0.08 : 0)}) translate(${panX * p}%, ${panY * p}%)`,
          filter: blur ? `blur(${blur}px)` : undefined,
        }}
      />
      {tint ? <AbsoluteFill style={{ background: tint }} /> : null}
    </AbsoluteFill>
  );
};
