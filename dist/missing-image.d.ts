import type { MapLike } from './types/maplibre-like.js';
import type { ProtocolRegistry } from './sprite-core.js';
/**
 * Options for configuring the missing image handler
 */
export interface MissingImageHandlerOptions {
    /** Generate from SVG strings if provided */
    svgIcons?: Record<string, string>;
    /** Recolor from in-memory sprite registry if available */
    protocolRegistry?: ProtocolRegistry;
    /** Registry key used with registerMapLibreProtocol */
    spriteKey?: string;
    /** Optional custom SVG transformation function */
    transformSvg?: (svg: string, params: Record<string, string>) => string;
    /** Optional post-processing function for canvas */
    postprocessCanvas?: (ctx: CanvasRenderingContext2D, w: number, h: number, params: Record<string, string>) => void | Promise<void>;
    /** Enable debug logging */
    debug?: boolean;
    /** Render backing canvas at device pixel ratio (default: true) */
    dprBackBuffer?: boolean;
    /** Add a transparent placeholder immediately to suppress MapLibre warnings (default: false) */
    eagerPlaceholder?: boolean;
}
/**
 * Register a handler to auto-generate missing images with query parameters
 *
 * Automatically handles image requests like `icon?color=#f00&width=24&height=24`
 *
 * @param map - MapLibre map instance
 * @param options - Handler configuration options
 * @returns Function to unregister the handler
 *
 * @example
 * ```typescript
 * const unregister = registerStyleImageMissingHandler(map, {
 *   svgIcons: { marker: '<svg>...</svg>' },
 *   debug: true
 * });
 * // Now map.addLayer can reference 'marker?color=red&width=24'
 * ```
 */
export declare function registerStyleImageMissingHandler(map: MapLike, options: MissingImageHandlerOptions): () => void;
