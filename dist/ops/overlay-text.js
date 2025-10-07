import { BaseOp, asPostprocess } from './base.js';
import { ensureFontLoaded } from '../utils/fonts.js';
/**
 * Post-processing operation to overlay text on an image
 *
 * Supports query parameters: text, label, fontSize, fontWeight, fontFamily,
 * textColor, fill, textStroke, textStrokeWidth, textPadding, textAnchor, anchor, tx, ty,
 * textAutoColor (boolean), textUppercase (boolean)
 *
 * @example
 * ```typescript
 * const op = new OverlayText();
 * // Use with params: ?text=Hello&fontSize=20&textColor=red
 * ```
 */
export class OverlayText extends BaseOp {
    /**
     * Create a new text overlay operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id = 'overlayText') { super(id); }
    async run(ctx, W, H, params) {
        let text = params.text || params.label;
        if (!text)
            return;
        if (params.textUppercase === 'true' || params.textUppercase === '1') {
            try {
                text = String(text).toUpperCase();
            }
            catch { }
        }
        const fontSize = params.fontSize ? Number(params.fontSize) : 14;
        const fontWeight = params.fontWeight || 'bold';
        const fontStyle = params.fontStyle || 'normal';
        const fontFamily = params.fontFamily || 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
        let fill = params.textColor || params.fill || '';
        const stroke = params.textStroke || '#000';
        const strokeWidth = params.textStrokeWidth ? Number(params.textStrokeWidth) : 3;
        const padding = params.textPadding ? Number(params.textPadding) : 0;
        const anchor = (params.textAnchor || params.anchor || 'center').toLowerCase();
        const ox = params.tx ? Number(params.tx) : 0;
        const oy = params.ty ? Number(params.ty) : 0;
        // Note: fontSize is in CSS pixels. The canvas context may already be scaled by pixelRatio,
        // so we use the fontSize directly - the browser will handle the scaling.
        await ensureFontLoaded(fontFamily, fontSize, fontWeight, fontStyle, params.fontLoadTimeout ? Number(params.fontLoadTimeout) : 1500);
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'alphabetic';
        // Set text alignment based on anchor
        if (anchor.includes('left')) {
            ctx.textAlign = 'left';
        }
        else if (anchor.includes('right')) {
            ctx.textAlign = 'right';
        }
        else {
            ctx.textAlign = 'center';
        }
        const metrics = ctx.measureText(text);
        const ascent = Number.isFinite(metrics === null || metrics === void 0 ? void 0 : metrics.actualBoundingBoxAscent) ? metrics.actualBoundingBoxAscent : fontSize * 0.75;
        const descent = Number.isFinite(metrics === null || metrics === void 0 ? void 0 : metrics.actualBoundingBoxDescent) ? metrics.actualBoundingBoxDescent : fontSize * 0.25;
        // Calculate X position
        let x;
        if (anchor.includes('left')) {
            x = padding + ox;
        }
        else if (anchor.includes('right')) {
            x = W - padding + ox;
        }
        else {
            x = W / 2 + ox;
        }
        // Calculate Y position (baseline)
        let y;
        if (anchor.includes('top')) {
            y = padding + ascent + oy;
        }
        else if (anchor.includes('bottom')) {
            y = H - padding - descent + oy;
        }
        else {
            // Center vertically: middle of canvas + half the visual height adjustment
            y = H / 2 + (ascent - descent) / 2 + oy;
        }
        const drawX = x;
        const drawY = y;
        // Auto-contrast: derive textColor when requested and not explicitly provided
        if (!fill && (params.textAutoColor === 'true' || params.textAutoColor === '1')) {
            const bg = params.textBg || params.bg || params.overlayBg || params.obg || params.color || '#3f3f3f';
            const c = pickContrastingColor(bg);
            fill = c.fill;
        }
        if (strokeWidth > 0) {
            ctx.lineJoin = 'round';
            ctx.lineWidth = strokeWidth;
            ctx.strokeStyle = stroke;
            ctx.strokeText(text, drawX, drawY);
        }
        ctx.fillStyle = fill || '#fff';
        ctx.fillText(text, drawX, drawY);
    }
}
function pickContrastingColor(bg) {
    const hex = normalizeHex(bg) || '#3f3f3f';
    const { r, g, b } = hexToRgb(hex);
    // Relative luminance
    const srgb = [r, g, b].map(v => {
        const c = v / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    const L = 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
    // Choose white for dark backgrounds, black for light
    return { fill: L < 0.53 ? '#ffffff' : '#111111' };
}
function normalizeHex(s) {
    const m = s.trim().match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!m)
        return null;
    let h = m[1];
    if (h.length === 3)
        h = h.split('').map(c => c + c).join('');
    return '#' + h.toLowerCase();
}
function hexToRgb(h) {
    const n = normalizeHex(h) || '#000000';
    const r = parseInt(n.slice(1, 3), 16);
    const g = parseInt(n.slice(3, 5), 16);
    const b = parseInt(n.slice(5, 7), 16);
    return { r, g, b };
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
 * // Use in registerNamedImageHandlers
 * ```
 */
export function overlayText() {
    return asPostprocess(new OverlayText());
}
