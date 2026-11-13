import React from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Vignette} from './components/Atmosphere';
import {CameraFX} from './components/CameraFX';
import {CutOverlays} from './components/CutOverlays';
import {useFont} from './components/Fonts';
import {Grain} from './components/Grain';
import {AUDIO, COLORS, FADE_OUT_FRAMES, SCENES, TOTAL_FRAMES} from './constants';
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

/** Composition principale : enchaîne les scènes, transitions, étalonnage, son et fondu final. */
export const TnOrange: React.FC = () => {
  useFont();
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [TOTAL_FRAMES - FADE_OUT_FRAMES, TOTAL_FRAMES], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      {AUDIO ? <Audio src={staticFile(AUDIO)} /> : null}
      <CameraFX>
        {SCENE_LIST.map(([s, Comp], i) => (
          <Sequence key={i} from={s.from} durationInFrames={s.duration}>
            <Comp />
          </Sequence>
        ))}
      </CameraFX>
      <CutOverlays />
      <Vignette />
      <Grain />
      <AbsoluteFill style={{backgroundColor: '#000', opacity: fade}} />
    </AbsoluteFill>
  );
};
