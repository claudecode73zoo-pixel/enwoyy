# Trailer – Tycoon de Noël (Fortnite Créatif / UEFN)

Vidéo de présentation de 30 s générée avec **Remotion** (React + TypeScript).

## Tout se règle dans `src/config.ts`
Nom de la map, code de l'île, textes, fonctionnalités (icônes), couleurs, durées des scènes, tempo (BPM) et découpe des clips, musique (volume, fondus), zones sûres.

## Médias (`./assets/`)
| Fichier | Rôle |
|---|---|
| `concept.png` | capture de la map (Ken Burns, fonds flous, miniature) |
| `clip1.mp4` … `clip6.mp4` | clips de gameplay (montage 18–25 s) |
| `music.mp3` | musique libre de droits (calée sur `gameplay.bpm`, 120 par défaut) |
| `fonts/LilitaOne-Regular.ttf` | police (Google Fonts, licence OFL) |

Les fichiers manquants sont remplacés par des **placeholders** (marqués « PLACEHOLDER »).
Remplace-les par tes fichiers **avec le même nom** ; `npm run placeholders` liste ceux qui restent.

## Commandes
```bash
npm install
npm run stills      # images de contrôle → out/stills/ (2, 6, 12, 22, 28 s)
npm run render      # tout : vertical + horizontal + miniature
npm run render:vertical | render:horizontal | render:thumbnail
npm run studio      # aperçu interactif dans le navigateur
```

## Sorties (`./out/`)
- `trailer-vertical-1080x1920.mp4` – TikTok / Shorts
- `trailer-horizontal-1920x1080.mp4` – YouTube
- `miniature-1280x720.png`
