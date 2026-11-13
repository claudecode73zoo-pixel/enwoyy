import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {WaveLines} from '../components/WaveLines';
import {BEAT, COLORS} from '../constants';
import {easeInOut} from '../utils';

/** 0-2s : lignes orange ondulées (nervures de la TN) qui traversent l'écran. */
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  // Les lignes se resserrent vers le flash (frame 60)
  const squeeze = interpolate(frame, [BEAT * 3, BEAT * 4], [1, 0.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <WaveLines id="ln-intro" amplitude={squeeze} />
    </AbsoluteFill>
  );
};
