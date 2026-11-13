import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Smoke} from '../components/Atmosphere';
import {Particles} from '../components/Particles';
import {Label, Tape} from '../components/Type';
import {COLORS, FONT_FAMILY, SAFE, SPIN_COUNT, SPIN_RATIO, spinImage, WIDTH} from '../constants';
import {easeInOut} from '../utils';

const SHOE_W = 980;
const CENTER_Y = 900;
const TAPE_TEXT = 'AIR MAX PLUS   •   TN   •   SUNSET';

/** « TN » géant, plein et très discret, qui défile derrière la paire. */
const BigTN: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        position: 'absolute',
        top: 420,
        left: 0,
        whiteSpace: 'nowrap',
        transform: `translateX(${-frame * 9}px)`,
        fontFamily: FONT_FAMILY,
        fontSize: 1000,
        lineHeight: 0.9,
        letterSpacing: 30,
        color: `${COLORS.orange}26`,
      }}
    >
      TN TN TN TN
    </div>
  );
};

/** Anneau d'orbite en perspective ; `front` ne dessine que la moitié qui passe devant la paire. */
const Orbit: React.FC<{rx: number; ry: number; front?: boolean; speed: number; appear: number}> = ({rx, ry, front, speed, appear}) => {
  const frame = useCurrentFrame();
  const cx = WIDTH / 2;
  const cy = CENTER_Y + 150;
  const d = front
    ? `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 0 ${cx + rx} ${cy}`
    : `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
  return (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible'}}>
      <path
        d={d}
        fill="none"
        stroke={front ? COLORS.orangeLight : COLORS.orange}
        strokeWidth={front ? 5 : 3}
        strokeLinecap="round"
        strokeDasharray="70 34"
        strokeDashoffset={frame * speed * (front ? 1 : -1)}
        opacity={(front ? 0.95 : 0.4) * appear}
        style={{filter: `drop-shadow(0 0 10px ${COLORS.orange})`}}
      />
    </svg>
  );
};

/** 9-12s : tour complet de la paire (108 vues), anneaux d'orbite, rubans et « TN » géant. */
export const SceneSpin: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames, fps} = useVideoConfig();

  // Un tour complet, fluide, qui se termine sur le profil (raccord avec le plan final)
  const pos = interpolate(frame, [0, durationInFrames - 1], [0, SPIN_COUNT], {easing: easeInOut});
  const base = Math.floor(pos);
  const mix = pos - base; // fondu entre deux vues voisines (3,3° d'écart) : rotation continue
  const degrees = Math.round((pos / SPIN_COUNT) * 360);

  const enter = spring({frame, fps, config: {damping: 20, stiffness: 110}});
  const rise = (1 - enter) * 520;
  const img: React.CSSProperties = {width: '100%', display: 'block'};
  const reflect: React.CSSProperties = {
    ...img,
    position: 'absolute',
    left: 0,
    top: '100%',
    marginTop: -26,
    transform: 'scaleY(-1)',
    filter: 'blur(2.5px)',
    WebkitMaskImage: 'linear-gradient(to top, #000 0%, transparent 48%)',
    maskImage: 'linear-gradient(to top, #000 0%, transparent 48%)',
  };

  return (
    <AbsoluteFill style={{backgroundColor: COLORS.black}}>
      <Smoke seed="spin" />
      <BigTN />
      <Tape text={TAPE_TEXT} y={356} angle={-7} speed={-7} />
      <Tape text={TAPE_TEXT} y={1470} angle={5} speed={7} variant="dark" />
      <Particles count={46} />

      <Orbit rx={540} ry={120} speed={3} appear={enter} />
      <Orbit rx={450} ry={92} speed={-2} appear={enter} />
      <div
        style={{
          position: 'absolute',
          left: (WIDTH - SHOE_W) / 2,
          top: CENTER_Y - (SHOE_W * SPIN_RATIO) / 2,
          width: SHOE_W,
          opacity: Math.min(1, enter * 2),
          transform: `translateY(${rise}px)`,
        }}
      >
        {/* ombre de contact */}
        <div
          style={{
            position: 'absolute',
            left: '8%',
            right: '8%',
            bottom: -24,
            height: 80,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
        <Img src={staticFile(spinImage(base))} style={{...reflect, opacity: 0.22}} />
        <div style={{position: 'relative', filter: `saturate(1.08) contrast(1.04) drop-shadow(0 18px 24px rgba(0,0,0,0.55))`}}>
          <Img src={staticFile(spinImage(base))} style={img} />
          {mix > 0.02 ? (
            <Img src={staticFile(spinImage(base + 1))} style={{...img, position: 'absolute', inset: 0, opacity: mix}} />
          ) : null}
        </div>
      </div>
      <Orbit rx={540} ry={120} speed={3} appear={enter} front />
      <Orbit rx={450} ry={92} speed={-2} appear={enter} front />

      <div style={{position: 'absolute', left: SAFE.left, top: SAFE.top + 10, display: 'flex', alignItems: 'baseline', gap: 20}}>
        <Label text="ROTATION" size={34} color={COLORS.white} />
        <div style={{fontFamily: FONT_FAMILY, fontSize: 64, color: COLORS.orangeLight, lineHeight: 1, minWidth: 150}}>
          {String(degrees).padStart(3, '0')}°
        </div>
      </div>
    </AbsoluteFill>
  );
};
