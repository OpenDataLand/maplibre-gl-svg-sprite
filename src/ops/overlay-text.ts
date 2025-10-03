import { BaseOp, asPostprocess } from './base.js';
import { ensureFontLoaded } from '../utils/fonts.js';

/**
 * Post-processing operation to overlay text on an image
 *
 * Supports query parameters: text, label, fontSize, fontWeight, fontFamily,
 * textColor, fill, textStroke, textStrokeWidth, textPadding, textAnchor, anchor, tx, ty
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
  constructor(id: string = 'overlayText') { super(id); }
  async run(ctx: CanvasRenderingContext2D, W: number, H: number, params: Record<string, string>) {
    const text = params.text || params.label;
    if (!text) return;

    const fontSize = params.fontSize ? Number(params.fontSize) : 14;
    const fontWeight = params.fontWeight || 'bold';
    const fontStyle = params.fontStyle || 'normal';
    const fontFamily = params.fontFamily || 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif';
    const fill = params.textColor || params.fill || '#fff';
    const stroke = params.textStroke || '#000';
    const strokeWidth = params.textStrokeWidth ? Number(params.textStrokeWidth) : 3;
    const padding = params.textPadding ? Number(params.textPadding) : 0;
    const anchor = (params.textAnchor || params.anchor || 'center').toLowerCase();
    const ox = params.tx ? Number(params.tx) : 0;
    const oy = params.ty ? Number(params.ty) : 0;

    await ensureFontLoaded(fontFamily, fontSize, fontWeight, fontStyle, params.fontLoadTimeout ? Number(params.fontLoadTimeout) : 1500);
    ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'middle';
    if (anchor.includes('left')) ctx.textAlign = 'left';
    else if (anchor.includes('right')) ctx.textAlign = 'right';
    else ctx.textAlign = 'center';

    const x = (ctx.textAlign === 'left') ? padding + ox : (ctx.textAlign === 'right') ? W - padding + ox : W / 2 + ox;
    const y = (anchor.includes('top')) ? padding + oy : (anchor.includes('bottom')) ? H - padding + oy : H / 2 + oy;

    if (strokeWidth > 0) {
      ctx.lineJoin = 'round';
      ctx.lineWidth = strokeWidth;
      ctx.strokeStyle = stroke;
      ctx.strokeText(text, x, y);
    }
    ctx.fillStyle = fill;
    ctx.fillText(text, x, y);
  }
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
 * // Use in registerStyleImageMissingHandler
 * ```
 */
export function overlayText() {
  return asPostprocess(new OverlayText());
}
