import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Particles} from '../components/Particles';
import {WaveLines} from '../components/WaveLines';
import {IMAGES} from '../constants';
import {beatPulse, easeOut} from '../utils';

const SHOE_W = 1000;

/** 12-15s : plan final centré sur la paire (le fondu au noir est dans la composition). */
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 13, stiffness: 100}});
  const push = interpolate(frame, [0, durationInFrames], [1, 1.08], {easing: easeOut});
  const pulse = beatPulse(frame);
  const float = Math.sin(frame / 11) * 10;

  return (
    <AbsoluteFill>
      <Background y={50} intensity={1.1} />
      <AbsoluteFill style={{opacity: 0.28}}>
        <WaveLines id="ln-outro" passThrough={false} amplitude={0.7} />
      </AbsoluteFill>
      <Particles count={40} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${push})`}}>
        <div style={{position: 'relative', width: SHOE_W, flexShrink: 0}}>
          {/* Ombre au sol */}
          <div
            style={{
              position: 'absolute',
              left: '6%',
              right: '6%',
              bottom: -40 - float * 0.5,
              height: 110,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 70%)',
              transform: `scale(${0.85 + 0.15 * s - float * 0.002})`,
            }}
          />
          <Img
            src={staticFile(IMAGES.profil)}
            style={{
              position: 'relative',
              width: '100%',
              display: 'block',
              transform: `translateY(${(1 - s) * 90 + float}px) scale(${1 + pulse * 0.012})`,
              filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.55))',
            }}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
