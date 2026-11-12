import { useVideoConfig } from 'remotion';
import { CONFIG } from './config';

export type Layout = {
  W: number;
  H: number;
  isVertical: boolean;
  /** 1 unité = 1px sur un écran de référence dont le petit côté fait 1080px */
  u: number;
  safe: { top: number; bottom: number; left: number; right: number; width: number; height: number };
};

export const useLayout = (): Layout => {
  const { width: W, height: H } = useVideoConfig();
  const isVertical = H > W;
  const z = isVertical ? CONFIG.safeZone.vertical : CONFIG.safeZone.horizontal;
  const top = H * z.top;
  const bottom = H * z.bottom;
  const left = W * z.left;
  const right = W * z.right;
  return {
    W,
    H,
    isVertical,
    u: Math.min(W, H) / 1080,
    safe: { top, bottom, left, right, width: W - left - right, height: H - top - bottom },
  };
};
