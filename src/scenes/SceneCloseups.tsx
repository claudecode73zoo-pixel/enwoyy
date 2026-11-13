import React from 'react';
import {AbsoluteFill, Img, interpolate, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {Background} from '../components/Background';
import {Letters} from '../components/Letters';
import {CLOSEUPS, COLORS} from '../constants';
import {beatPulse, easeOut} from '../utils';

type Closeup = (typeof CLOSEUPS)[number];

const Shot: React.FC<{c: Closeup; index: number}> = ({c, index}) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [0, c.duration], [0, 1], {easing: easeOut});
  const zoom = interpolate(t, [0, 1], [c.zoom * 0.9, c.zoom * 1.08]);
  const dx = (0.5 - c.focus.x) * 100;
  const dy = (0.5 - c.focus.y) * 100;
  const pulse = beatPulse(frame);
  const dir = index % 2 === 0 ? 1 : -1;
  const sway = interpolate(t, [0, 1], [-30 * dir, 30 * dir]);
  const wordSize = c.word.length > 4 ? 270 : 360;

  return (
    <AbsoluteFill>
      <Background x={index === 1 ? 30 : 70} y={index === 2 ? 40 : 55} intensity={0.9} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 1000, transform: `translateX(${sway}px) scale(${zoom * (1 + pulse * 0.02)}) translate(${dx}%, ${dy}%)`}}>
          <Img src={staticFile(c.image)} style={{width: '100%', display: 'block'}} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', bottom: 170, left: 0, right: 0, textShadow: `0 8px 40px ${COLORS.black}`}}>
        <Letters text={c.word} start={2} size={wordSize} gradient={index !== 1} color={COLORS.white} />
      </div>
      <div style={{position: 'absolute', top: 130, left: 70, color: COLORS.orangeLight, fontFamily: 'TNAnton, Impact', fontSize: 48, letterSpacing: 6}}>
        0{index + 1} / 03
      </div>
    </AbsoluteFill>
  );
};

/** 5-9s : 3 gros plans rapides (bulle d'air, nervures, semelle). */
export const SceneCloseups: React.FC = () => {
  let from = 0;
  return (
    <AbsoluteFill>
      {CLOSEUPS.map((c, i) => {
        const f = from;
        from += c.duration;
        return (
          <Sequence key={c.word} from={f} durationInFrames={c.duration} layout="none">
            <Shot c={c} index={i} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};
