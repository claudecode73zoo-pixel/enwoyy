import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

const FONTS = [
  ['TNAnton', 'fonts/anton.woff2'],
  ['TNMono', 'fonts/space-mono-700.woff2'],
] as const;

/** Charge les polices (Anton pour les titres, Space Mono pour les légendes) avant le rendu. */
export const useFont = () => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(
      FONTS.map(([family, file]) =>
        new FontFace(family, `url(${staticFile(file)})`).load().then((face) => {
          (document.fonts as unknown as {add(f: FontFace): void}).add(face);
        }),
      ),
    )
      .catch((e) => console.error(e))
      .finally(() => continueRender(handle));
  }, [handle]);
};
