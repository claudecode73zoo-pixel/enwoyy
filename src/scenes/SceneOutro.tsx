import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from '../components/Background';
import {Letters} from '../components/Letters';
import {Particles} from '../components/Particles';
import {BEAT, COLORS, IMAGES} from '../constants';
import {beatPulse, easeOut} from '../utils';

/** 12-15s : plan final centré, slogan « Reste tuned. » (le fondu au noir est dans la composition). */
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const s = spring({frame, fps, config: {damping: 14, stiffness: 90}});
  const scale = interpolate(s, [0, 1], [0.8, 1]) * interpolate(frame, [0, durationInFrames], [1, 1.06], {easing: easeOut});
  const pulse = beatPulse(frame);

  return (
    <AbsoluteFill>
      <Background y={46} intensity={1.1} />
      <Particles count={35} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div
          style={{
            width: 1000,
            marginTop: -420,
            opacity: s,
            transform: `translateY(${(1 - s) * 120}px) scale(${scale * (1 + pulse * 0.012)})`,
            filter: 'drop-shadow(0 40px 40px rgba(0,0,0,0.6))',
          }}
        >
          <Img src={staticFile(IMAGES.profil)} style={{width: '100%', display: 'block'}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 240, left: 0, right: 0}}>
        <Letters text="Reste" start={BEAT} size={300} color={COLORS.white} />
        <Letters text="tuned." start={BEAT + 8} size={300} gradient style={{marginTop: 10}} />
      </div>
    </AbsoluteFill>
  );
};
