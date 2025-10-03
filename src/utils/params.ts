import { applySvgFgBg } from '../ops/index.js';

/**
 * Parse a query string into key-value pairs
 *
 * Supports both URLSearchParams (preferred) and manual parsing fallback.
 *
 * @param qs - Query string (with or without leading '?')
 * @returns Object mapping parameter names to values
 *
 * @example
 * ```typescript
 * const params = parseQuery('?color=red&width=24');
 * // => { color: 'red', width: '24' }
 * ```
 */
export function parseQuery(qs: string): Record<string, string> {
  const out: Record<string, string> = {};
  const q = qs.startsWith('?') ? qs.slice(1) : qs;
  if (!q) return out;
  try {
    const params = new URLSearchParams(q);
    params.forEach((value, key) => {
      out[key] = value;
    });
    return out;
  } catch {
    for (const part of q.split('&')) {
      if (!part) continue;
      const eq = part.indexOf('=');
      const k = eq >= 0 ? part.slice(0, eq) : part;
      const v = eq >= 0 ? part.slice(eq + 1) : '';
      try { out[decodeURIComponent(k)] = decodeURIComponent(v); } catch { out[k] = v; }
    }
    return out;
  }
}

/**
 * Apply query parameters to modify SVG attributes
 *
 * Supports color, width, height, fg/foreground, and bg/background parameters.
 *
 * @param svg - SVG markup string
 * @param params - Query parameters to apply
 * @returns Modified SVG string
 *
 * @example
 * ```typescript
 * const svg = '<svg width="24" height="24">...</svg>';
 * const modified = applySvgParams(svg, { color: 'red', width: '48' });
 * ```
 */
export function applySvgParams(svg: string, params: Record<string, string>): string {
  let out = svg;
  const fg = params.fg || params.foreground;
  const bg = params.bg || params.background;
  if (fg || bg) out = applySvgFgBg(out, fg, bg);

  if (params.color) {
    if (/<svg[^>]*\bfill=/.test(out)) {
      out = out.replace(/(<svg[^>]*\bfill=")[^"]*("[^>]*>)/i, `$1${params.color}$2`);
    } else {
      out = out.replace(/<svg\b/i, match => `${match} fill="${params.color}"`);
    }
  }

  const setDim = (name: 'width' | 'height', val?: string) => {
    if (!val) return;
    if (new RegExp(`<svg[^>]*\\b${name}=`).test(out)) {
      const re = new RegExp(`(<svg[^>]*\\b${name}=")[^"]*("[^>]*>)`, 'i');
      out = out.replace(re, `$1${val}$2`);
    } else {
      out = out.replace(/<svg\b/i, m => `${m} ${name}="${val}"`);
    }
  };
  setDim('width', params.width);
  setDim('height', params.height);
  return out;
}
