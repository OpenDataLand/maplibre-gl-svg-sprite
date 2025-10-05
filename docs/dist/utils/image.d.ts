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
export declare function hasCreateImageBitmap(): boolean;
/**
 * Validate and normalize an SVG string
 *
 * @param svg - SVG markup string
 * @returns Normalized SVG string
 * @throws {Error} If svg is not a string
 */
export declare function normalizeSvg(svg: string): string;
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
export declare function computeTargetSize(svg: string, pixelRatio: number): {
    width: number;
    height: number;
};
/**
 * Convert a canvas to a Blob
 *
 * @param canvas - HTML canvas element
 * @param type - MIME type for the blob (default: 'image/png')
 * @param quality - Quality for lossy formats (0-1)
 * @returns Promise resolving to Blob
 */
export declare function canvasToBlob(canvas: HTMLCanvasElement, type?: string, quality?: number): Promise<Blob>;
/**
 * Convert either an HTMLCanvasElement or OffscreenCanvas to a Blob
 *
 * @param canvas - Canvas instance
 * @param type - MIME type for the blob (default: 'image/png')
 * @param quality - Quality for lossy formats (0-1)
 * @returns Promise resolving to Blob
 */
export declare function canvasLikeToBlob(canvas: HTMLCanvasElement | OffscreenCanvas, type?: string, quality?: number): Promise<Blob>;
/**
 * Convert a Blob to an HTMLImageElement
 *
 * @param blob - Blob containing image data
 * @returns Promise resolving to loaded image element
 */
export declare function blobToImage(blob: Blob): Promise<HTMLImageElement>;
/**
 * Create an ImageBitmap from a canvas, with fallback
 *
 * @param canvas - HTML canvas element
 * @returns Promise resolving to ImageBitmap or the canvas itself if unsupported
 */
export declare function createImageBitmapFromCanvas(canvas: HTMLCanvasElement): Promise<ImageBitmap | HTMLCanvasElement>;
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
export declare function svgToBitmap(svgString: string, pixelRatio: number): Promise<{
    bitmap: ImageBitmap | HTMLCanvasElement;
    width: number;
    height: number;
}>;
