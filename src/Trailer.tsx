import React from 'react';
import { AbsoluteFill, Html5Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { CONFIG, sec } from './config';
import { useFont } from './components/FontLoader';
import { Garland, Snow, Sparkles } from './components/Decor';
import { Hook } from './scenes/Hook';
import { Concept } from './scenes/Concept';
import { Features } from './scenes/Features';
import { Gameplay } from './scenes/Gameplay';
import { CallToAction } from './scenes/CallToAction';

const SCENES: { key: keyof typeof CONFIG.scenes; Comp: React.FC }[] = [
  { key: 'hook', Comp: Hook },
  { key: 'concept', Comp: Concept },
  { key: 'features', Comp: Features },
  { key: 'gameplay', Comp: Gameplay },
  { key: 'cta', Comp: CallToAction },
];

/** Flash « neige » blanc entre deux scènes. */
const SceneFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const T = Math.max(2, sec(CONFIG.sceneTransition));
  let o = 0;
  for (const { key } of SCENES.slice(1)) {
    const b = sec(CONFIG.scenes[key].start);
    o = Math.max(o, interpolate(frame, [b - T / 2, b, b + T], [0, 0.85, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }));
  }
  return <AbsoluteFill style={{ backgroundColor: 'white', opacity: o, pointerEvents: 'none' }} />;
};

export const Trailer: React.FC = () => {
  const ready = useFont();
  const { durationInFrames, fps } = useVideoConfig();
  const m = CONFIG.music;
  if (!ready) return <AbsoluteFill style={{ backgroundColor: CONFIG.colors.darkBg }} />;
  return (
    <AbsoluteFill style={{ backgroundColor: CONFIG.colors.darkBg }}>
      {SCENES.map(({ key, Comp }) => (
        <Sequence key={key} from={sec(CONFIG.scenes[key].start)} durationInFrames={sec(CONFIG.scenes[key].duration)} name={key}>
          <Comp />
        </Sequence>
      ))}
      <Snow />
      <Sparkles />
      <Garland />
      <SceneFlash />
      <Html5Audio
        src={staticFile(m.file)}
        startFrom={Math.round(m.startAt * fps)}
        volume={(f) =>
          m.volume *
          interpolate(
            f,
            [0, Math.max(1, m.fadeIn * fps), durationInFrames - m.fadeOut * fps, durationInFrames],
            [0, 1, 1, 0],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          )
        }
      />
    </AbsoluteFill>
  );
};
