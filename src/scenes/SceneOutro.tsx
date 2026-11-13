import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FloorLines, Smoke} from '../components/Atmosphere';
import {Letters} from '../components/Letters';
import {Shoe} from '../components/Shoe';
import {Sun} from '../components/Sun';
import {Label, Rule} from '../components/Type';
import {BEAT, COLORS, GROUND_Y, HEIGHT, HERO_SHOE_W, IMAGES, SAFE, WIDTH} from '../constants';

const SUN = 840;

/** 12-15s : plan final. Le soleil se couche derrière la paire pendant le fondu au noir. */
export const SceneOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const settle = spring({frame, fps, config: {damping: 24, stiffness: 100}});
  const push = interpolate(frame, [0, durationInFrames], [1, 1.06]);
  // coucher de soleil : lent au début, plus rapide vers la fin
  const sunY = interpolate(frame, [0, durationInFrames], [GROUND_Y - 330, GROUND_Y + 250], {
    easing: Easing.bezier(0.5, 0, 0.9, 0.6),
  });
  const sweep = interpolate(frame, [BEAT, BEAT * 2.6], [0, 1]);

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: `50% ${(GROUND_Y - 200) / (HEIGHT / 100)}%`}}>
        <Smoke seed="outro" opacity={0.8} />
        <Sun cy={sunY} size={SUN} horizon={GROUND_Y} />
        <FloorLines horizon={GROUND_Y} />
        <div
          style={{
            position: 'absolute',
            left: (WIDTH - HERO_SHOE_W) / 2,
            bottom: HEIGHT - GROUND_Y - 8,
            transform: `translateY(${(1 - settle) * 40}px)`,
          }}
        >
          <Shoe src={IMAGES.profil} width={HERO_SHOE_W} sweep={sweep} reflection={0.22} />
        </div>
      </AbsoluteFill>

      <div
        style={{
          position: 'absolute',
          top: 1292,
          left: 0,
          right: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          filter: 'drop-shadow(0 8px 26px rgba(0,0,0,0.9))',
        }}
      >
        <Letters text="SUNSET" start={BEAT} size={230} gradient />
        <Rule start={BEAT * 2} width={200} style={{marginTop: 4}} />
        <div style={{position: 'absolute', top: SAFE.bottom - 1292 - 34}}>
          <Label text="AIR MAX PLUS — 2024" start={BEAT * 2 + 4} size={34} color={COLORS.white} />
        </div>
      </div>
    </AbsoluteFill>
  );
};
