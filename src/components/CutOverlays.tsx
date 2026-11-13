import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame} from 'remotion';
import {BEAT, COLORS, CUTS, HEIGHT, WIDTH} from '../constants';
import {cutNearness} from './CameraFX';
import {Wipe} from './Wipe';

/** Flash blanc -> orange centré sur la coupe. */
const Flash: React.FC<{at: number; strength?: number; decay?: number; y?: number}> = ({at, strength = 1, decay = BEAT, y = 46}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [at - 5, at, at + decay], [0, strength, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  // le trait de lumière horizontal reste un peu plus longtemps que le flash
  const streak = interpolate(frame, [at - 3, at, at + decay * 1.6], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (o <= 0 && streak <= 0) return null;
  return (
    <>
      <AbsoluteFill
        style={{
          opacity: o,
          background: `radial-gradient(circle at 50% ${y}%, #fff 0%, ${COLORS.orangeLight} 45%, ${COLORS.orange} 100%)`,
        }}
      />
      <AbsoluteFill style={{opacity: streak * strength, mixBlendMode: 'screen'}}>
        <div
          style={{
            position: 'absolute',
            left: '-20%',
            right: '-20%',
            top: `${y}%`,
            height: 14,
            marginTop: -7,
            borderRadius: 7,
            background: `linear-gradient(90deg, transparent, ${COLORS.orangeLight} 25%, #fff 50%, ${COLORS.orangeLight} 75%, transparent)`,
            boxShadow: `0 0 60px 18px ${COLORS.orange}`,
            transform: `scaleX(${0.5 + 0.5 * streak})`,
          }}
        />
      </AbsoluteFill>
    </>
  );
};

/** Bandes orange horizontales qui se croisent et couvrent l'écran pile sur la coupe. */
const Bars: React.FC<{at: number; count?: number}> = ({at, count = 6}) => {
  const frame = useCurrentFrame();
  const len = 10;
  if (frame < at - 6 || frame > at + 7) return null;
  const w = WIDTH * 1.5;
  const h = HEIGHT / count;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {Array.from({length: count}).map((_, i) => {
        const t = (frame - (at - 5) - (i % 2)) / len;
        if (t <= 0 || t >= 1) return null;
        const x = -w + (WIDTH + w) * t;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              top: i * h - 1,
              height: h + 2,
              width: w,
              left: i % 2 === 0 ? x : WIDTH - w - x,
              background: i % 2 === 0 ? COLORS.gradient : `linear-gradient(135deg, ${COLORS.orangeLight}, ${COLORS.orange})`,
              boxShadow: `0 0 60px ${COLORS.orange}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Traits de vitesse pendant un glissé filé. */
const Streaks: React.FC<{at: number; vertical?: boolean}> = ({at, vertical}) => {
  const frame = useCurrentFrame();
  const n = cutNearness(frame, at);
  if (!n || n.near < 0.03) return null;
  return (
    <AbsoluteFill style={{overflow: 'hidden', opacity: Math.min(1, n.near * 1.6), mixBlendMode: 'screen'}}>
      {Array.from({length: 18}).map((_, i) => {
        const r = (k: string) => random(`st-${at}-${i}-${k}`);
        const long = 300 + r('l') * 900;
        const thick = 3 + r('t') * 9;
        const travel = ((frame - at) * (180 + r('v') * 220)) % 2600;
        const across = r('p') * (vertical ? WIDTH : HEIGHT);
        const along = r('o') * (vertical ? HEIGHT : WIDTH) - travel;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: vertical ? across : along,
              top: vertical ? along : across,
              width: vertical ? thick : long,
              height: vertical ? long : thick,
              borderRadius: thick,
              background: `linear-gradient(${vertical ? 180 : 90}deg, transparent, ${
                i % 3 === 0 ? COLORS.white : COLORS.orangeLight
              }, transparent)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

/** Habillage de chaque coupe, par-dessus les scènes. */
export const CutOverlays: React.FC = () => (
  <>
    {CUTS.map((c) => {
      switch (c.kind) {
        case 'flash':
          return <Flash key={c.at} at={c.at} />;
        case 'zoom':
          return <Flash key={c.at} at={c.at} strength={0.75} decay={8} />;
        case 'bars':
          return <Bars key={c.at} at={c.at} />;
        case 'wipe':
          return <Wipe key={c.at} at={c.at} />;
        case 'whip-up':
          return <Streaks key={c.at} at={c.at} vertical />;
        default:
          return <Streaks key={c.at} at={c.at} />;
      }
    })}
  </>
);
