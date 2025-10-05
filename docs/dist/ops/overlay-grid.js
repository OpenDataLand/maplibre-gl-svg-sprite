import { applySvgFgBg } from './svg-fg-bg.js';
import { computeTargetSize, svgToBitmap } from './overlay-svg.js';
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
export class OverlayGrid extends BaseOp {
    /**
     * Create a new grid overlay operation
     *
     * @param svgIcons - Record mapping icon IDs to SVG strings
     * @param id - Optional identifier for debugging
     */
    constructor(svgIcons, id = 'overlayGrid') { super(id); this.svgIcons = svgIcons; }
    /**
     * Compute the natural grid size (CSS pixels) for the current params.
     * Returns { width, height } that fits icons using itemW/itemH or inferred sizes,
     * including gaps between cells.
     */
    measure(params) {
        const list = (params.icons || params.grid || '').trim();
        const ids = list ? list.split(/[\s,|]+/).map(s => s.trim()).filter(Boolean) : [];
        const gap = params.gap ? Number(params.gap) : 2;
        const cols = params.columns ? Math.max(1, Number(params.columns)) : Math.max(1, ids.length || 1);
        const extraCols = params.extraCols ? Math.max(0, Number(params.extraCols)) : (params.padCols ? Math.max(0, Number(params.padCols)) : 0);
        const totalCols = Math.max(cols, cols + extraCols);
        const rows = Math.ceil((ids.length || 1) / cols);
        const fg = params.gridFg || params.gfg || params.fg;
        const bg = params.gridBg || params.gbg || params.bg;
        const itemWOverride = params.itemW ? Number(params.itemW) : undefined;
        const itemHOverride = params.itemH ? Number(params.itemH) : undefined;
        const cellPad = params.cellPad ? Number(params.cellPad) : (params.padding ? Number(params.padding) : 2);
        const cellBgIcon = (params.cellBgIcon || params['cell-bg-icon'] || params.badge || '');
        let itemW = itemWOverride;
        let itemH = itemHOverride;
        if (!itemW || !itemH) {
            for (const id of ids) {
                const raw = this.svgIcons[id];
                if (!raw)
                    continue;
                const refSvg = (fg || bg) ? applySvgFgBg(raw, fg, bg) : raw;
                const natural = computeTargetSize(refSvg, 1, { width: 24, height: 24 });
                itemW = itemW || natural.width;
                itemH = itemH || natural.height;
                if (itemW && itemH)
                    break;
            }
        }
        let iw = Math.max(1, Math.round((itemW || 24)));
        let ih = Math.max(1, Math.round((itemH || 24)));
        // Ensure cell fits background SVG plus padding
        if (cellBgIcon) {
            const rawBg = this.svgIcons[cellBgIcon];
            if (rawBg) {
                const naturalBg = computeTargetSize(rawBg, 1, { width: iw, height: ih });
                iw = Math.max(iw, naturalBg.width + Math.max(0, cellPad) * 2);
                ih = Math.max(ih, naturalBg.height + Math.max(0, cellPad) * 2);
            }
        }
        let width = totalCols * iw + (totalCols - 1) * gap;
        let height = rows * ih + (rows - 1) * gap;
        const outerPad = params.outerPad ? Number(params.outerPad) : (params.gridPad ? Number(params.gridPad) : 3);
        if (outerPad && Number.isFinite(outerPad) && outerPad > 0) {
            width += outerPad * 2;
            height += outerPad * 2;
        }
        return { width: Math.ceil(width), height: Math.ceil(height) };
    }
    async run(ctx, W, H, params) {
        const list = (params.icons || params.grid || '').trim();
        if (!list)
            return;
        const ids = list.split(/[\s,|]+/).map(s => s.trim()).filter(Boolean);
        if (!ids.length)
            return;
        const pixelRatio = params.pixelRatio ? Number(params.pixelRatio) : 1;
        const gap = params.gap ? Number(params.gap) : 2;
        const cols = params.columns ? Math.max(1, Number(params.columns)) : ids.length;
        const extraCols = params.extraCols ? Math.max(0, Number(params.extraCols)) : (params.padCols ? Math.max(0, Number(params.padCols)) : 0);
        const totalCols = Math.max(cols, cols + extraCols);
        const rows = Math.ceil(ids.length / cols);
        const fg = params.gridFg || params.gfg || params.fg;
        const bg = params.gridBg || params.gbg || params.bg;
        // Per-icon background options
        const cellBg = (params.cellBg || params['cell-bg'] || params.iconBg || params.background || '');
        const cellPad = params.cellPad ? Number(params.cellPad) : (params.padding ? Number(params.padding) : 2);
        const cellR = params.cellR ? Number(params.cellR) : (params.radius ? Number(params.radius) : 4);
        const cellBgIcon = (params.cellBgIcon || params['cell-bg-icon'] || params.badge || '');
        const itemWOverride = params.itemW ? Number(params.itemW) : undefined;
        const itemHOverride = params.itemH ? Number(params.itemH) : undefined;
        // Determine per-item size (uniform)
        let itemW = itemWOverride;
        let itemH = itemHOverride;
        if (!itemW || !itemH) {
            // Use the first found icon as reference
            for (const id of ids) {
                const raw = this.svgIcons[id];
                if (!raw)
                    continue;
                const refSvg = (fg || bg) ? applySvgFgBg(raw, fg, bg) : raw;
                const natural = computeTargetSize(refSvg, 1, { width: 24, height: 24 });
                itemW = itemW || natural.width;
                itemH = itemH || natural.height;
                if (itemW && itemH)
                    break;
            }
        }
        let iw = Math.max(1, Math.round((itemW || 24)));
        let ih = Math.max(1, Math.round((itemH || 24)));
        if (cellBgIcon) {
            const rawBg = this.svgIcons[cellBgIcon];
            if (rawBg) {
                const naturalBg = computeTargetSize(rawBg, 1, { width: iw, height: ih });
                iw = Math.max(iw, naturalBg.width + Math.max(0, cellPad) * 2);
                ih = Math.max(ih, naturalBg.height + Math.max(0, cellPad) * 2);
            }
        }
        const gridW = totalCols * iw + (totalCols - 1) * gap;
        const gridH = rows * ih + (rows - 1) * gap;
        const anchor = (params.gridAnchor || params.anchor || 'center').toLowerCase();
        const startX = params.gx ? Number(params.gx) : (anchor.includes('right') ? W - gridW : anchor.includes('left') ? 0 : (W - gridW) / 2);
        const startY = params.gy ? Number(params.gy) : (anchor.includes('bottom') ? H - gridH : anchor.includes('top') ? 0 : (H - gridH) / 2);
        // Center the visible columns within the total grid width.
        // For odd extraCols we shift by half a cell so padding is symmetric.
        const visibleOffsetX = (extraCols * (iw + gap)) / 2;
        // Optional background to visualize the grid box while debugging
        if (params.bgFill) {
            ctx.save();
            ctx.fillStyle = params.bgFill;
            ctx.fillRect(startX, startY, gridW, gridH);
            ctx.restore();
        }
        const drawRoundedRect = (x, y, w, h, r) => {
            const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
            ctx.beginPath();
            ctx.moveTo(x + rr, y);
            ctx.arcTo(x + w, y, x + w, y + h, rr);
            ctx.arcTo(x + w, y + h, x, y + h, rr);
            ctx.arcTo(x, y + h, x, y, rr);
            ctx.arcTo(x, y, x + w, y, rr);
            ctx.closePath();
        };
        // Draw each icon
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const raw = this.svgIcons[id];
            if (!raw) {
                // draw placeholder outline
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = startX + visibleOffsetX + col * (iw + gap);
                const y = startY + row * (ih + gap);
                ctx.save();
                ctx.strokeStyle = '#f00';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x + 1, y + 1, Math.max(1, iw - 2), Math.max(1, ih - 2));
                ctx.restore();
                // eslint-disable-next-line no-console
                console.warn('[overlayGrid] missing icon id:', id);
                continue;
            }
            let svg = raw;
            if (fg || bg)
                svg = applySvgFgBg(svg, fg, bg);
            try {
                const bmp = await svgToBitmap(svg, Math.round(iw * pixelRatio), Math.round(ih * pixelRatio));
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = startX + visibleOffsetX + col * (iw + gap);
                const y = startY + row * (ih + gap);
                // Draw per-cell background if requested (color or SVG icon)
                if (cellBg || cellBgIcon) {
                    ctx.save();
                    const bx = x + Math.max(0, cellPad);
                    const by = y + Math.max(0, cellPad);
                    const bw = Math.max(1, iw - Math.max(0, cellPad) * 2);
                    const bh = Math.max(1, ih - Math.max(0, cellPad) * 2);
                    if (cellBg) {
                        ctx.fillStyle = cellBg;
                        drawRoundedRect(bx, by, bw, bh, cellR);
                        ctx.fill();
                    }
                    if (cellBgIcon) {
                        const rawBg = this.svgIcons[cellBgIcon];
                        if (rawBg) {
                            const naturalBg = computeTargetSize(rawBg, 1, { width: bw, height: bh });
                            const scale = Math.min(bw / naturalBg.width, bh / naturalBg.height);
                            const tw = Math.max(1, Math.round(naturalBg.width * scale));
                            const th = Math.max(1, Math.round(naturalBg.height * scale));
                            try {
                                const bgBmp = await svgToBitmap(rawBg, Math.round(tw * pixelRatio), Math.round(th * pixelRatio));
                                ctx.drawImage(bgBmp, bx + (bw - tw) / 2, by + (bh - th) / 2, tw, th);
                            }
                            catch (e) {
                                // fallback: outlined rect
                                ctx.strokeStyle = '#999';
                                ctx.lineWidth = 1;
                                drawRoundedRect(bx + 1, by + 1, Math.max(1, bw - 2), Math.max(1, bh - 2), cellR);
                                ctx.stroke();
                            }
                        }
                    }
                    ctx.restore();
                }
                // Foreground icon padding/scale
                const iconPad = params.iconPad ? Number(params.iconPad) : 0;
                const iconScale = params.iconScale ? Math.max(0.05, Math.min(1, Number(params.iconScale))) : 1;
                const drawW = Math.max(1, Math.round((iw - 2 * Math.max(0, iconPad)) * iconScale));
                const drawH = Math.max(1, Math.round((ih - 2 * Math.max(0, iconPad)) * iconScale));
                const dx = x + (iw - drawW) / 2;
                const dy = y + (ih - drawH) / 2;
                ctx.drawImage(bmp, dx, dy, drawW, drawH);
            }
            catch (e) {
                const col = i % cols;
                const row = Math.floor(i / cols);
                const x = startX + col * (iw + gap);
                const y = startY + row * (ih + gap);
                ctx.save();
                ctx.strokeStyle = '#f00';
                ctx.lineWidth = 1.5;
                ctx.strokeRect(x + 1, y + 1, Math.max(1, iw - 2), Math.max(1, ih - 2));
                ctx.restore();
                // eslint-disable-next-line no-console
                console.warn('[overlayGrid] failed to render icon', id, e);
            }
        }
    }
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
 * // Use in registerStyleImageMissingHandler
 * ```
 */
export function overlayGrid(svgIcons) {
    const op = new OverlayGrid(svgIcons);
    const fn = (ctx, w, h, params) => op.run(ctx, w, h, params);
    fn.measure = (params) => op.measure(params);
    return fn;
}
