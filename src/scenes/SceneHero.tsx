import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FloorLines, Smoke} from '../components/Atmosphere';
import {Letters} from '../components/Letters';
import {LineArt} from '../components/LineArt';
import {Shoe} from '../components/Shoe';
import {Sun} from '../components/Sun';
import {Label, Rule} from '../components/Type';
import {BEAT, COLORS, GROUND_Y, HEIGHT, HERO_SHOE_W, IMAGES, WIDTH} from '../constants';

const SUN = 680;

/** 2-5s : le tracé devient la vraie paire, le soleil se lève derrière elle, le titre s'écrit. */
export const SceneHero: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();

  const settle = spring({frame, fps, config: {damping: 22, stiffness: 120}});
  const rise = spring({frame: frame - 2, fps, config: {damping: 26, stiffness: 55}});
  const sunY = interpolate(rise, [0, 1], [GROUND_Y + SUN / 2 + 30, GROUND_Y - 240]);
  const push = interpolate(frame, [0, durationInFrames], [1, 1.07]);
  const drift = interpolate(frame, [0, durationInFrames], [-14, 14]);
  const sweep = interpolate(frame, [BEAT * 1.4, BEAT * 3], [0, 1]);
  const drawing = interpolate(frame, [0, 10], [1, 0], {extrapolateRight: 'clamp'});

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: `50% ${(GROUND_Y - 200) / (HEIGHT / 100)}%`}}>
        <Smoke seed="hero" opacity={0.8} />
        <Sun cy={sunY} size={SUN} horizon={GROUND_Y} intensity={Math.min(1, rise * 1.4)} />
        <FloorLines horizon={GROUND_Y} opacity={rise} />
        <div
          style={{
            position: 'absolute',
            left: (WIDTH - HERO_SHOE_W) / 2,
            bottom: HEIGHT - GROUND_Y - 8,
            transform: `translateX(${drift}px) scale(${1.16 - 0.16 * settle})`,
            transformOrigin: '50% 80%',
          }}
        >
          <Shoe src={IMAGES.profil} width={HERO_SHOE_W} sweep={sweep} />
          {drawing > 0 ? (
            <div style={{position: 'absolute', left: 0, top: 0}}>
              <LineArt width={HERO_SHOE_W} reveal={1} opacity={drawing} />
            </div>
          ) : null}
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', top: 232, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <Label text="NIKE TN" start={8} size={36} />
        <Letters text="AIR MAX PLUS" start={BEAT} size={150} color={COLORS.white} style={{marginTop: 18}} />
        <Rule start={BEAT * 2} width={240} style={{marginTop: 22}} />
      </div>
    </AbsoluteFill>
  );
};
