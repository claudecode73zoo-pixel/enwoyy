import React from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  Sequence,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { CONFIG, GameplayClip } from '../config';
import { OutlinedText } from '../components/OutlinedText';
import { useLayout } from '../layout';

/** Découpe des clips calée sur le tempo (en images). */
export const gameplayCuts = (fps: number) => {
  const beat = (60 / CONFIG.gameplay.bpm) * fps;
  let acc = 0;
  return CONFIG.gameplay.clips.map((clip) => {
    const from = Math.round(acc);
    acc += clip.beats * beat;
    return { clip, from, to: Math.round(acc) };
  });
};

const ClipLayer: React.FC<{ clip: GameplayClip; caption?: string }> = ({ clip, caption }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const { W, H, u, safe, isVertical } = useLayout();
  const T = Math.max(1, Math.round(CONFIG.gameplay.transitionDuration * fps));
  const p = interpolate(frame, [0, T], [0, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  let transform = '';
  let opacity = 1;
  switch (clip.transition) {
    case 'zoom':
      transform = `scale(${interpolate(p, [0, 1], [1.8, 1])})`;
      opacity = p;
      break;
    case 'slideLeft':
      transform = `translateX(${(1 - p) * W}px)`;
      break;
    case 'slideRight':
      transform = `translateX(${-(1 - p) * W}px)`;
      break;
    case 'slideUp':
      transform = `translateY(${(1 - p) * H}px)`;
      break;
  }
  // léger « punch » de caméra qui dézoome pendant le clip
  const punch = interpolate(frame, [0, 45], [1.08, 1], { extrapolateRight: 'clamp' });
  const cap = spring({ frame: frame - 3, fps, config: { damping: 8, stiffness: 200 } });
  return (
    <AbsoluteFill style={{ transform, opacity, overflow: 'hidden', backgroundColor: 'black' }}>
      <AbsoluteFill style={{ transform: `scale(${punch})` }}>
        <OffthreadVideo
          src={staticFile(clip.file)}
          startFrom={Math.round(clip.startAt * fps)}
          volume={CONFIG.gameplay.clipVolume}
          muted={CONFIG.gameplay.clipVolume === 0}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </AbsoluteFill>
      {caption ? (
        <div
          style={{
            position: 'absolute',
            left: safe.left,
            width: safe.width,
            top: isVertical ? safe.top + safe.height * 0.08 : safe.top,
            display: 'flex',
            justifyContent: 'center',
            transform: `scale(${cap}) rotate(-6deg)`,
          }}
        >
          <OutlinedText size={(isVertical ? 140 : 120) * u} color={CONFIG.colors.gold}>
            {caption}
          </OutlinedText>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};

/** 18–25 s : montage rapide des clips de gameplay. */
export const Gameplay: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const { u } = useLayout();
  const cuts = gameplayCuts(fps);
  const T = Math.round(CONFIG.gameplay.transitionDuration * fps);
  const beat = (60 / CONFIG.gameplay.bpm) * fps;
  const sinceBeat = frame % beat;
  const flash = interpolate(sinceBeat, [0, 4], [0.22, 0], { extrapolateRight: 'clamp' });
  const onCut = cuts.some((c) => frame >= c.from && frame < c.from + 3);
  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {cuts.map(({ clip, from, to }, i) => {
        const end = i === cuts.length - 1 ? durationInFrames : to + T;
        if (from >= durationInFrames) return null;
        return (
          <Sequence key={i} from={from} durationInFrames={Math.max(1, Math.min(end, durationInFrames) - from)}>
            <ClipLayer clip={clip} caption={CONFIG.gameplay.captions[i]} />
          </Sequence>
        );
      })}
      {/* flash blanc sur chaque temps + vignette */}
      <AbsoluteFill style={{ backgroundColor: 'white', opacity: onCut ? flash * 1.6 : flash * 0.5 }} />
      <AbsoluteFill
        style={{ boxShadow: `inset 0 0 ${220 * u}px rgba(0,0,0,0.75)`, border: `${10 * u}px solid ${CONFIG.colors.red}` }}
      />
    </AbsoluteFill>
  );
};
