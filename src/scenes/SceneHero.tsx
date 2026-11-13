import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Letters} from '../components/Letters';
import {BEAT, COLORS, HEIGHT, IMAGES, WIDTH} from '../constants';
import {easeOut, springVelocityBlur} from '../utils';

const SHOE_W = 900;
const GROUND_Y = 1160;
const CFG = {damping: 13, stiffness: 110, mass: 0.9}; // un seul rebond, doux

/** 2-5s : la chaussure de profil glisse avec rebond, ombre au sol, zoom continu. */
export const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const s = spring({frame, fps, config: CFG});
  const x = interpolate(s, [0, 1], [WIDTH * 1.3, 0]);
  const drop = interpolate(spring({frame: frame - 4, fps, config: {damping: 16, stiffness: 90}}), [0, 1], [-200, 0]);
  const tilt = interpolate(s, [0, 1], [-10, 0]);
  const blur = springVelocityBlur(frame, CFG, 90);
  const zoom = interpolate(frame, [0, durationInFrames], [1, 1.14], {easing: easeOut});

  const shadowS = interpolate(s, [0, 1], [0.4, 1]);
  const shadowX = x * 0.9;

  return (
    <AbsoluteFill>
      <Background y={64} />
      <AbsoluteFill style={{transform: `scale(${zoom})`, transformOrigin: '50% 60%'}}>
        <svg width="0" height="0" style={{position: 'absolute'}}>
          <filter id="mb-hero">
            <feGaussianBlur stdDeviation={`${blur} 0`} />
          </filter>
        </svg>
        {/* Ombre au sol */}
        <div
          style={{
            position: 'absolute',
            left: WIDTH / 2 - 400 + shadowX,
            top: GROUND_Y - 40,
            width: 800,
            height: 100,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 70%)',
            transform: `scale(${shadowS})`,
            opacity: 0.9,
          }}
        />
        {/* Chaussure */}
        <div
          style={{
            position: 'absolute',
            left: (WIDTH - SHOE_W) / 2,
            bottom: HEIGHT - GROUND_Y - 18,
            width: SHOE_W,
            transformOrigin: '50% 100%',
            transform: `translate(${x}px, ${drop}px) rotate(${tilt}deg)`,
            filter: `url(#mb-hero) drop-shadow(0 30px 40px rgba(0,0,0,0.5))`,
          }}
        >
          <Img src={staticFile(IMAGES.profil)} style={{width: '100%', display: 'block'}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 210, left: 0, right: 0}}>
        <Letters text="NIKE TN" start={BEAT} size={120} color={COLORS.white} />
        <Letters text="AIR MAX PLUS" start={BEAT + 6} size={56} color={COLORS.orangeLight} style={{marginTop: 14}} />
      </div>
    </AbsoluteFill>
  );
};
