/**
 * @module url-builder
 *
 * Type-safe URL builder for SVG protocol URLs with full TypeScript support.
 * Provides an inheritance-based system that mirrors the ops architecture.
 */
/**
 * Base parameters available for all SVG URLs
 */
export interface BaseSvgParams {
    /** Icon identifier */
    icon: string;
    /** Width in CSS pixels */
    width?: number;
    /** Height in CSS pixels */
    height?: number;
    /** Pixel ratio for HiDPI displays */
    pixelRatio?: number;
    /** Protocol scheme (default: 'svg') */
    protocol?: string;
}
/**
 * Parameters for SVG foreground/background color manipulation
 * Maps to applySvgFgBg operation
 */
export interface SvgColorParams {
    /** Foreground color (also accepts 'foreground') */
    fg?: string;
    /** Background color (also accepts 'background') */
    bg?: string;
    /** Alias for fg */
    foreground?: string;
    /** Alias for bg */
    background?: string;
    /** General color override */
    color?: string;
}
/**
 * Parameters for sprite tinting operation
 * Maps to SpriteTint op
 */
export interface SpriteTintParams {
    /** Tint color */
    tint?: string;
    /** Alias for tint */
    tintColor?: string;
}
/**
 * Parameters for text overlay operation
 * Maps to OverlayText op
 */
export interface OverlayTextParams {
    /** Text content to display */
    text?: string;
    /** Alias for text */
    label?: string;
    /** Font size in pixels (default: 14) */
    fontSize?: number;
    /** Font weight (default: 'bold') */
    fontWeight?: string | number;
    /** Font style (default: 'normal') */
    fontStyle?: string;
    /** Font family (default: system-ui) */
    fontFamily?: string;
    /** Text fill color */
    textColor?: string;
    /** Alias for textColor */
    fill?: string;
    /** Text stroke color (default: '#000') */
    textStroke?: string;
    /** Text stroke width (default: 3) */
    textStrokeWidth?: number;
    /** Text padding in pixels (default: 0) */
    textPadding?: number;
    /** Text anchor position: 'center', 'top', 'bottom', 'left', 'right', or combinations */
    textAnchor?: 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    /** Alias for textAnchor */
    anchor?: string;
    /** Text X offset */
    tx?: number;
    /** Text Y offset */
    ty?: number;
    /** Font load timeout in ms (default: 1500) */
    fontLoadTimeout?: number;
    /** Auto-pick contrasting text color from bg/overlay colors when textColor not provided */
    textAutoColor?: boolean;
    /** Uppercase the text content */
    textUppercase?: boolean;
}
/**
 * Parameters for SVG overlay operation
 * Maps to OverlaySvg op
 */
export interface OverlaySvgParams {
    /** Overlay icon ID(s), comma/space separated */
    overlay?: string;
    /** Alias for overlay */
    ovl?: string;
    /** Overlay foreground color */
    overlayFg?: string;
    /** Alias for overlayFg */
    ofg?: string;
    /** Overlay background color */
    overlayBg?: string;
    /** Alias for overlayBg */
    obg?: string;
    /** Overlay width */
    ow?: number;
    /** Overlay height */
    oh?: number;
    /** Overlay X offset */
    ox?: number;
    /** Overlay Y offset */
    oy?: number;
    /** Debug: show rectangle around overlay */
    debugRect?: boolean;
    /** Debug: log SVG transformations */
    logSvg?: boolean;
}
/**
 * Parameters for grid overlay operation
 * Maps to OverlayGrid op
 */
export interface OverlayGridParams {
    /** Icon IDs for grid, comma/space separated */
    icons?: string;
    /** Alias for icons */
    grid?: string;
    /** Gap between grid items in pixels (default: 2) */
    gap?: number;
    /** Number of columns (default: number of icons) */
    columns?: number;
    /** Extra columns for padding */
    extraCols?: number;
    /** Alias for extraCols */
    padCols?: number;
    /** Grid foreground color */
    gridFg?: string;
    /** Alias for gridFg */
    gfg?: string;
    /** Grid background color */
    gridBg?: string;
    /** Alias for gridBg */
    gbg?: string;
    /** Individual item width */
    itemW?: number;
    /** Individual item height */
    itemH?: number;
    /** Grid anchor position */
    gridAnchor?: string;
    /** Grid X offset */
    gx?: number;
    /** Grid Y offset */
    gy?: number;
    /** Background fill color for debugging */
    bgFill?: string;
    /** Cell background color */
    cellBg?: string;
    /** Cell background icon ID */
    cellBgIcon?: string;
    /** Alias for cellBgIcon */
    badge?: string;
    /** Cell padding (default: 2) */
    cellPad?: number;
    /** Alias for cellPad */
    padding?: number;
    /** Cell border radius (default: 4) */
    cellR?: number;
    /** Alias for cellR */
    radius?: number;
    /** Icon padding within cell */
    iconPad?: number;
    /** Icon scale factor (0.05-1, default: 1) */
    iconScale?: number;
    /** Outer padding around entire grid (default: 3) */
    outerPad?: number;
    /** Alias for outerPad */
    gridPad?: number;
}
/**
 * Complete parameter set combining all operation types
 */
export type SvgUrlParams = BaseSvgParams & SvgColorParams & SpriteTintParams & OverlayTextParams & OverlaySvgParams & OverlayGridParams;
/**
 * Complete parameter set for named-route URLs (no `icon` field)
 */
export type RouteUrlParams = Omit<BaseSvgParams, 'icon' | 'protocol'> & SvgColorParams & SpriteTintParams & OverlayTextParams & OverlaySvgParams & OverlayGridParams;
/**
 * Build a type-safe SVG protocol URL
 *
 * @param params - URL parameters with full TypeScript support
 * @returns SVG protocol URL string
 *
 * @example
 * ```typescript
 * // Simple marker with colors
 * buildSvgUrl({
 *   icon: 'marker',
 *   width: 44,
 *   height: 44,
 *   pixelRatio: 2,
 *   bg: '#ffffff',
 *   fg: '#d35400'
 * });
 * // => 'svg://marker?width=44&height=44&pixelRatio=2&bg=%23ffffff&fg=%23d35400'
 *
 * // Marker with text overlay
 * buildSvgUrl({
 *   icon: 'marker',
 *   width: 44,
 *   height: 44,
 *   pixelRatio: 2,
 *   bg: '#ffffff',
 *   fg: '#d35400',
 *   text: 'EWR',
 *   fontSize: 18,
 *   textColor: '#d35400'
 * });
 *
 * // With SVG overlay
 * buildSvgUrl({
 *   icon: 'marker',
 *   width: 64,
 *   height: 64,
 *   overlay: 'star',
 *   ow: 24,
 *   oh: 24,
 *   anchor: 'top-right'
 * });
 *
 * // Grid of icons
 * buildSvgUrl({
 *   icon: 'base',
 *   width: 100,
 *   height: 100,
 *   icons: 'icon1,icon2,icon3,icon4',
 *   columns: 2,
 *   gap: 4
 * });
 * ```
 */
export declare function buildSvgUrl(params: SvgUrlParams): string;
/**
 * Fluent builder class for constructing SVG URLs with method chaining
 *
 * @example
 * ```typescript
 * const url = new SvgUrlBuilder('marker')
 *   .size(44, 44)
 *   .pixelRatio(2)
 *   .colors({ fg: '#d35400', bg: '#ffffff' })
 *   .text('EWR', { fontSize: 18, textColor: '#d35400' })
 *   .build();
 * ```
 */
export declare class SvgUrlBuilder {
    private params;
    constructor(icon: string, protocol?: string);
    /**
     * Set width and height
     */
    size(width: number, height?: number): this;
    /**
     * Set pixel ratio for HiDPI displays
     */
    pixelRatio(ratio: number): this;
    /**
     * Set foreground and background colors
     */
    colors(opts: {
        fg?: string;
        bg?: string;
        color?: string;
    }): this;
    /**
     * Apply color tint
     */
    tint(color: string): this;
    /**
     * Add text overlay
     */
    text(content: string, opts?: Partial<OverlayTextParams>): this;
    /**
     * Add SVG overlay
     */
    overlay(iconId: string, opts?: Partial<OverlaySvgParams>): this;
    /**
     * Add icon grid
     */
    grid(iconIds: string[], opts?: Partial<OverlayGridParams>): this;
    /**
     * Set custom parameter
     */
    param<K extends keyof SvgUrlParams>(key: K, value: SvgUrlParams[K]): this;
    /**
     * Build the final URL
     */
    build(): string;
}
/**
 * Create a fluent builder for SVG URLs
 *
 * @param icon - Icon identifier
 * @param protocol - Protocol scheme (default: 'svg')
 * @returns SvgUrlBuilder instance
 *
 * @example
 * ```typescript
 * const url = svgUrl('marker')
 *   .size(44, 44)
 *   .colors({ fg: '#ff0000' })
 *   .build();
 * ```
 */
export declare function svgUrl(icon: string, protocol?: string): SvgUrlBuilder;
/**
 * Build a type-safe named-route URL (e.g., 'airport?width=44&...')
 */
export declare function buildRouteUrl(route: string, params?: RouteUrlParams): string;
/** Fluent builder for named-route URLs */
export declare class RouteUrlBuilder {
    private route;
    private params;
    constructor(route: string);
    size(width: number, height?: number): this;
    pixelRatio(ratio: number): this;
    colors(opts: {
        fg?: string;
        bg?: string;
        color?: string;
    }): this;
    tint(color: string): this;
    text(content: string, opts?: Partial<OverlayTextParams>): this;
    overlay(iconId: string, opts?: Partial<OverlaySvgParams>): this;
    grid(iconIds: string[], opts?: Partial<OverlayGridParams>): this;
    param<K extends keyof RouteUrlParams>(key: K, value: RouteUrlParams[K]): this;
    build(): string;
}
/** Create a fluent builder for named-route URLs */
export declare function routeUrl(route: string): RouteUrlBuilder;
