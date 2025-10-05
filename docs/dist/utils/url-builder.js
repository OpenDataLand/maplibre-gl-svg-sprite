/**
 * @module url-builder
 *
 * Type-safe URL builder for SVG protocol URLs with full TypeScript support.
 * Provides an inheritance-based system that mirrors the ops architecture.
 */
/**
 * Encode a value for URL query string
 * @internal
 */
function encodeValue(value) {
    return encodeURIComponent(String(value));
}
/**
 * Build query string from parameters object
 * @internal
 */
function buildQueryString(params) {
    const entries = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeValue(value)}`);
    return entries.length > 0 ? '?' + entries.join('&') : '';
}
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
export function buildSvgUrl(params) {
    const { icon, protocol = 'svg', ...rest } = params;
    if (!icon) {
        throw new Error('icon parameter is required');
    }
    const queryString = buildQueryString(rest);
    return `${protocol}://${icon}${queryString}`;
}
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
export class SvgUrlBuilder {
    constructor(icon, protocol = 'svg') {
        this.params = { icon, protocol };
    }
    /**
     * Set width and height
     */
    size(width, height) {
        this.params.width = width;
        this.params.height = height !== null && height !== void 0 ? height : width;
        return this;
    }
    /**
     * Set pixel ratio for HiDPI displays
     */
    pixelRatio(ratio) {
        this.params.pixelRatio = ratio;
        return this;
    }
    /**
     * Set foreground and background colors
     */
    colors(opts) {
        if (opts.fg)
            this.params.fg = opts.fg;
        if (opts.bg)
            this.params.bg = opts.bg;
        if (opts.color)
            this.params.color = opts.color;
        return this;
    }
    /**
     * Apply color tint
     */
    tint(color) {
        this.params.tint = color;
        return this;
    }
    /**
     * Add text overlay
     */
    text(content, opts) {
        this.params.text = content;
        if (opts) {
            Object.assign(this.params, opts);
        }
        return this;
    }
    /**
     * Add SVG overlay
     */
    overlay(iconId, opts) {
        this.params.overlay = iconId;
        if (opts) {
            Object.assign(this.params, opts);
        }
        return this;
    }
    /**
     * Add icon grid
     */
    grid(iconIds, opts) {
        this.params.icons = iconIds.join(',');
        if (opts) {
            Object.assign(this.params, opts);
        }
        return this;
    }
    /**
     * Set custom parameter
     */
    param(key, value) {
        this.params[key] = value;
        return this;
    }
    /**
     * Build the final URL
     */
    build() {
        return buildSvgUrl(this.params);
    }
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
export function svgUrl(icon, protocol) {
    return new SvgUrlBuilder(icon, protocol);
}
