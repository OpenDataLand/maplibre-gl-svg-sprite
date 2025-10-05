import type { MapLike } from './types/maplibre-like.js';
import { applySpriteTint } from './ops/index.js';
import { parseQuery, applySvgParams } from './utils/params.js';
import { svgToBitmap, blobToImage } from './utils/image.js';
import type { ProtocolRegistry } from './sprite-core.js';

/**
 * Options for configuring the missing image handler
 */
export interface MissingImageHandlerOptions {
  /** Generate from SVG strings if provided */
  svgIcons?: Record<string, string>;
  /** Recolor from in-memory sprite registry if available */
  protocolRegistry?: ProtocolRegistry;
  /** Registry key used with registerMapLibreProtocol */
  spriteKey?: string;
  /** Optional custom SVG transformation function */
  transformSvg?: (svg: string, params: Record<string, string>) => string;
  /** Optional post-processing function for canvas */
  postprocessCanvas?: (ctx: CanvasRenderingContext2D, w: number, h: number, params: Record<string, string>) => void | Promise<void>;
  /** Enable debug logging */
  debug?: boolean;
  /** Render backing canvas at device pixel ratio (default: true) */
  dprBackBuffer?: boolean;
  /** Add a transparent placeholder immediately to suppress MapLibre warnings (default: false) */
  eagerPlaceholder?: boolean;
}

/**
 * Register a handler to auto-generate missing images with query parameters
 *
 * Automatically handles image requests like `icon?color=#f00&width=24&height=24`
 *
 * @param map - MapLibre map instance
 * @param options - Handler configuration options
 * @returns Function to unregister the handler
 *
 * @example
 * ```typescript
 * const unregister = registerStyleImageMissingHandler(map, {
 *   svgIcons: { marker: '<svg>...</svg>' },
 *   debug: true
 * });
 * // Now map.addLayer can reference 'marker?color=red&width=24'
 * ```
 */
export function registerStyleImageMissingHandler(
  map: MapLike,
  options: MissingImageHandlerOptions
): () => void {
  const toAddImageInput = (img: any, w?: number, h?: number): ImageData | HTMLImageElement => {
    // Prefer ImageData or HTMLImageElement for broad MapLibre compatibility
    try { if (typeof ImageData !== 'undefined' && img instanceof ImageData) return img; } catch {}
    try { if (typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement) return img; } catch {}
    // Convert Canvas or ImageBitmap to ImageData with explicit size
    try {
      const c = document.createElement('canvas');
      const ww = w || (img && (img.width || (img as any).naturalWidth)) || 1;
      const hh = h || (img && (img.height || (img as any).naturalHeight)) || 1;
      c.width = ww; c.height = hh;
      const cctx = c.getContext('2d'); if (!cctx) return img;
      try { cctx.drawImage(img as any, 0, 0, ww, hh); } catch {}
      return cctx.getImageData(0, 0, ww, hh);
    } catch {}
    return img;
  };

  const addOrUpdateAndRepaint = (name: string, image: any, pixelRatio: number, w?: number, h?: number) => {
    try {
      const prepared = toAddImageInput(image, w, h);
      const has = map.hasImage && map.hasImage(name);
      if (has && (map as any).updateImage) {
        try {
          (map as any).updateImage(name, prepared, { pixelRatio });
          if (options.debug) console.log('[sim] updated image', name);
        } catch (e) {
          // Some engines disallow resizing via updateImage; fallback to replace
          try { if ((map as any).removeImage) (map as any).removeImage(name); } catch {}
          map.addImage(name, prepared, { pixelRatio });
          if (options.debug) console.log('[sim] replaced image (fallback)', name);
        }
      } else if (has && !(map as any).updateImage) {
        // No update API; replace
        try { if ((map as any).removeImage) (map as any).removeImage(name); } catch {}
        map.addImage(name, prepared, { pixelRatio });
        if (options.debug) console.log('[sim] replaced image (no updateImage)', name);
      } else if (!has) {
        map.addImage(name, prepared, { pixelRatio });
        if (options.debug) console.log('[sim] added image', name);
      }
      if (map.triggerRepaint) map.triggerRepaint();
    } catch (err) {
      if (options.debug) console.warn('[sim] addImage failed', name, err);
      try { if (map.triggerRepaint) map.triggerRepaint(); } catch {}
    }
  };

  const handler = async (e: { id: string }) => {
    try {
      const id = e.id || '';
      if (!id.includes('?')) return;
      const [base, query = ''] = id.split('?');
      const params = parseQuery(query);
      if (options.debug) console.log('[styleimagemissing]', { id, base, params });

      const color = params.color;
      const width = params.width ? Number(params.width) : undefined;
      const height = params.height ? Number(params.height) : undefined;
      const dpr = (typeof window !== 'undefined' && (window.devicePixelRatio || 1)) || 1;
      const pixelRatio = params.pixelRatio ? Number(params.pixelRatio) : dpr;
      if (!params.pixelRatio) params.pixelRatio = String(pixelRatio);
      const useDprBackBuffer = options.dprBackBuffer !== false;

      // Optional placeholder to avoid MapLibre warning about missing images
      if (options.eagerPlaceholder) {
        try {
          if (!map.hasImage || !map.hasImage(id)) {
            const wCss = typeof width === 'number' ? width : 1;
            const hCss = typeof height === 'number' ? height : 1;
            const Wpx = Math.max(1, Math.round(wCss * pixelRatio));
            const Hpx = Math.max(1, Math.round(hCss * pixelRatio));
            const ph = document.createElement('canvas'); ph.width = Wpx; ph.height = Hpx;
            const phctx = ph.getContext('2d'); if (phctx) phctx.clearRect(0, 0, Wpx, Hpx);
            addOrUpdateAndRepaint(id, ph, pixelRatio, Wpx, Hpx);
          }
        } catch {}
      }

      // A) From inline SVG icon library
      if (options.svgIcons && options.svgIcons[base]) {
        if (options.debug) console.log('[sim] generating from svgIcons for', base);
        let svg = applySvgParams(options.svgIcons[base], params);
        if (options.transformSvg) svg = options.transformSvg(svg, params);
        const { bitmap, width: w, height: h } = await svgToBitmap(svg, pixelRatio);
        const canvas = document.createElement('canvas');
        if (useDprBackBuffer) { canvas.width = w; canvas.height = h; } else { canvas.width = Math.max(1, Math.round(w / pixelRatio)); canvas.height = Math.max(1, Math.round(h / pixelRatio)); }
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        if (useDprBackBuffer) ctx.drawImage(bitmap as any, 0, 0); else ctx.drawImage(bitmap as any, 0, 0, canvas.width, canvas.height);
        if (options.postprocessCanvas) await options.postprocessCanvas(ctx, canvas.width, canvas.height, params);
        addOrUpdateAndRepaint(id, canvas, pixelRatio, canvas.width, canvas.height);
        return;
      }

      // B) From sprite registry in memory
      if (options.protocolRegistry && options.spriteKey) {
        if (options.debug) console.log('[sim] generating from sprite registry for', base);
        const key = options.spriteKey;
        const entry = options.protocolRegistry[key];
        const ratio = pixelRatio >= 1.5 && entry[2] ? 2 : 1;
        const assets = entry[ratio];
        if (!assets) return;
        const rect = assets.json[base];
        if (!rect) return;
        const blob = new Blob([assets.png], { type: 'image/png' });
        const url = URL.createObjectURL(blob);
        try {
          const img = await blobToImage(blob);
          const canvas = document.createElement('canvas');
          const srcRatio = (rect as any).pixelRatio || 1;
          const wCss = (typeof width === 'number') ? width : Math.max(1, Math.round(rect.width / srcRatio));
          const hCss = (typeof height === 'number') ? height : Math.max(1, Math.round(rect.height / srcRatio));
          const Wpx = Math.max(1, Math.round(wCss * pixelRatio));
          const Hpx = Math.max(1, Math.round(hCss * pixelRatio));
          if (useDprBackBuffer) { canvas.width = Wpx; canvas.height = Hpx; } else { canvas.width = wCss; canvas.height = hCss; }
          const ctx = canvas.getContext('2d'); if (!ctx) return;
          if (useDprBackBuffer && pixelRatio !== 1) ctx.scale(pixelRatio, pixelRatio);
          ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, wCss, hCss);
          if (color) applySpriteTint(ctx, wCss, hCss, color);
          if (options.postprocessCanvas) await options.postprocessCanvas(ctx, wCss, hCss, params);
          addOrUpdateAndRepaint(id, canvas, pixelRatio, useDprBackBuffer ? Wpx : wCss, useDprBackBuffer ? Hpx : hCss);
        } finally {
          URL.revokeObjectURL(url);
        }
        return;
      }

      // C) Synthesize from ops-only
      if (options.postprocessCanvas) {
        if (options.debug) console.log('[sim] synthesizing image via postprocess only for', id);
        let wCss = params.width ? Number(params.width) : 64;
        let hCss = params.height ? Number(params.height) : 64;
        const measurer = (options.postprocessCanvas as any)?.measure as
          | ((p: Record<string, string>) => { width: number; height: number })
          | undefined;
        if ((!params.width || !params.height) && typeof measurer === 'function') {
          try {
            const m = measurer(params);
            if (m && Number.isFinite(m.width) && Number.isFinite(m.height)) {
              const natW = Math.max(1, Math.round(m.width));
              const natH = Math.max(1, Math.round(m.height));
              if (params.width && !params.height) {
                const scale = Math.max(0.01, Number(params.width) / natW);
                wCss = Number(params.width);
                hCss = Math.max(1, Math.round(natH * scale));
                params.height = String(hCss);
              } else if (params.height && !params.width) {
                const scale = Math.max(0.01, Number(params.height) / natH);
                hCss = Number(params.height);
                wCss = Math.max(1, Math.round(natW * scale));
                params.width = String(wCss);
              } else if (!params.width && !params.height) {
                wCss = natW;
                hCss = natH;
                params.width = String(wCss);
                params.height = String(hCss);
              }
            }
          } catch (e) {
            if (options.debug) console.warn('[sim] measurer error', e);
          }
        }
        const Wpx = Math.max(1, Math.round(wCss * pixelRatio));
        const Hpx = Math.max(1, Math.round(hCss * pixelRatio));
        const canvas = document.createElement('canvas');
        if (useDprBackBuffer) { canvas.width = Wpx; canvas.height = Hpx; } else { canvas.width = wCss; canvas.height = hCss; }
        const ctx = canvas.getContext('2d'); if (!ctx) return;
        if (useDprBackBuffer && pixelRatio !== 1) ctx.scale(pixelRatio, pixelRatio);
        if (options.postprocessCanvas) await options.postprocessCanvas(ctx, wCss, hCss, params);
        addOrUpdateAndRepaint(id, canvas, pixelRatio, useDprBackBuffer ? Wpx : wCss, useDprBackBuffer ? Hpx : hCss);
        return;
      }
    } catch {
      // Avoid breaking map render loop
    }
  };

  map.on('styleimagemissing', handler);
  return () => map.off('styleimagemissing', handler);
}
