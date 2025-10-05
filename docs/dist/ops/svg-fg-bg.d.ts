/**
 * Apply foreground and background colors to SVG elements with data-fg/data-bg attributes
 *
 * Injects CSS rules to style elements marked with `data-fg` or `data-bg` attributes.
 *
 * @param svg - SVG markup string
 * @param fg - Foreground color (applied to elements with data-fg attribute)
 * @param bg - Background color (applied to elements with data-bg attribute)
 * @returns Modified SVG string with injected styles
 *
 * @example
 * ```typescript
 * const svg = '<svg><path data-fg="true"/><rect data-bg="true"/></svg>';
 * const colored = applySvgFgBg(svg, '#ff0000', '#0000ff');
 * ```
 */
export declare function applySvgFgBg(svg: string, fg?: string, bg?: string, opts?: {
    debug?: boolean;
}): string;
