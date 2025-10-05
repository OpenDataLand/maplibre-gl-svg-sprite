/**
 * @module ops
 *
 * Post-processing operations for canvas manipulation.
 * Includes utilities for applying colors, tints, text overlays, SVG overlays, and icon grids.
 */
export { applySvgFgBg } from './svg-fg-bg.js';
export { applySpriteTint, spriteTint, SpriteTint } from './sprite-tint.js';
export { overlaySvg, OverlaySvg, computeTargetSize, svgToBitmap } from './overlay-svg.js';
export { overlayText, OverlayText } from './overlay-text.js';
export { overlayGrid, OverlayGrid } from './overlay-grid.js';
export { BaseOp, asPostprocess, chain } from './base.js';
export type { Postprocess, PostprocessOp } from './base.js';
