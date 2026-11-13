// ---- Format & rythme (120 BPM @ 30 fps => 1 temps = 15 frames) ----
export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const BPM = 120;
export const BEAT = (FPS * 60) / BPM; // 15 frames

// ---- Couleurs (dégradé du coloris « Sunset » : jaune -> orange -> rouge) ----
export const COLORS = {
  black: '#050505',
  orange: '#FF5A00',
  orangeLight: '#FF9A1F',
  yellow: '#FFC93C',
  red: '#E0260A',
  white: '#FFF4E8',
  gradient: 'linear-gradient(135deg, #FF5A00 0%, #FF9A1F 100%)',
  sun: 'linear-gradient(180deg, #FFD23F 0%, #FF9A1F 30%, #FF5A00 62%, #C81D05 100%)',
} as const;

export const FONT_FAMILY = 'TNAnton, Impact, "Arial Narrow", sans-serif';
export const MONO_FAMILY = 'TNMono, "Courier New", monospace';

// ---- Médias (dans /public) ----
export const IMAGES = {
  profil: 'tn-profil.png', // profil extérieur (pointe à droite)
  lines: 'tn-profil-lines.png', // même cadrage que le profil, en tracé (contours + nervures)
  face: 'tn-face.png', // vue de face
  semelle: 'tn-semelle.png', // profil opposé, cadré sur l'unité de semelle
  talon: 'tn-talon.png', // 3/4 arrière : bulle d'air + badge Tn
} as const;
export const PROFIL_RATIO = 977 / 2073; // hauteur / largeur de tn-profil.png
export const AUDIO = 'audio/tn-beat.wav'; // bande-son 120 BPM (scripts/make-audio.py) ; mettre '' pour une vidéo muette

// ---- Rotation 360° : 108 vues détourées (36 photos + 2 vues intermédiaires calculées par paire) ----
// public/tn-360/001.webp … 108.webp
export const SPIN_COUNT = 108;
export const SPIN_RATIO = 615 / 1200; // hauteur / largeur des vues
export const spinImage = (index: number) => {
  const i = ((Math.round(index) % SPIN_COUNT) + SPIN_COUNT) % SPIN_COUNT;
  return `tn-360/${String(i + 1).padStart(3, '0')}.webp`;
};

// ---- Mise en page ----
export const GROUND_Y = 1090; // ligne d'horizon / sol des plans larges
export const HERO_SHOE_W = 940;
// Zone sûre TikTok / Reels : aucun texte important en dehors
export const SAFE = {top: 200, bottom: 1560, left: 70, right: 1010} as const;

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

// ---- Gros plans : mot-clé, légende, image, point focal (0-1), zoom et durée (frames) ----
export const CLOSEUPS = [
  {word: 'AIR', label: 'UNITÉ TUNED AIR', image: IMAGES.talon, focus: {x: 0.76, y: 0.8}, zoom: 2.2, duration: 3 * BEAT},
  {word: 'TUNED', label: 'NERVURES TPU', image: IMAGES.face, focus: {x: 0.5, y: 0.5}, zoom: 1.0, duration: 3 * BEAT},
  {word: 'ORANGE', label: 'COLORIS SUNSET', image: IMAGES.semelle, focus: {x: 0.42, y: 0.8}, zoom: 2.3, duration: 2 * BEAT},
] as const;

// ---- Transitions : une par coupe, toutes calées sur un temps ----
export type CutKind = 'flash' | 'whip-left' | 'whip-right' | 'whip-up' | 'bars' | 'wipe' | 'zoom';
const closeup2 = SCENES.closeups.from + CLOSEUPS[0].duration;
const closeup3 = closeup2 + CLOSEUPS[1].duration;
export const CUTS: {at: number; kind: CutKind}[] = [
  {at: SCENES.hero.from, kind: 'flash'}, // tracé -> paire réelle
  {at: SCENES.closeups.from, kind: 'whip-left'}, // profil -> AIR
  {at: closeup2, kind: 'bars'}, // AIR -> TUNED
  {at: closeup3, kind: 'whip-up'}, // TUNED -> ORANGE
  {at: SCENES.spin.from, kind: 'wipe'}, // ORANGE -> rotation
  {at: SCENES.outro.from, kind: 'zoom'}, // rotation -> plan final
];
