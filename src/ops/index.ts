/**
 * @module ops
 *
 * Post-processing operations for canvas manipulation.
 * Includes utilities for applying colors, tints, text overlays, SVG overlays, and icon grids.
 */

// SVG utilities
export { applySvgFgBg } from './svg-fg-bg.js';

// Sprite tinting
export { applySpriteTint, spriteTint, SpriteTint } from './sprite-tint.js';

// SVG overlay operations and utilities
export { overlaySvg, OverlaySvg, computeTargetSize, svgToBitmap } from './overlay-svg.js';

// Text overlay operations
export { overlayText, OverlayText } from './overlay-text.js';

// Grid overlay operations
export { overlayGrid, OverlayGrid } from './overlay-grid.js';

// Base classes and utilities
export { BaseOp, asPostprocess, chain } from './base.js';
export type { Postprocess, PostprocessOp } from './base.js';
