/**
 * @module utils/image
 *
 * Shared image and SVG utilities used across modules.
 */
/**
 * Check if the createImageBitmap API is available
 *
 * @returns True if createImageBitmap is supported
 */
export function hasCreateImageBitmap() {
    const globalScope = typeof globalThis !== 'undefined' ? globalThis : undefined;
    if (globalScope && typeof globalScope.createImageBitmap === 'function')
        return true;
    const winScope = typeof window !== 'undefined' ? window : undefined;
    return !!winScope && typeof winScope.createImageBitmap === 'function';
}
/**
 * Validate and normalize an SVG string
 *
 * @param svg - SVG markup string
 * @returns Normalized SVG string
 * @throws {Error} If svg is not a string
 */
export function normalizeSvg(svg) {
    if (typeof svg !== 'string') {
        throw new Error('SVG must be a string of XML');
    }
    return svg;
}
/**
 * Compute target rendering size from SVG dimensions
 *
 * Extracts width/height from attributes or viewBox and applies pixel ratio.
 * Defaults to 32x32 if dimensions cannot be determined.
 *
 * @param svg - SVG markup string
 * @param pixelRatio - Target pixel ratio
 * @returns Target width and height in pixels
 */
export function computeTargetSize(svg, pixelRatio) {
    const widthMatch = svg.match(/\bwidth=["'](.*?)["']/i);
    const heightMatch = svg.match(/\bheight=["'](.*?)["']/i);
    const viewBoxMatch = svg.match(/\bviewBox=["']([\d\.\s-]+)["']/i);
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
        w = 32;
    if (!h)
        h = 32;
    return { width: Math.max(1, Math.round(w * pixelRatio)), height: Math.max(1, Math.round(h * pixelRatio)) };
}
/**
 * Convert a canvas to a Blob
 *
 * @param canvas - HTML canvas element
 * @param type - MIME type for the blob (default: 'image/png')
 * @param quality - Quality for lossy formats (0-1)
 * @returns Promise resolving to Blob
 */
export function canvasToBlob(canvas, type = 'image/png', quality) {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
}
/**
 * Convert either an HTMLCanvasElement or OffscreenCanvas to a Blob
 *
 * @param canvas - Canvas instance
 * @param type - MIME type for the blob (default: 'image/png')
 * @param quality - Quality for lossy formats (0-1)
 * @returns Promise resolving to Blob
 */
export async function canvasLikeToBlob(canvas, type = 'image/png', quality) {
    if (typeof canvas.convertToBlob === 'function') {
        return await canvas.convertToBlob({ type, quality });
    }
    return await canvasToBlob(canvas, type, quality);
}
/**
 * Convert a Blob to an HTMLImageElement
 *
 * @param blob - Blob containing image data
 * @returns Promise resolving to loaded image element
 */
export function blobToImage(blob) {
    return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
        img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
        img.src = url;
    });
}
/**
 * Create an ImageBitmap from a canvas, with fallback
 *
 * @param canvas - HTML canvas element
 * @returns Promise resolving to ImageBitmap or the canvas itself if unsupported
 */
export async function createImageBitmapFromCanvas(canvas) {
    if (hasCreateImageBitmap())
        return await createImageBitmap(canvas);
    return canvas; // Fallback: drawImage accepts CanvasImageSource
}
/**
 * Convert SVG string to bitmap at the specified pixel ratio
 *
 * Uses createImageBitmap for efficient rendering when available, with fallback to canvas.
 *
 * @param svgString - SVG markup string
 * @param pixelRatio - Target pixel ratio for rendering
 * @returns Promise resolving to object with bitmap, width, and height
 * @throws {Error} If unable to get 2D context
 */
export async function svgToBitmap(svgString, pixelRatio) {
    const svg = normalizeSvg(svgString);
    const { width, height } = computeTargetSize(svg, pixelRatio);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    if (hasCreateImageBitmap()) {
        try {
            const bitmap = await createImageBitmap(blob, { resizeWidth: width, resizeHeight: height, resizeQuality: 'high' });
            return { bitmap, width: bitmap.width || width, height: bitmap.height || height };
        }
        catch (e) {
            // Fallback to image element path if createImageBitmap is unsupported for SVG on this browser
        }
    }
    const img = await blobToImage(blob);
    const bmpCanvas = document.createElement('canvas');
    bmpCanvas.width = width;
    bmpCanvas.height = height;
    const ctx = bmpCanvas.getContext('2d');
    if (!ctx)
        throw new Error('Could not get 2D context');
    ctx.drawImage(img, 0, 0, width, height);
    const bitmap = await createImageBitmapFromCanvas(bmpCanvas);
    return { bitmap, width, height };
}
