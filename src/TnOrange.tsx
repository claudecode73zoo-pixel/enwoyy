import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {Grain} from './components/Grain';
import {useFont} from './components/Fonts';
import {Wipe} from './components/Wipe';
import {BEAT, COLORS, FADE_OUT_FRAMES, SCENES, TOTAL_FRAMES, CLOSEUPS} from './constants';
import {SceneCloseups} from './scenes/SceneCloseups';
import {SceneHero} from './scenes/SceneHero';
import {SceneIntro} from './scenes/SceneIntro';
import {SceneOutro} from './scenes/SceneOutro';
import {SceneSpin} from './scenes/SceneSpin';

/** Composition principale : enchaîne les scènes, flash, balayages, grain et fondu final. */
export const TnOrange: React.FC = () => {
  useFont();
  const frame = useCurrentFrame();
  const {intro, hero, closeups, spin, outro} = SCENES;

  // Flash au passage intro -> hero (frame 60, sur le temps 4)
  const flash = interpolate(frame, [hero.from - 5, hero.from, hero.from + BEAT], [0, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fade = interpolate(frame, [TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Coupes des gros plans (balayages)
  const cuts: number[] = [closeups.from];
  let acc = closeups.from;
  CLOSEUPS.forEach((c, i) => {
    acc += c.duration;
    if (i < CLOSEUPS.length - 1) cuts.push(acc);
  });
  cuts.push(spin.from);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      {([
        [intro, SceneIntro],
        [hero, SceneHero],
        [closeups, SceneCloseups],
        [spin, SceneSpin],
        [outro, SceneOutro],
      ] as const).map(([s, Comp], i) => (
        <Sequence key={i} from={s.from} durationInFrames={s.duration}>
          <Comp />
        </Sequence>
      ))}
      {cuts.map((c) => (
        <Wipe key={c} at={c} />
      ))}
      <AbsoluteFill
        style={{
          opacity: flash,
          background: `radial-gradient(circle at 50% 50%, #fff 0%, ${COLORS.orangeLight} 45%, ${COLORS.orange} 100%)`,
        }}
      />
      <Grain />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};
