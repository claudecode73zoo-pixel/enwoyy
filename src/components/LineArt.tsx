import React from 'react';
import {Img, staticFile} from 'remotion';
import {COLORS, IMAGES, PROFIL_RATIO} from '../constants';

/**
 * Tracé néon de la paire (contours + nervures, tirés de la photo de profil).
 * `reveal` 0 -> 1 le dessine de gauche à droite, avec une barre de balayage lumineuse.
 */
export const LineArt: React.FC<{width: number; reveal: number; opacity?: number}> = ({width, reveal, opacity = 1}) => {
  const url = staticFile(IMAGES.lines);
  const image = `url(${url})`;
  return (
    <div
      style={{
        position: 'relative',
        width,
        height: width * PROFIL_RATIO,
        flexShrink: 0,
        opacity,
        filter: `drop-shadow(0 0 5px ${COLORS.orange}) drop-shadow(0 0 20px ${COLORS.orange})`,
      }}
    >
      {/* force le chargement de l'image utilisée comme masque avant la capture */}
      <Img src={url} style={{position: 'absolute', width: 2, height: 2, opacity: 0}} />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(90deg, ${COLORS.orange} 0%, ${COLORS.orangeLight} 55%, ${COLORS.yellow} 100%)`,
          WebkitMaskImage: image,
          maskImage: image,
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          clipPath: `inset(-10% ${100 - reveal * 100}% -10% 0)`,
        }}
      />
      {reveal > 0.01 && reveal < 0.99 ? (
        <div
          style={{
            position: 'absolute',
            top: '-12%',
            bottom: '-12%',
            left: `${reveal * 100}%`,
            width: 5,
            marginLeft: -2,
            borderRadius: 3,
            background: `linear-gradient(180deg, transparent, ${COLORS.white} 25%, ${COLORS.white} 75%, transparent)`,
            boxShadow: `0 0 26px 6px ${COLORS.orangeLight}`,
          }}
        />
      ) : null}
    </div>
  );
};
