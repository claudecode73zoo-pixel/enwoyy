import React from 'react';
import {Img, staticFile} from 'remotion';

type Props = {
  src: string;
  width: number;
  /** Passage d'un reflet lumineux sur la paire : 0 -> 1 (absent hors de cet intervalle). */
  sweep?: number;
  /** Opacité du reflet au sol (0 = aucun). */
  reflection?: number;
  shadow?: boolean;
};

const mask = (image: string, size?: string): React.CSSProperties => ({
  WebkitMaskImage: image,
  maskImage: image,
  ...(size ? {WebkitMaskSize: size, maskSize: size, WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat'} : {}),
});

/** Photo détourée de la paire, avec ombre de contact, reflet au sol et reflet lumineux. */
export const Shoe: React.FC<Props> = ({src, width, sweep, reflection = 0.26, shadow = true}) => {
  const url = staticFile(src);
  return (
    <div style={{position: 'relative', width, flexShrink: 0}}>
      {shadow ? (
        <div
          style={{
            position: 'absolute',
            left: '3%',
            right: '3%',
            bottom: -30,
            height: 84,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 70%)',
          }}
        />
      ) : null}
      {reflection > 0 ? (
        <Img
          src={url}
          style={{
            position: 'absolute',
            left: 0,
            top: '100%',
            width: '100%',
            marginTop: -12,
            transform: 'scaleY(-1)',
            opacity: reflection,
            filter: 'blur(2.5px)',
            ...mask('linear-gradient(to top, #000 0%, transparent 55%)'),
          }}
        />
      ) : null}
      <Img
        src={url}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          filter: 'saturate(1.08) contrast(1.04) drop-shadow(0 16px 22px rgba(0,0,0,0.5))',
        }}
      />
      {sweep !== undefined && sweep > 0 && sweep < 1 ? (
        <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...mask(`url(${url})`, '100% 100%')}}>
          <div
            style={{
              position: 'absolute',
              top: '-30%',
              bottom: '-30%',
              width: '24%',
              left: `${-40 + 170 * sweep}%`,
              transform: 'skewX(-22deg)',
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.62) 50%, rgba(255,255,255,0) 100%)',
            }}
          />
        </div>
      ) : null}
    </div>
  );
};
