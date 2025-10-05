import { BaseOp } from './base.js';
/**
 * Post-processing operation to overlay text on an image
 *
 * Supports query parameters: text, label, fontSize, fontWeight, fontFamily,
 * textColor, fill, textStroke, textStrokeWidth, textPadding, textAnchor, anchor, tx, ty
 *
 * @example
 * ```typescript
 * const op = new OverlayText();
 * // Use with params: ?text=Hello&fontSize=20&textColor=red
 * ```
 */
export declare class OverlayText extends BaseOp {
    /**
     * Create a new text overlay operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id?: string);
    run(ctx: CanvasRenderingContext2D, W: number, H: number, params: Record<string, string>): Promise<void>;
}
/**
 * Create a text overlay postprocess function
 *
 * Helper function that returns a Postprocess function for backwards compatibility.
 *
 * @returns Postprocess function that overlays text
 *
 * @example
 * ```typescript
 * const postprocess = overlayText();
 * // Use in registerStyleImageMissingHandler
 * ```
 */
export declare function overlayText(): import("./base.js").Postprocess;
