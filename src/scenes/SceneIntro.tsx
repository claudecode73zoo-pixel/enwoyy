import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {LineArt} from '../components/LineArt';
import {Label} from '../components/Type';
import {WaveLines} from '../components/WaveLines';
import {BEAT, COLORS, GROUND_Y, HEIGHT, HERO_SHOE_W, WIDTH} from '../constants';
import {easeInOut} from '../utils';

/** 0-2s : les lignes ondulées traversent l'écran, puis le tracé néon de la TN se dessine. */
export const SceneIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const calm = interpolate(frame, [BEAT * 1.5, BEAT * 3.5], [1, 0.3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });
  const linesOpacity = interpolate(frame, [BEAT * 1.5, BEAT * 3.5], [1, 0.4], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const reveal = interpolate(frame, [BEAT * 1.4, BEAT * 3.4], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: easeInOut,
  });
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill style={{opacity: linesOpacity}}>
        <WaveLines id="ln-intro" amplitude={calm} />
      </AbsoluteFill>
      {/* même place et même taille que la paire du plan suivant : le dessin devient la photo */}
      <div style={{position: 'absolute', left: (WIDTH - HERO_SHOE_W) / 2, bottom: HEIGHT - GROUND_Y - 8}}>
        <LineArt width={HERO_SHOE_W} reveal={reveal} />
      </div>
      <div style={{position: 'absolute', top: GROUND_Y + 70, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Label text="TUNED AIR — EST. 1998" start={BEAT * 2} size={34} />
      </div>
    </AbsoluteFill>
  );
};
