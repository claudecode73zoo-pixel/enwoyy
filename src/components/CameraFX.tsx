import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {CUTS} from '../constants';

export const FX_PRE = 5; // frames d'élan avant la coupe
export const FX_POST = 9; // frames d'amorti après la coupe

type Cam = {x: number; y: number; scale: number; bx: number; by: number; rgb: number};

/** Mouvement de « caméra » autour d'une coupe : 0 loin de la coupe, 1 pile dessus. */
export const cutNearness = (frame: number, at: number) => {
  const d = frame - at;
  if (d < -FX_PRE || d >= FX_POST) return null;
  const pre = d < 0;
  const p = pre ? (d + FX_PRE) / FX_PRE : d / FX_POST;
  return {
    pre,
    near: pre ? p ** 3 : (1 - p) ** 3,
    // vitesse normalisée (dérivée de `near`), sert au flou de mouvement
    speed: pre ? (3 * p * p) / FX_PRE : (3 * (1 - p) ** 2) / FX_POST,
  };
};

const cameraAt = (frame: number): Cam => {
  const cam: Cam = {x: 0, y: 0, scale: 1, bx: 0, by: 0, rgb: 0};
  for (const cut of CUTS) {
    const n = cutNearness(frame, cut.at);
    if (!n) continue;
    const {pre, near, speed} = n;
    const sign = pre ? -1 : 1; // sort d'un côté, entre par l'autre
    switch (cut.kind) {
      case 'whip-left':
      case 'whip-right': {
        const dist = 760;
        cam.x = dist * near * sign * (cut.kind === 'whip-left' ? 1 : -1);
        cam.bx = Math.min(110, dist * speed * 0.45);
        cam.scale = 1 + 0.08 * near;
        cam.rgb = 10 * near;
        break;
      }
      case 'whip-up': {
        const dist = 1150;
        cam.y = dist * near * sign;
        cam.by = Math.min(130, dist * speed * 0.45);
        cam.scale = 1 + 0.08 * near;
        cam.rgb = 10 * near;
        break;
      }
      case 'zoom': {
        cam.scale = 1 + (pre ? 0.75 : 0.5) * near;
        cam.bx = cam.by = 16 * near;
        cam.rgb = 14 * near;
        break;
      }
      default: {
        // flash / bars / wipe : petit coup de zoom + aberration après la coupe
        if (!pre) {
          cam.scale = 1 + 0.08 * near;
          cam.rgb = 9 * near;
        }
      }
    }
  }
  return cam;
};

/** Applique aux scènes les mouvements de transition : glissés filés, zoom, flou, aberration RGB. */
export const CameraFX: React.FC<{children: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  const cam = cameraAt(frame);
  const active = cam.bx > 0.05 || cam.by > 0.05 || cam.rgb > 0.05;
  return (
    <AbsoluteFill
      style={{
        transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.scale})`,
        filter: active ? 'url(#camfx)' : undefined,
      }}
    >
      {active ? (
        <svg width="0" height="0" style={{position: 'absolute'}}>
          <filter id="camfx" x="-15%" y="-15%" width="130%" height="130%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceGraphic" stdDeviation={`${cam.bx} ${cam.by}`} result="blur" />
            <feColorMatrix in="blur" type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" result="r" />
            <feOffset in="r" dx={cam.rgb} dy="0" result="r2" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" result="g" />
            <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" result="b" />
            <feOffset in="b" dx={-cam.rgb} dy="0" result="b2" />
            <feBlend in="r2" in2="g" mode="screen" result="rg" />
            <feBlend in="rg" in2="b2" mode="screen" />
          </filter>
        </svg>
      ) : null}
      {children}
    </AbsoluteFill>
  );
};
