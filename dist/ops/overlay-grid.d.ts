import { BaseOp } from './base.js';
/**
 * Post-processing operation to overlay a grid of SVG icons
 *
 * Supports query parameters: icons, grid, gap, columns, gridFg, gfg, gridBg, gbg,
 * fg, bg, itemW, itemH, gridAnchor, anchor, gx, gy, bgFill, pixelRatio
 *
 * @group Operations
 *
 * @example
 * Create a grid overlay operation for displaying multiple icons.
 * ```typescript
 * const op = new OverlayGrid({ icon1: '<svg>...</svg>', icon2: '<svg>...</svg>' });
 * // Use with params: ?icons=icon1,icon2&columns=2&gap=4
 * ```
 * @see {@link overlayText} for text overlays
 * @see {@link overlaySvg} for single SVG overlays
 */
export declare class OverlayGrid extends BaseOp {
    private svgIcons;
    /**
     * Create a new grid overlay operation
     *
     * @param svgIcons - Record mapping icon IDs to SVG strings
     * @param id - Optional identifier for debugging
     */
    constructor(svgIcons: Record<string, string>, id?: string);
    /**
     * Compute the natural grid size (CSS pixels) for the current params.
     * Returns { width, height } that fits icons using itemW/itemH or inferred sizes,
     * including gaps between cells.
     */
    measure(params: Record<string, string>): {
        width: number;
        height: number;
    };
    run(ctx: CanvasRenderingContext2D, W: number, H: number, params: Record<string, string>): Promise<void>;
}
/**
 * Create a grid overlay postprocess function
 *
 * Helper function that returns a Postprocess function for backwards compatibility.
 *
 * @param svgIcons - Record mapping icon IDs to SVG strings
 * @returns Postprocess function that overlays a grid of icons
 *
 * @example
 * ```typescript
 * const postprocess = overlayGrid({ icon1: '<svg>...</svg>', icon2: '<svg>...</svg>' });
 * // Use in registerNamedImageHandlers
 * ```
 */
export declare function overlayGrid(svgIcons: Record<string, string>): (((ctx: CanvasRenderingContext2D, W: number, H: number, params: Record<string, string>) => Promise<void>) & {
    measure?: (params: Record<string, string>) => {
        width: number;
        height: number;
    };
});
