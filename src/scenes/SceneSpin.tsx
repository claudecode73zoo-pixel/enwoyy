import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Particles} from '../components/Particles';
import {COLORS, FONT_FAMILY, IMAGES, WIDTH} from '../constants';
import {beatPulse, easeInOut} from '../utils';

const BigTN: React.FC<{y: number; dir: 1 | -1; fill?: boolean; speed: number}> = ({y, dir, fill, speed}) => {
  const frame = useCurrentFrame();
  const unit = 1180; // largeur d'un motif « TN »
  const x = -((frame * speed) % unit) * dir - (dir === 1 ? 0 : unit);
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: 0,
        display: 'flex',
        whiteSpace: 'nowrap',
        transform: `translateX(${x}px)`,
        fontFamily: FONT_FAMILY,
        fontSize: 1000,
        lineHeight: 0.9,
        letterSpacing: 20,
        color: fill ? `${COLORS.orange}30` : 'transparent',
        WebkitTextStroke: fill ? '0px' : `4px ${COLORS.orange}`,
        opacity: fill ? 1 : 0.5,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{width: unit}}>
          TN
        </span>
      ))}
    </div>
  );
};

/** 9-12s : la paire tourne légèrement, particules, « TN » géant qui défile. */
export const SceneSpin: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const pulse = beatPulse(frame);
  const t = interpolate(frame, [0, durationInFrames], [0, 1], {easing: easeInOut});
  const rotY = interpolate(t, [0, 1], [-24, 24]);
  const rotZ = interpolate(t, [0, 0.5, 1], [-4, 3, -3]);
  const float = Math.sin(frame / 9) * 14;
  const appear = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill>
      <Background y={50} />
      <BigTN y={120} dir={1} speed={14} fill />
      <BigTN y={900} dir={-1} speed={20} />
      <Particles />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1800, opacity: appear}}>
        <div
          style={{
            width: 1060,
            transform: `translateY(${float}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${1.05 + pulse * 0.025})`,
            filter: `drop-shadow(0 50px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 ${30 + pulse * 40}px ${COLORS.orange}88)`,
          }}
        >
          <Img src={staticFile(IMAGES.profil)} style={{width: '100%', display: 'block'}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 0, left: 0, width: WIDTH, height: 1}} />
    </AbsoluteFill>
  );
};
