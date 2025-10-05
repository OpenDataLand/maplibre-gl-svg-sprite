import { BaseOp } from './base.js';
/**
 * Apply a color tint overlay to the current canvas content
 *
 * Uses source-atop composite operation to tint existing pixels while preserving alpha.
 *
 * @param ctx - Canvas 2D rendering context
 * @param w - Width in pixels
 * @param h - Height in pixels
 * @param color - Tint color (CSS color string)
 *
 * @example
 * ```typescript
 * applySpriteTint(ctx, 24, 24, '#ff0000'); // Tint to red
 * ```
 */
export declare function applySpriteTint(ctx: CanvasRenderingContext2D, w: number, h: number, color: string): void;
/**
 * Post-processing operation to apply a color tint to an image
 *
 * Supports query parameters: color, tint, tintColor
 *
 * @example
 * ```typescript
 * const op = new SpriteTint();
 * // Use with params: ?color=red or ?tint=#ff0000
 * ```
 */
export declare class SpriteTint extends BaseOp {
    /**
     * Create a new sprite tint operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id?: string);
    run(ctx: CanvasRenderingContext2D, w: number, h: number, params: Record<string, string>): void;
}
/**
 * Create a sprite tint postprocess function
 *
 * @returns Postprocess function that applies a color tint
 *
 * @example
 * ```typescript
 * const postprocess = spriteTint();
 * // Use in registerStyleImageMissingHandler
 * ```
 */
export declare function spriteTint(): import("./base.js").Postprocess;
