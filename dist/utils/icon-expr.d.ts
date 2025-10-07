/**
 * Utilities to build MapLibre `icon-image` expressions ergonomically.
 *
 * Produces an expression equivalent to:
 * ['concat', 'route?key=val', '&overlay=', ['get','id'], '&', 'ow=24&oh=24', ...]
 */
export type MLExpr = any;
export declare class IconExprBuilder {
    private parts;
    constructor(route: string, initial?: Record<string, any>);
    /** Append raw query params (merged at the end). */
    append(params: Record<string, any>): this;
    /** Set overall width/height (CSS pixels). */
    size(width: number, height?: number): this;
    /** Force pixel ratio for HiDPI (omit to use device DPR). */
    pixelRatio(ratio: number): this;
    /**
     * Add overlay=... (string or expression) with optional placement/size.
     */
    overlay(value: string | MLExpr, opts?: Record<string, any>): this;
    /**
     * Add text=... (string or expression) with optional typography/placement.
     */
    text(value: string | MLExpr, opts?: Record<string, any>): this;
    /** Add an arbitrary name=value pair; value may be expression or string. */
    param(name: string, value: string | MLExpr): this;
    /** Build the final MapLibre expression. */
    build(): MLExpr;
}
/** Start a builder for a named route expression. */
export declare function iconExpr(route: string, initial?: Record<string, any>): IconExprBuilder;
