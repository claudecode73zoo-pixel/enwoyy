import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

/** Charge la police condensée (Anton) avant le rendu. */
export const useFont = () => {
  const [handle] = useState(() => delayRender('font'));
  useEffect(() => {
    const face = new FontFace('TNAnton', `url(${staticFile('fonts/anton.woff2')})`);
    face
      .load()
      .then(() => {
        (document.fonts as unknown as {add(f: FontFace): void}).add(face);
        continueRender(handle);
      })
      .catch((e) => {
        console.error(e);
        continueRender(handle);
      });
  }, [handle]);
};
