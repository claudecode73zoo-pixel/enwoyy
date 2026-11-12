import React from 'react';
import { Composition, Still } from 'remotion';
import { CONFIG, TOTAL_FRAMES } from './config';
import { Trailer } from './Trailer';
import { Thumbnail } from './Thumbnail';

export const RemotionRoot: React.FC = () => {
  const { fps, vertical, horizontal, thumbnail } = CONFIG.video;
  return (
    <>
      <Composition id="TrailerVertical" component={Trailer} durationInFrames={TOTAL_FRAMES} fps={fps} {...vertical} />
      <Composition id="TrailerHorizontal" component={Trailer} durationInFrames={TOTAL_FRAMES} fps={fps} {...horizontal} />
      <Still id="Thumbnail" component={Thumbnail} {...thumbnail} />
    </>
  );
};
