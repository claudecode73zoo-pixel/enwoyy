import { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile } from 'remotion';
import { CONFIG } from '../config';

let loaded = false;

/** Charge la police depuis assets/fonts ; renvoie true quand elle est prête (les tailles de texte sont mesurées avec). */
export const useFont = () => {
  const [ready, setReady] = useState(loaded);
  const [handle] = useState(() => (loaded ? null : delayRender('Chargement police')));
  useEffect(() => {
    if (handle === null) return;
    const face = new FontFace(CONFIG.font.family, `url('${staticFile(CONFIG.font.file)}')`);
    face
      .load()
      .then((f) => {
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(f);
        loaded = true;
        setReady(true);
        continueRender(handle);
      })
      .catch((e) => {
        console.error('Police introuvable', e);
        setReady(true);
        continueRender(handle);
      });
  }, [handle]);
  return ready;
};
