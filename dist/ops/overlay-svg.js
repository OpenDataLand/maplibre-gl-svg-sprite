import { applySvgFgBg } from './svg-fg-bg.js';
import { BaseOp, asPostprocess } from './base.js';
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
export function computeTargetSize(svg, pixelRatio, fallback) {
    const widthMatch = svg.match(/\bwidth=["'](.*?)["']/i);
    const heightMatch = svg.match(/\bheight=["'](.*?)["']/i);
    const viewBoxMatch = svg.match(/\bviewBox=["']([^"']+)["']/i);
    const toPx = (val) => {
        if (!val)
            return null;
        const num = parseFloat(val);
        if (isNaN(num))
            return null;
        return num;
    };
    let w = toPx(widthMatch && widthMatch[1]);
    let h = toPx(heightMatch && heightMatch[1]);
    if ((!w || !h) && viewBoxMatch) {
        const vb = viewBoxMatch[1].trim().split(/\s+/).map(Number);
        if (vb.length === 4) {
            const vw = vb[2] - vb[0];
            const vh = vb[3] - vb[1];
            w = w || vw;
            h = h || vh;
        }
    }
    if (!w)
        w = fallback.width;
    if (!h)
        h = fallback.height;
    return { width: Math.max(1, Math.round(w * pixelRatio)), height: Math.max(1, Math.round(h * pixelRatio)) };
}
/**
 * Ensure SVG has xmlns attribute
 *
 * @param svg - SVG markup string
 * @returns SVG with xmlns attribute
 * @internal
 */
function ensureXmlns(svg) {
    if (!/\<svg[^>]*\sxmlns=/.test(svg)) {
        return svg.replace(/<svg(\b[^>]*)>/i, '<svg$1 xmlns="http://www.w3.org/2000/svg">');
    }
    return svg;
}
/**
 * Generate candidate data URLs for an SVG (base64 and UTF-8 encoded)
 *
 * @param svg - SVG markup string
 * @returns Array of data URL candidates
 * @internal
 */
function svgToDataURLCandidates(svg) {
    const normalized = ensureXmlns(svg);
    const utf8 = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(normalized);
    let b64 = null;
    try {
        b64 = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(normalized)));
    }
    catch {
        b64 = null;
    }
    return b64 ? [b64, utf8] : [utf8];
}
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
export async function svgToBitmap(svg, width, height) {
    // Normalize boolean data attributes (data-fg / data-bg) to XML-friendly form
    svg = svg.replace(/(\sdata-(?:fg|bg))(\s|>|\/>)/gi, (_m, a, b) => `${a}="true"${b}`);
    // Prefer data URL (base64 first, then utf-8) to avoid blob loading issues across engines
    const toCanvas = async (src) => new Promise((resolve, reject) => {
        const img = new Image();
        try {
            img.crossOrigin = 'anonymous';
        }
        catch { }
        try {
            img.decoding = 'async';
        }
        catch { }
        img.onload = () => {
            const c = document.createElement('canvas');
            c.width = width;
            c.height = height;
            const ctx = c.getContext('2d');
            if (!ctx) {
                resolve(c);
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            resolve(c);
        };
        img.onerror = (e) => reject(e);
        img.src = src;
    });
    const candidates = svgToDataURLCandidates(svg);
    for (const url of candidates) {
        try {
            return await toCanvas(url);
        }
        catch { }
    }
    try {
        // Fallback to blob URL if data URL path fails
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        try {
            return await toCanvas(url);
        }
        finally {
            URL.revokeObjectURL(url);
        }
    }
    catch { }
    // As a last resort, return an empty canvas
    const c = document.createElement('canvas');
    c.width = width;
    c.height = height;
    return c;
}
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
export class OverlaySvg extends BaseOp {
    /**
     * Create a new SVG overlay operation
     *
     * @param svgIcons - Record mapping icon IDs to SVG strings
     * @param id - Optional identifier for debugging
     */
    constructor(svgIcons, id = 'overlaySvg') { super(id); this.svgIcons = svgIcons; }
    async run(ctx, W, H, params) {
        const overlayList = (params.overlay || params.ovl || '').trim();
        if (!overlayList)
            return;
        const ids = overlayList.split(/[\s,|]+/).map(s => s.trim()).filter(Boolean);
        if (!ids.length)
            return;
        const fg = params.ofg || params.overlayFg || params.fg;
        const bg = params.obg || params.overlayBg || params.bg;
        const pixelRatio = params.pixelRatio ? Number(params.pixelRatio) : 1;
        const anchor = (params.anchor || 'center').toLowerCase();
        for (const overlayId of ids) {
            const raw = this.svgIcons[overlayId];
            if (!raw)
                continue;
            let svg = raw;
            if (fg || bg)
                svg = applySvgFgBg(svg, fg, bg, { debug: !!params.logSvg });
            if (params.logSvg) {
                try {
                    console.debug('[overlaySvg] svg after fg/bg', overlayId, svg);
                }
                catch { }
            }
            const natural = computeTargetSize(svg, 1, { width: 24, height: 24 });
            const targetW = params.ow ? Number(params.ow) : natural.width;
            const targetH = params.oh ? Number(params.oh) : natural.height;
            try {
                const bmp = await svgToBitmap(svg, Math.round(targetW * pixelRatio), Math.round(targetH * pixelRatio));
                const ox = params.ox ? Number(params.ox) : (anchor.includes('right') ? W - targetW : anchor.includes('left') ? 0 : (W - targetW) / 2);
                const oy = params.oy ? Number(params.oy) : (anchor.includes('bottom') ? H - targetH : (anchor.includes('top') ? 0 : (H - targetH) / 2));
                ctx.drawImage(bmp, ox, oy, targetW, targetH);
                if (params.debugRect) {
                    try {
                        ctx.save();
                        ctx.strokeStyle = '#0ff';
                        ctx.lineWidth = 1;
                        ctx.strokeRect(Math.floor(ox) + 0.5, Math.floor(oy) + 0.5, Math.ceil(targetW) - 1, Math.ceil(targetH) - 1);
                        ctx.restore();
                    }
                    catch { }
                }
            }
            catch (e) {
                try {
                    const ox = params.ox ? Number(params.ox) : (anchor.includes('right') ? W - targetW : anchor.includes('left') ? 0 : (W - targetW) / 2);
                    const oy = params.oy ? Number(params.oy) : (anchor.includes('bottom') ? H - targetH : (anchor.includes('top') ? 0 : (H - targetH) / 2));
                    ctx.save();
                    ctx.strokeStyle = '#f00';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(ox + 1, oy + 1, Math.max(1, targetW - 2), Math.max(1, targetH - 2));
                    ctx.restore();
                    console.warn('[overlaySvg] overlay load failed for', overlayId, e);
                }
                catch { }
            }
        }
    }
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
 * // Use in registerNamedImageHandlers
 * ```
 */
export function overlaySvg(svgIcons) {
    return asPostprocess(new OverlaySvg(svgIcons));
}
