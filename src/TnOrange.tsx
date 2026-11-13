import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
import {CameraFX} from './components/CameraFX';
import {CutOverlays} from './components/CutOverlays';
import {useFont} from './components/Fonts';
import {Grain} from './components/Grain';
import {COLORS, FADE_OUT_FRAMES, SCENES, TOTAL_FRAMES} from './constants';
import {SceneCloseups} from './scenes/SceneCloseups';
import {SceneHero} from './scenes/SceneHero';
import {SceneIntro} from './scenes/SceneIntro';
import {SceneOutro} from './scenes/SceneOutro';
import {SceneSpin} from './scenes/SceneSpin';

const SCENE_LIST = [
  [SCENES.intro, SceneIntro],
  [SCENES.hero, SceneHero],
  [SCENES.closeups, SceneCloseups],
  [SCENES.spin, SceneSpin],
  [SCENES.outro, SceneOutro],
] as const;

/** Composition principale : enchaîne les scènes, transitions, grain et fondu final. */
export const TnOrange: React.FC = () => {
  useFont();
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <CameraFX>
        {SCENE_LIST.map(([s, Comp], i) => (
          <Sequence key={i} from={s.from} durationInFrames={s.duration}>
            <Comp />
          </Sequence>
        ))}
      </CameraFX>
      <CutOverlays />
      <Grain />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};
