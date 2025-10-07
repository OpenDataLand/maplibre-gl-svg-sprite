import { BaseOp, asPostprocess } from './base.js';
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
export function applySpriteTint(ctx, w, h, color) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'source-over';
}
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
export class SpriteTint extends BaseOp {
    /**
     * Create a new sprite tint operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id = 'spriteTint') { super(id); }
    run(ctx, w, h, params) {
        const color = params.color || params.tint || params.tintColor;
        if (!color)
            return;
        applySpriteTint(ctx, w, h, color);
    }
}
/**
 * Create a sprite tint postprocess function
 *
 * @returns Postprocess function that applies a color tint
 *
 * @example
 * ```typescript
 * const postprocess = spriteTint();
 * // Use in registerNamedImageHandlers
 * ```
 */
export function spriteTint() {
    return asPostprocess(new SpriteTint());
}
