/**
 * Utilities to build MapLibre `icon-image` expressions ergonomically.
 *
 * Produces an expression equivalent to:
 * ['concat', 'route?key=val', '&overlay=', ['get','id'], '&', 'ow=24&oh=24', ...]
 */
function qs(obj = {}) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(obj)) {
        if (v === undefined || v === null || v === '')
            continue;
        params.set(k, String(v));
    }
    const s = params.toString();
    return s ? `?${s}` : '';
}
export class IconExprBuilder {
    constructor(route, initial) {
        const head = route + (initial ? qs(initial) : '');
        this.parts = ['concat', head];
    }
    /** Append raw query params (merged at the end). */
    append(params) {
        const s = qs(params);
        if (s)
            this.parts.push('&', s.slice(1));
        return this;
    }
    /** Set overall width/height (CSS pixels). */
    size(width, height) { return this.append({ width, height: height !== null && height !== void 0 ? height : width }); }
    /** Force pixel ratio for HiDPI (omit to use device DPR). */
    pixelRatio(ratio) { return this.append({ pixelRatio: ratio }); }
    /**
     * Add overlay=... (string or expression) with optional placement/size.
     */
    overlay(value, opts) {
        this.parts.push('&overlay=');
        if (Array.isArray(value))
            this.parts.push(value);
        else
            this.parts.push(String(value));
        if (opts)
            this.append(opts);
        return this;
    }
    /**
     * Add text=... (string or expression) with optional typography/placement.
     */
    text(value, opts) {
        this.parts.push('&text=');
        if (Array.isArray(value))
            this.parts.push(value);
        else
            this.parts.push(String(value));
        if (opts)
            this.append(opts);
        return this;
    }
    /** Add an arbitrary name=value pair; value may be expression or string. */
    param(name, value) {
        this.parts.push('&' + name + '=');
        if (Array.isArray(value))
            this.parts.push(value);
        else
            this.parts.push(String(value));
        return this;
    }
    /** Build the final MapLibre expression. */
    build() { return this.parts; }
}
/** Start a builder for a named route expression. */
export function iconExpr(route, initial) {
    return new IconExprBuilder(route, initial);
}
