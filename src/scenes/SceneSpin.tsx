import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Particles} from '../components/Particles';
import {COLORS, FONT_FAMILY, SPIN_COUNT, spinImage} from '../constants';
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
  const pulse = beatPulse(frame);

  // Un tour complet, fluide, qui se termine sur le profil (raccord avec le plan final)
  const pos = interpolate(frame, [0, durationInFrames - 1], [0, SPIN_COUNT], {easing: easeInOut});
  const base = Math.floor(pos);
  // fondu court entre deux vues voisines : lisse la rotation sans image fantôme
  const mix = Math.min(1, Math.max(0, (pos - base - 0.3) / 0.4));

  const rotZ = interpolate(frame, [0, durationInFrames / 2, durationInFrames], [-5, 2, -2], {easing: easeInOut});
  const float = Math.sin(frame / 9) * 14;
  const appear = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const rise = (1 - spring({frame, fps, config: {damping: 12, stiffness: 110}})) * 520;
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
            transform: `translate(${drift}px, ${float + rise}px) rotate(${rotZ}deg) scale(${1 + pulse * 0.025})`,
            filter: `drop-shadow(0 50px 50px rgba(0,0,0,0.6)) drop-shadow(0 0 ${30 + pulse * 40}px ${COLORS.orange}88)`,
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
