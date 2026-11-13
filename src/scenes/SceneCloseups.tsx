import React from 'react';
import {AbsoluteFill, interpolate, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Smoke} from '../components/Atmosphere';
import {Callout} from '../components/Callout';
import {Letters} from '../components/Letters';
import {Shoe} from '../components/Shoe';
import {Label, OutlineRow, Rule} from '../components/Type';
import {CLOSEUPS, COLORS, SAFE, WIDTH} from '../constants';
import {easeOut, springVelocityBlur} from '../utils';

type Closeup = (typeof CLOSEUPS)[number];
const SLIDE = {damping: 20, stiffness: 130}; // glissé amorti, sans rebond
const FOCUS_Y = 700; // hauteur du détail à l'écran (le bas reste libre pour la typo)

const Shot: React.FC<{c: Closeup; index: number}> = ({c, index}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = interpolate(frame, [0, c.duration], [0, 1], {easing: easeOut});
  const zoom = interpolate(t, [0, 1], [c.zoom * 0.92, c.zoom * 1.06]);
  const dx = (0.5 - c.focus.x) * 100;
  const dy = (0.5 - c.focus.y) * 100;
  const dir = index % 2 === 0 ? 1 : -1;
  const sway = interpolate(t, [0, 1], [-26 * dir, 26 * dir]);
  // Entrée en translation : par la droite, la gauche, puis le bas
  const enter = 1 - spring({frame, fps, config: SLIDE});
  const vertical = index === 2;
  const slide = enter * 520 * (vertical ? 1 : dir);
  const blur = springVelocityBlur(frame, SLIDE, 160);
  const sweep = interpolate(frame, [10, 30], [0, 1]);
  const wordSize = c.word.length > 4 ? 236 : 300;

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <Smoke seed={`shot${index}`} />

      {/* Photo : centrée sur le détail, zoom lent */}
      <div style={{position: 'absolute', left: 0, top: FOCUS_Y - 960, width: WIDTH, height: 1920, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <svg width="0" height="0" style={{position: 'absolute'}}>
          <filter id={`mb-shot-${index}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation={vertical ? `0 ${blur}` : `${blur} 0`} />
          </filter>
        </svg>
        <div
          style={{
            flexShrink: 0,
            filter: blur > 0.3 ? `url(#mb-shot-${index})` : undefined,
            transform: `translate(${vertical ? sway : sway + slide}px, ${vertical ? slide : 0}px) scale(${zoom}) translate(${dx}%, ${dy}%)`,
          }}
        >
          <Shoe src={c.image} width={1000} sweep={sweep} reflection={0} shadow={false} />
        </div>
      </div>

      {/* dégradé sous la photo : la typo reste lisible */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 960, height: 420, background: `linear-gradient(180deg, transparent, ${COLORS.black} 78%)`}} />

      {/* dégradé en haut : les légendes restent lisibles sur la photo */}
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 340, background: `linear-gradient(0deg, transparent, rgba(5,5,5,0.85) 70%)`}} />
      <OutlineRow text={c.word} y={1096} size={160} speed={index % 2 ? 5 : -5} opacity={0.6} />

      <Callout x={WIDTH / 2 + sway * 0.6} y={FOCUS_Y} text={c.label} start={8} side={index === 1 ? 'left' : 'right'} dy={index === 2 ? -240 : -210} />

      <div style={{position: 'absolute', left: SAFE.left, top: SAFE.top + 10, display: 'flex', alignItems: 'center', gap: 18}}>
        <Label text={`0${index + 1} / 03`} size={34} color={COLORS.white} />
      </div>
      <div style={{position: 'absolute', right: WIDTH - SAFE.right, top: SAFE.top + 10}}>
        <Label text="TN SUNSET" size={34} />
      </div>

      <div style={{position: 'absolute', top: 1262, left: 0, right: 0, filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.9))'}}>
        <Letters text={c.word} start={2} size={wordSize} gradient={index !== 1} color={COLORS.white} />
      </div>
      <div style={{position: 'absolute', top: SAFE.bottom - 40, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <Rule start={12} width={180} />
      </div>
    </AbsoluteFill>
  );
};

/** 5-9s : 3 gros plans (bulle d'air, nervures, semelle) avec mot-clé et repère technique. */
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
