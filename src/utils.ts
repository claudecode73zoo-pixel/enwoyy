import {Easing, spring} from 'remotion';
import {BEAT, FPS} from './constants';

export const easeOut = Easing.bezier(0.16, 1, 0.3, 1); // expo-like, fluide
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1);

/** Respiration douce calée sur le tempo (120 BPM) : 1 sur le temps, 0 entre deux, sans à-coup. */
export const beatBreath = (frame: number) => 0.5 + 0.5 * Math.cos((2 * Math.PI * frame) / BEAT);

/** Flou directionnel (px) proportionnel à la vitesse d'un spring. */
export const springVelocityBlur = (
  frame: number,
  config: {damping: number; stiffness: number; mass?: number},
  gain = 40,
  delay = 0,
) => {
  const a = spring({frame: frame - delay, fps: FPS, config});
  const b = spring({frame: frame - delay - 1, fps: FPS, config});
  return Math.abs(a - b) * gain;
};
