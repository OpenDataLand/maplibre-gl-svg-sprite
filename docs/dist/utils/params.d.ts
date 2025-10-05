/**
 * Parse a query string into key-value pairs
 *
 * Supports both URLSearchParams (preferred) and manual parsing fallback.
 *
 * @param qs - Query string (with or without leading '?')
 * @returns Object mapping parameter names to values
 *
 * @example
 * ```typescript
 * const params = parseQuery('?color=red&width=24');
 * // => { color: 'red', width: '24' }
 * ```
 */
export declare function parseQuery(qs: string): Record<string, string>;
/**
 * Apply query parameters to modify SVG attributes
 *
 * Supports color, width, height, fg/foreground, and bg/background parameters.
 *
 * @param svg - SVG markup string
 * @param params - Query parameters to apply
 * @returns Modified SVG string
 *
 * @example
 * ```typescript
 * const svg = '<svg width="24" height="24">...</svg>';
 * const modified = applySvgParams(svg, { color: 'red', width: '48' });
 * ```
 */
export declare function applySvgParams(svg: string, params: Record<string, string>): string;
