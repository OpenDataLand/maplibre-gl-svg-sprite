import type { MapLibreLike } from './types/maplibre-like.js';
/** Input structure for an SVG icon */
export interface SvgInput {
    /** Unique identifier for the icon */
    id: string;
    /** SVG markup string */
    svg: string;
}
/** Metadata for a single icon within a sprite sheet */
export interface SpriteJSONItem {
    /** Icon width in pixels */
    width: number;
    /** Icon height in pixels */
    height: number;
    /** X coordinate within sprite sheet */
    x: number;
    /** Y coordinate within sprite sheet */
    y: number;
    /** Pixel ratio used when rendering */
    pixelRatio: number;
}
/** Sprite metadata JSON mapping icon IDs to locations */
export type SpriteJSON = Record<string, SpriteJSONItem>;
/** Result from generating a browser sprite */
export interface SpriteResult {
    /** Object URL for sprite PNG */
    spriteURL: string;
    /** Object URL for JSON metadata */
    jsonURL: string;
    /** Sprite metadata object */
    json: SpriteJSON;
    /** Canvas with rendered sprite */
    canvas: HTMLCanvasElement;
    /** Total sprite width */
    width: number;
    /** Total sprite height */
    height: number;
}
/** Combined sprite assets (metadata + PNG) */
export interface SpriteAssets {
    /** Sprite metadata JSON */
    json: SpriteJSON;
    /** PNG image bytes */
    png: ArrayBuffer;
}
/** Registry mapping sprite keys to assets at different pixel ratios */
export type ProtocolRegistry = Record<string, {
    1: SpriteAssets;
    2?: SpriteAssets;
    [ratio: number]: SpriteAssets | undefined;
}>;
/** Options for custom protocol registration */
export interface ProtocolOptions {
    /** When true, assets served once then removed */
    oneShot?: boolean;
    /** Expire assets after first request + ttlMs */
    ttlMs?: number;
    /** Log requests and responses for debugging */
    debug?: boolean;
}
/**
 * Generate a sprite sheet from SVG icons for browser usage
 *
 * @param params - Configuration object
 * @param params.imgs - Array of SVG icons
 * @param params.pixelRatio - Pixel ratio for rendering (default: 1)
 * @returns Promise resolving to sprite result with URLs and canvas
 * @throws {Error} If parameters are invalid
 */
export declare function generateBrowserSprite({ imgs, pixelRatio }: {
    imgs: SvgInput[];
    pixelRatio?: number;
}): Promise<SpriteResult>;
/**
 * Builder class for creating and managing sprite sheets from SVG icons
 *
 * @example
 * ```typescript
 * const builder = new SpriteBuilder({ pixelRatio: 2 });
 * builder.addSvg('icon1', '<svg>...</svg>');
 * const { sprite, json } = await builder.exportURLs();
 * // Don't forget to call builder.destroy() when done
 * ```
 */
export declare class SpriteBuilder {
    private _pixelRatio;
    private _items;
    private _dirty;
    private _built;
    private _urls;
    /**
     * Create a new SpriteBuilder
     *
     * @param options - Configuration options
     * @param options.pixelRatio - Pixel ratio for rendering (default: 1)
     */
    constructor({ pixelRatio }?: {
        pixelRatio?: number;
    });
    /** Set pixel ratio (must be positive number) */
    setPixelRatio(ratio: number): void;
    /** Add an SVG icon to the sprite */
    addSvg(id: string, svg: string): void;
    /** Export sprite sheet as object URL */
    exportSpriteURL(): Promise<string>;
    /** Export JSON metadata as object URL */
    exportJSONURL(): Promise<string>;
    /** Export both sprite and JSON URLs */
    exportURLs(): Promise<{
        sprite: string;
        json: string;
    }>;
    /** Export JSON metadata object */
    exportJSON(): Promise<SpriteJSON>;
    /** Export canvas element */
    exportCanvas(): Promise<HTMLCanvasElement>;
    /** Export sprite assets (JSON + PNG bytes) */
    exportAssets(): Promise<SpriteAssets>;
    /** Clean up resources and revoke URLs */
    destroy(): void;
    /** Revoke a specific object URL */
    expire(url?: string | null): void;
    private _markDirty;
    private _ensureBuilt;
    /**
     * Register a MapLibre custom protocol to serve sprites from memory
     *
     * @param maplibre - MapLibre GL JS instance
     * @param protocol - Protocol name
     * @param registry - Sprite assets registry
     * @param options - Protocol options
     * @returns Function to unregister protocol
     */
    static registerMapLibreProtocol(maplibre: MapLibreLike, protocol: string, registry: Record<string, {
        1: SpriteAssets;
        2?: SpriteAssets;
    }>, options?: ProtocolOptions): () => void;
}
/**
 * Build a protocol registry from icons at multiple pixel ratios
 *
 * @param key - Registry key for the sprite set
 * @param icons - Array of SVG icons
 * @param ratios - Pixel ratios to generate (default: [1, 2])
 * @returns Promise resolving to protocol registry
 */
export declare function buildSpriteRegistryFromIcons(key: string, icons: SvgInput[], ratios?: number[]): Promise<ProtocolRegistry>;
/**
 * Build and register a protocol directly from icons
 *
 * @param maplibre - MapLibre GL JS instance
 * @param protocol - Protocol name
 * @param key - Registry key
 * @param icons - Array of SVG icons
 * @param ratios - Pixel ratios (default: [1, 2])
 * @param options - Protocol options
 * @returns Promise resolving to unregister function
 */
export declare function registerProtocolFromIcons(maplibre: MapLibreLike, protocol: string, key: string, icons: SvgInput[], ratios?: number[], options?: ProtocolOptions): Promise<() => void>;
/**
 * Register a one-shot sprite protocol (sprites served once then removed)
 *
 * @param maplibre - MapLibre GL JS instance
 * @param protocol - Protocol name
 * @param key - Registry key
 * @param icons - Array of SVG icons
 * @param ratios - Pixel ratios (default: [1, 2])
 * @param ttlMs - Optional TTL in milliseconds
 * @returns Promise resolving to unregister function
 */
export declare function registerOneShotSpriteFromIcons(maplibre: MapLibreLike, protocol: string, key: string, icons: SvgInput[], ratios?: number[], ttlMs?: number): Promise<() => void>;
/**
 * Register an SVG protocol for on-the-fly parameterized icon rendering
 *
 * URL format: `${protocol}://<id>.png?color=#ff0000&width=24&pixelRatio=2`
 *
 * @param maplibre - MapLibre GL JS instance
 * @param protocol - Protocol name
 * @param icons - Record mapping icon IDs to SVG strings
 * @returns Function to unregister the protocol
 * @throws {Error} If maplibre doesn't have addProtocol/removeProtocol
 */
export declare function registerSVGProtocol(maplibre: MapLibreLike, protocol: string, icons: Record<string, string>): () => void;
