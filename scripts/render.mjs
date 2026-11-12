#!/usr/bin/env node
/**
 * Rendu du trailer.
 *   node scripts/render.mjs all         → vertical + horizontal + miniature
 *   node scripts/render.mjs vertical    → out/trailer-vertical-1080x1920.mp4
 *   node scripts/render.mjs horizontal  → out/trailer-horizontal-1920x1080.mp4
 *   node scripts/render.mjs thumbnail   → out/miniature-1280x720.png
 *   node scripts/render.mjs stills      → out/stills/*.png (contrôle à 2, 6, 12, 22 et 28 s)
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const FPS = 30;
const STILL_SECONDS = [2, 6, 12, 22, 28];
const target = process.argv[2] ?? 'all';

// 1) placeholders pour les médias manquants
execFileSync('python3', ['scripts/make_placeholders.py'], { stdio: 'inherit' });
mkdirSync('out/stills', { recursive: true });

// 2) navigateur : Chrome Headless Shell déjà installé (sinon Remotion le télécharge tout seul)
const browserArgs = [];
const findHeadless = () => {
  if (process.env.REMOTION_BROWSER) return process.env.REMOTION_BROWSER;
  const base = '/opt/pw-browsers';
  if (!existsSync(base)) return null;
  const dir = readdirSync(base).find((d) => d.startsWith('chromium_headless_shell'));
  const exe = dir && join(base, dir, 'chrome-headless-shell-linux64', 'chrome-headless-shell');
  return exe && existsSync(exe) ? exe : null;
};
const browser = findHeadless();
if (browser) browserArgs.push(`--browser-executable=${browser}`);

const remotion = (...args) =>
  execFileSync('npx', ['remotion', ...args, ...browserArgs], { stdio: 'inherit' });

const jobs = {
  vertical: () => remotion('render', 'src/index.ts', 'TrailerVertical', 'out/trailer-vertical-1080x1920.mp4'),
  horizontal: () => remotion('render', 'src/index.ts', 'TrailerHorizontal', 'out/trailer-horizontal-1920x1080.mp4'),
  thumbnail: () => remotion('still', 'src/index.ts', 'Thumbnail', 'out/miniature-1280x720.png'),
  stills: () => {
    for (const comp of ['TrailerVertical', 'TrailerHorizontal']) {
      for (const s of STILL_SECONDS) {
        const tag = comp === 'TrailerVertical' ? 'vertical' : 'horizontal';
        remotion('still', 'src/index.ts', comp, `out/stills/${tag}-${String(s).padStart(2, '0')}s.png`, `--frame=${s * FPS}`);
      }
    }
  },
};

const order = target === 'all' ? ['vertical', 'horizontal', 'thumbnail'] : [target];
for (const j of order) {
  if (!jobs[j]) {
    console.error(`Cible inconnue : ${j}. Choix : all | vertical | horizontal | thumbnail | stills`);
    process.exit(1);
  }
  console.log(`\n▶ ${j}`);
  jobs[j]();
}
console.log('\n✅ Terminé — fichiers dans ./out/');
