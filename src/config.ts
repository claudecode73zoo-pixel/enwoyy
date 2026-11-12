/**
 * ============================================================
 *  CONFIG DU TRAILER — modifie tout ici (textes, couleurs, durées)
 * ============================================================
 *  - Les durées sont en SECONDES.
 *  - Les fichiers médias sont relatifs au dossier ./assets/
 *  - Après modification : `npm run stills` (aperçus) puis `npm run render`.
 */

export const CONFIG = {
  // ---------- Infos de la map ----------
  map: {
    name: 'NOËL TYCOON', // ← [NOM DE LA MAP]
    islandCode: 'XXXX-XXXX-XXXX', // ← [CODE DE L'ÎLE]
    tagline: 'Deviens le roi de Noël 🎄',
    concept: 'Construis ta propre usine à cadeaux et deviens le plus riche du village de Noël !',
  },

  // ---------- Couleurs ----------
  colors: {
    red: '#D62828',
    green: '#1B5E20',
    gold: '#FFC300',
    snow: '#FFFFFF',
    outline: '#000000',
    darkBg: '#0B2410', // fond derrière les scènes
  },

  // ---------- Police (fichier dans assets/fonts/) ----------
  font: {
    family: 'Lilita One',
    file: 'fonts/LilitaOne-Regular.ttf',
    /** épaisseur du contour noir, en % de la taille du texte */
    outlineRatio: 0.09,
  },

  // ---------- Formats de sortie ----------
  video: {
    fps: 30,
    vertical: { width: 1080, height: 1920 },
    horizontal: { width: 1920, height: 1080 },
    thumbnail: { width: 1280, height: 720 },
  },

  // ---------- Timeline (secondes) ----------
  scenes: {
    hook: { start: 0, duration: 3 },
    concept: { start: 3, duration: 5 },
    features: { start: 8, duration: 10 },
    gameplay: { start: 18, duration: 7 },
    cta: { start: 25, duration: 5 },
  },
  /** durée du fondu blanc/neige entre deux scènes */
  sceneTransition: 0.3,

  // ---------- Scène 1 : accroche ----------
  hook: {
    background: { image: 'concept.png' }, // fond flouté derrière le titre
  },

  // ---------- Scène 2 : concept (Ken Burns) ----------
  concept: {
    image: 'concept.png',
    zoomFrom: 1.0,
    zoomTo: 1.25,
    /** déplacement du cadre pendant le zoom, en % (-50..50) */
    panX: -6,
    panY: -4,
    /** mots de la phrase concept affichés en or */
    highlightWords: ['usine', 'cadeaux', 'riche'],
  },

  // ---------- Scène 3 : fonctionnalités (3 ou 4 cartes) ----------
  features: {
    title: 'AU PROGRAMME',
    items: [
      { icon: '🏭', title: 'Améliore ton usine', text: 'Des dizaines d’upgrades à débloquer' },
      { icon: '🧝', title: 'Elfes ouvriers', text: 'Recrute-les et produis encore plus' },
      { icon: '🔄', title: 'Rebirths', text: 'Recommence plus fort avec des bonus' },
      { icon: '🐧', title: 'Pets de Noël', text: 'Pingouins, rennes… adopte-les tous !' },
    ],
  },

  // ---------- Scène 4 : gameplay (montage calé sur la musique) ----------
  gameplay: {
    bpm: 120,
    /** chaque clip dure `beats` temps (à 120 BPM : 2 temps = 1 s, 3 temps = 1,5 s) */
    clips: [
      { file: 'clip1.mp4', beats: 3, startAt: 0, transition: 'zoom' },
      { file: 'clip2.mp4', beats: 2, startAt: 0, transition: 'slideLeft' },
      { file: 'clip3.mp4', beats: 3, startAt: 0, transition: 'zoom' },
      { file: 'clip4.mp4', beats: 2, startAt: 0, transition: 'slideUp' },
      { file: 'clip5.mp4', beats: 2, startAt: 0, transition: 'slideRight' },
      { file: 'clip6.mp4', beats: 2, startAt: 0, transition: 'zoom' },
    ] as GameplayClip[],
    /** durée de la transition d'entrée de chaque clip (secondes) */
    transitionDuration: 0.2,
    /** petits textes « punchlines » affichés par-dessus certains clips (index du clip → texte) */
    captions: { 0: 'PRODUIS !', 2: 'AMÉLIORE !', 4: 'DOMINE !' } as Record<number, string>,
    /** volume du son des clips (0 = muet, la musique reste au-dessus) */
    clipVolume: 0,
  },

  // ---------- Scène 5 : appel à l'action ----------
  cta: {
    codeLabel: 'CODE DE L’ÎLE',
    playNow: 'JOUE MAINTENANT !',
    favorite: 'Ajoute en favori ⭐',
    background: { image: 'concept.png' },
  },

  // ---------- Musique ----------
  music: {
    file: 'music.mp3',
    volume: 0.85,
    fadeIn: 1.0,
    fadeOut: 2.0,
    /** décalage (s) pour faire démarrer la musique plus loin dans le morceau */
    startAt: 0,
  },

  // ---------- Décor ----------
  decor: {
    snowflakes: 90, // nombre de flocons (vertical) – adapté auto en horizontal
    sparkles: 14, // étoiles scintillantes
    garland: true, // guirlande lumineuse en haut de l'écran
  },

  // ---------- Zones sûres (en fraction de l'écran) ----------
  // TikTok / Shorts : rien d'important dans les 20 % du bas ni sur le bord droit.
  safeZone: {
    vertical: { top: 0.09, bottom: 0.2, left: 0.06, right: 0.16 },
    horizontal: { top: 0.08, bottom: 0.1, left: 0.06, right: 0.06 },
  },

  // ---------- Miniature 1280x720 ----------
  thumbnail: {
    image: 'concept.png',
    badge: 'NOUVEAU !',
  },
};

export type GameplayClip = {
  file: string;
  beats: number;
  /** démarrer la lecture du clip à X secondes */
  startAt: number;
  transition: 'zoom' | 'slideLeft' | 'slideRight' | 'slideUp';
};

// ---------- Valeurs dérivées (ne pas modifier) ----------
export const sec = (s: number) => Math.round(s * CONFIG.video.fps);
export const TOTAL_SECONDS = Object.values(CONFIG.scenes).reduce(
  (m, s) => Math.max(m, s.start + s.duration),
  0,
);
export const TOTAL_FRAMES = sec(TOTAL_SECONDS);
