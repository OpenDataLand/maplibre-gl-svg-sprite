import type { MapLike } from '../types/maplibre-like.js';
export type AnimatedSvgOptions = {
    width?: number;
    height?: number;
    fps?: number;
    pixelRatio?: number;
    loop?: boolean;
};
export declare function createAnimatedSvgImage(map: MapLike, id: string, svgMarkup: string, options?: AnimatedSvgOptions): () => void;
