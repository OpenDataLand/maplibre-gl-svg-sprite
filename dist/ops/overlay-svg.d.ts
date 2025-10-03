import { BaseOp } from './base.js';
/**
 * Compute target rendering size for an SVG
 *
 * Extracts dimensions from width/height attributes or viewBox, applying pixel ratio.
 * This is a public utility that can be used independently of the overlay operations.
 *
 * @param svg - SVG markup string
 * @param pixelRatio - Target pixel ratio
 * @param fallback - Fallback dimensions if none found in SVG
 * @returns Target width and height in pixels
 *
 * @example
 * ```typescript
 * const size = computeTargetSize('<svg width="24" height="24">...</svg>', 2, { width: 32, height: 32 });
 * // => { width: 48, height: 48 }
 * ```
 */
export declare function computeTargetSize(svg: string, pixelRatio: number, fallback: {
    width: number;
    height: number;
}): {
    width: number;
    height: number;
};
/**
 * Convert SVG to bitmap canvas at specified dimensions
 *
 * Tries multiple loading strategies (data URLs, blob URL) for cross-browser compatibility.
 * This is a public utility that can be used independently of the overlay operations.
 *
 * @param svg - SVG markup string
 * @param width - Target width in pixels
 * @param height - Target height in pixels
 * @returns Promise resolving to canvas with rendered SVG
 *
 * @example
 * ```typescript
 * const canvas = await svgToBitmap('<svg>...</svg>', 48, 48);
 * ctx.drawImage(canvas, 0, 0);
 * ```
 */
export declare function svgToBitmap(svg: string, width: number, height: number): Promise<HTMLCanvasElement>;
/**
 * Post-processing operation to overlay SVG icons on an image
 *
 * Supports query parameters: overlay, ovl, ofg, overlayFg, obg, overlayBg,
 * fg, bg, pixelRatio, anchor, ow, oh, ox, oy
 *
 * @example
 * ```typescript
 * const op = new OverlaySvg({ marker: '<svg>...</svg>' });
 * // Use with params: ?overlay=marker&ow=32&oh=32&anchor=center
 * ```
 */
export declare class OverlaySvg extends BaseOp {
    private svgIcons;
    /**
     * Create a new SVG overlay operation
     *
     * @param svgIcons - Record mapping icon IDs to SVG strings
     * @param id - Optional identifier for debugging
     */
    constructor(svgIcons: Record<string, string>, id?: string);
    run(ctx: CanvasRenderingContext2D, W: number, H: number, params: Record<string, string>): Promise<void>;
}
/**
 * Create an SVG overlay postprocess function
 *
 * Helper function that returns a Postprocess function for backwards compatibility.
 *
 * @param svgIcons - Record mapping icon IDs to SVG strings
 * @returns Postprocess function that overlays SVG icons
 *
 * @example
 * ```typescript
 * const postprocess = overlaySvg({ marker: '<svg>...</svg>' });
 * // Use in registerStyleImageMissingHandler
 * ```
 */
export declare function overlaySvg(svgIcons: Record<string, string>): import("./base.js").Postprocess;
