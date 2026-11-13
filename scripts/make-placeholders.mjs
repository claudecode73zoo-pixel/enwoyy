// Génère des PNG transparents PLACEHOLDER (à remplacer par les vraies photos détourées).
import {createRequire} from 'node:module';
import {execSync} from 'node:child_process';
const require = createRequire(import.meta.url);
const globalRoot = execSync('npm root -g').toString().trim();
let pw;
try { pw = require('playwright'); } catch { pw = require(globalRoot + '/playwright'); }
const {chromium} = pw;
const defs = [
  ['tn-profil.png', 1600, 800, 'PROFIL'],
  ['tn-face.png', 1000, 1000, 'FACE'],
  ['tn-semelle.png', 1600, 800, 'SEMELLE'],
];
const browser = await chromium.launch();
for (const [name, w, h, label] of defs) {
  const page = await browser.newPage({viewport: {width: w, height: h}});
  await page.setContent(`<body style="margin:0;background:transparent"><svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF5A00"/><stop offset="1" stop-color="#FF9A1F"/></linearGradient></defs>
  <rect x="${w*0.06}" y="${h*0.2}" width="${w*0.88}" height="${h*0.6}" rx="${h*0.12}" fill="url(#g)" stroke="#fff" stroke-width="8" stroke-dasharray="30 18"/>
  <text x="${w/2}" y="${h/2}" font-family="Impact,Arial Narrow,sans-serif" font-size="${h*0.12}" fill="#000" text-anchor="middle">PLACEHOLDER ${label}</text>
  <text x="${w/2}" y="${h/2 + h*0.1}" font-family="Arial" font-size="${h*0.05}" fill="#000" text-anchor="middle">remplace par ta photo détourée</text></svg></body>`);
  await page.screenshot({path: `public/${name}`, omitBackground: true});
  await page.close();
}
await browser.close();
