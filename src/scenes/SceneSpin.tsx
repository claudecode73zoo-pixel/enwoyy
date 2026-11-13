import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Particles} from '../components/Particles';
import {COLORS, FONT_FAMILY, SPIN_COUNT, spinImage} from '../constants';
import {easeInOut} from '../utils';

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
        <span key={i} style={{width: unit, flexShrink: 0}}>
          TN
        </span>
      ))}
    </div>
  );
};

const SHOE_W = 1000;

/** 9-12s : la paire tourne (vraies vues 360°), particules, « TN » géant qui défile. */
export const SceneSpin: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();

  // Un tour complet, fluide, qui se termine sur le profil (raccord avec le plan final)
  const pos = interpolate(frame, [0, durationInFrames - 1], [0, SPIN_COUNT], {easing: easeInOut});
  const base = Math.floor(pos);
  const mix = pos - base; // fondu entre deux vues voisines (3,3° d'écart) : rotation continue

  const rotZ = interpolate(frame, [0, durationInFrames], [-4, 0], {easing: easeInOut});
  const appear = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const rise = (1 - spring({frame, fps, config: {damping: 20, stiffness: 110}})) * 520;
  const drift = interpolate(frame, [0, durationInFrames], [-50, 50]);
  const img: React.CSSProperties = {width: '100%', display: 'block'};

  return (
    <AbsoluteFill>
      <Background y={50} />
      <BigTN y={120} dir={1} speed={14} fill />
      <BigTN y={900} dir={-1} speed={20} />
      <Particles />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: appear}}>
        <div
          style={{
            position: 'relative',
            width: SHOE_W,
            flexShrink: 0,
            transform: `translate(${drift}px, ${rise}px) rotate(${rotZ}deg)`,
            filter: `drop-shadow(0 50px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 40px ${COLORS.orange}88)`,
          }}
        >
          <Img src={staticFile(spinImage(base))} style={img} />
          {mix > 0.02 ? (
            <Img src={staticFile(spinImage(base + 1))} style={{...img, position: 'absolute', inset: 0, opacity: mix}} />
          ) : null}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
