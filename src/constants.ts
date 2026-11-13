// ---- Format & rythme (120 BPM @ 30 fps => 1 temps = 15 frames) ----
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const BPM = 120;
export const BEAT = (FPS * 60) / BPM; // 15 frames

// ---- Couleurs ----
export const COLORS = {
  black: '#050505',
  orange: '#FF5A00',
  orangeLight: '#FF9A1F',
  white: '#FFF4E8',
  gradient: 'linear-gradient(135deg, #FF5A00 0%, #FF9A1F 100%)',
} as const;

export const FONT_FAMILY = 'TNAnton, Impact, "Arial Narrow", sans-serif';

// ---- Images (dans /public) ----
export const IMAGES = {
  profil: 'tn-profil.png', // profil extérieur (pointe à droite)
  face: 'tn-face.png', // vue de face
  semelle: 'tn-semelle.png', // profil opposé, cadré sur l'unité de semelle
  talon: 'tn-talon.png', // 3/4 arrière : bulle d'air + badge Tn
} as const;

// ---- Rotation 360° (36 vues détourées, public/tn-360/01.webp … 36.webp) ----
export const SPIN_COUNT = 36;
export const spinImage = (index: number) => {
  const i = ((Math.round(index) % SPIN_COUNT) + SPIN_COUNT) % SPIN_COUNT;
  return `tn-360/${String(i + 1).padStart(2, '0')}.webp`;
};

// ---- Durées des scènes (en frames) ----
export const SCENES = {
  intro: {from: 0, duration: 4 * BEAT}, //  0-2s
  hero: {from: 4 * BEAT, duration: 6 * BEAT}, //  2-5s
  closeups: {from: 10 * BEAT, duration: 8 * BEAT}, //  5-9s
  spin: {from: 18 * BEAT, duration: 6 * BEAT}, //  9-12s
  outro: {from: 24 * BEAT, duration: 6 * BEAT}, // 12-15s
} as const;

export const TOTAL_FRAMES = 30 * BEAT; // 450 = 15s
export const FADE_OUT_FRAMES = 30;

// ---- Gros plans : durées (frames), mot-clé, image, point focal (0-1) et zoom ----
export const CLOSEUPS = [
  {word: 'AIR', image: IMAGES.talon, focus: {x: 0.76, y: 0.8}, zoom: 2.2, duration: 3 * BEAT},
  {word: 'TUNED', image: IMAGES.face, focus: {x: 0.5, y: 0.62}, zoom: 1.05, duration: 3 * BEAT},
  {word: 'ORANGE', image: IMAGES.semelle, focus: {x: 0.42, y: 0.84}, zoom: 2.3, duration: 2 * BEAT},
] as const;

export const SLOGAN = 'Reste tuned.';
