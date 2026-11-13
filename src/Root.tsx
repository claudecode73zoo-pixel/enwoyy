import React from 'react';
import {Composition} from 'remotion';
import {TnOrange} from './TnOrange';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './constants';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="TnOrange"
    component={TnOrange}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
