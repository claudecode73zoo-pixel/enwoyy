import React from 'react';
import {COLORS, WIDTH} from '../constants';

type Props = {
  /** Centre du disque (px). */
  cy: number;
  cx?: number;
  size: number;
  /** Ligne d'horizon : le soleil est coupé en dessous. */
  horizon: number;
  intensity?: number;
};

/** Soleil « Sunset » : disque dégradé strié, halo, reflet au sol et ligne d'horizon. */
export const Sun: React.FC<Props> = ({cy, cx = WIDTH / 2, size, horizon, intensity = 1}) => {
  // part du disque visible au-dessus de l'horizon
  const visible = Math.min(1, Math.max(0, (horizon - (cy - size / 2)) / size));
  const stripes =
    'linear-gradient(to bottom, #000 0%, #000 46%, transparent 46%), repeating-linear-gradient(to bottom, #000 0px, #000 22px, transparent 22px, transparent 36px)';
  return (
    <>
      <div style={{position: 'absolute', left: 0, top: 0, width: WIDTH, height: horizon, overflow: 'hidden'}}>
        <div
          style={{
            position: 'absolute',
            left: cx - size * 1.1,
            top: cy - size * 1.1,
            width: size * 2.2,
            height: size * 2.2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${COLORS.orange}70 0%, ${COLORS.orange}26 38%, transparent 66%)`,
            opacity: intensity,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: cx - size / 2,
            top: cy - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            background: COLORS.sun,
            opacity: intensity,
            WebkitMaskImage: stripes,
            maskImage: stripes,
          }}
        />
      </div>
      {/* reflet du soleil sur le sol */}
      <div
        style={{
          position: 'absolute',
          left: cx - size * 0.7,
          top: horizon,
          width: size * 1.4,
          height: 460,
          background: `radial-gradient(ellipse 50% 100% at 50% 0%, ${COLORS.orange}66 0%, ${COLORS.orange}1c 45%, transparent 72%)`,
          opacity: intensity * (0.25 + 0.75 * visible),
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: horizon - 1,
          width: WIDTH,
          height: 2,
          background: `linear-gradient(90deg, transparent 4%, ${COLORS.orangeLight} 50%, transparent 96%)`,
          opacity: 0.75 * intensity,
        }}
      />
    </>
  );
};
