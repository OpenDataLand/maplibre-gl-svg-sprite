import { svgToBitmap, canvasToBlob, canvasLikeToBlob } from './utils/image.js';
import { parseQuery, applySvgParams } from './utils/params.js';
/**
 * Generate a sprite sheet from SVG icons for browser usage
 *
 * @param params - Configuration object
 * @param params.imgs - Array of SVG icons
 * @param params.pixelRatio - Pixel ratio for rendering (default: 1)
 * @returns Promise resolving to sprite result with URLs and canvas
 * @throws {Error} If parameters are invalid
 */
export async function generateBrowserSprite({ imgs, pixelRatio = 1 }) {
    if (!Array.isArray(imgs) || typeof pixelRatio !== 'number') {
        throw new Error('Expected { imgs: Array<{id, svg}>, pixelRatio: number }');
    }
    const prepared = await Promise.all(imgs.map(async ({ id, svg }) => {
        const { bitmap, width, height } = await svgToBitmap(svg, pixelRatio);
        return { id, bitmap, width, height };
    }));
    let x = 0, maxH = 0;
    const items = [];
    for (const it of prepared) {
        items.push({ id: it.id, x, y: 0, width: it.width, height: it.height, bitmap: it.bitmap });
        x += it.width;
        if (it.height > maxH)
            maxH = it.height;
    }
    const width = Math.max(1, x);
    const height = Math.max(1, maxH);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx)
        throw new Error('Could not get 2D context');
    for (const it of items)
        ctx.drawImage(it.bitmap, it.x, it.y);
    const spriteBlob = await canvasToBlob(canvas, 'image/png');
    const spriteURL = URL.createObjectURL(spriteBlob);
    const json = {};
    for (const it of items)
        json[it.id] = { width: it.width, height: it.height, x: it.x, y: it.y, pixelRatio };
    const jsonBlob = new Blob([JSON.stringify(json)], { type: 'application/json' });
    const jsonURL = URL.createObjectURL(jsonBlob);
    return { spriteURL, jsonURL, json, canvas, width, height };
}
/**
 * Builder class for creating and managing sprite sheets from SVG icons
 *
 * @example
 * ```typescript
 * const builder = new SpriteBuilder({ pixelRatio: 2 });
 * builder.addSvg('icon1', '<svg>...</svg>');
 * const { sprite, json } = await builder.exportURLs();
 * // Don't forget to call builder.destroy() when done
 * ```
 */
export class SpriteBuilder {
    /**
     * Create a new SpriteBuilder
     *
     * @param options - Configuration options
     * @param options.pixelRatio - Pixel ratio for rendering (default: 1)
     */
    constructor({ pixelRatio = 1 } = {}) {
        this._items = [];
        this._dirty = true;
        this._built = null;
        this._urls = { sprite: null, json: null };
        this._pixelRatio = pixelRatio;
    }
    /** Set pixel ratio (must be positive number) */
    setPixelRatio(ratio) { if (!(typeof ratio === 'number' && isFinite(ratio) && ratio > 0))
        throw new Error('pixelRatio must be a positive number'); this._pixelRatio = ratio; this._markDirty(); }
    /** Add an SVG icon to the sprite */
    addSvg(id, svg) { if (!id || typeof id !== 'string')
        throw new Error('addSvg requires a string id'); if (typeof svg !== 'string')
        throw new Error('addSvg requires svg string content'); this._items.push({ id, svg }); this._markDirty(); }
    /** Export sprite sheet as object URL */
    async exportSpriteURL() { const built = await this._ensureBuilt(); if (this._urls.sprite)
        URL.revokeObjectURL(this._urls.sprite); const blob = await canvasToBlob(built.canvas, 'image/png'); this._urls.sprite = URL.createObjectURL(blob); return this._urls.sprite; }
    /** Export JSON metadata as object URL */
    async exportJSONURL() { const built = await this._ensureBuilt(); if (this._urls.json)
        URL.revokeObjectURL(this._urls.json); const blob = new Blob([JSON.stringify(built.json)], { type: 'application/json' }); this._urls.json = URL.createObjectURL(blob); return this._urls.json; }
    /** Export both sprite and JSON URLs */
    async exportURLs() { const [sprite, json] = await Promise.all([this.exportSpriteURL(), this.exportJSONURL()]); return { sprite, json }; }
    /** Export JSON metadata object */
    async exportJSON() { const built = await this._ensureBuilt(); return built.json; }
    /** Export canvas element */
    async exportCanvas() { const built = await this._ensureBuilt(); return built.canvas; }
    /** Export sprite assets (JSON + PNG bytes) */
    async exportAssets() { const built = await this._ensureBuilt(); const blob = await canvasToBlob(built.canvas, 'image/png'); const png = await blob.arrayBuffer(); return { json: built.json, png }; }
    /** Clean up resources and revoke URLs */
    destroy() { if (this._urls.sprite)
        URL.revokeObjectURL(this._urls.sprite); if (this._urls.json)
        URL.revokeObjectURL(this._urls.json); this._urls = { sprite: null, json: null }; this._built = null; }
    /** Revoke a specific object URL */
    expire(url) { if (!url)
        return; try {
        URL.revokeObjectURL(url);
    }
    catch { } if (this._urls.sprite === url)
        this._urls.sprite = null; if (this._urls.json === url)
        this._urls.json = null; }
    _markDirty() { this._dirty = true; this._built = null; if (this._urls.sprite) {
        URL.revokeObjectURL(this._urls.sprite);
        this._urls.sprite = null;
    } if (this._urls.json) {
        URL.revokeObjectURL(this._urls.json);
        this._urls.json = null;
    } }
    async _ensureBuilt() { if (!this._dirty && this._built)
        return this._built; const imgs = this._items.map(({ id, svg }) => ({ id, svg })); const { spriteURL, jsonURL, json, canvas, width, height } = await generateBrowserSprite({ imgs, pixelRatio: this._pixelRatio }); if (spriteURL)
        URL.revokeObjectURL(spriteURL); if (jsonURL)
        URL.revokeObjectURL(jsonURL); this._built = { json, canvas, width, height }; this._dirty = false; return this._built; }
    /**
     * Register a MapLibre custom protocol to serve sprites from memory
     *
     * @param maplibre - MapLibre GL JS instance
     * @param protocol - Protocol name
     * @param registry - Sprite assets registry
     * @param options - Protocol options
     * @returns Function to unregister protocol
     */
    static registerMapLibreProtocol(maplibre, protocol, registry, options = {}) {
        if (!maplibre || typeof maplibre.addProtocol !== 'function' || typeof maplibre.removeProtocol !== 'function') {
            throw new Error('Expected MapLibre module with addProtocol/removeProtocol');
        }
        const served = {};
        const timers = {};
        const scheduleTTL = (k, r) => {
            if (!options.ttlMs)
                return;
            timers[k] = timers[k] || {};
            if (timers[k][r])
                return;
            timers[k][r] = setTimeout(() => {
                try {
                    if (registry[k])
                        delete registry[k][r];
                    if (timers[k])
                        delete timers[k][r];
                    const hasAny = registry[k] && Object.keys(registry[k]).some(x => /^\d+$/.test(x));
                    if (!hasAny)
                        delete registry[k];
                }
                catch { }
            }, options.ttlMs);
        };
        const handler = (requestParams, callback) => {
            const respond = (res) => {
                if (typeof callback === 'function') {
                    callback(null, res);
                    return undefined;
                }
                return Promise.resolve(res);
            };
            const fail = (err) => {
                if (typeof callback === 'function') {
                    callback(err);
                    return undefined;
                }
                return Promise.reject(err);
            };
            try {
                const url = requestParams.url;
                if (typeof window !== 'undefined' && window.__DEBUG_SVG_PROTOCOL__) {
                    console.debug('[registerSVGProtocol] request', url);
                }
                const prefix = protocol + '://';
                if (!url.startsWith(prefix))
                    return fail(new Error('Unhandled protocol URL'));
                const rest = url.slice(prefix.length);
                const path = rest.split('?')[0];
                const isJSON = /\.json$/i.test(path);
                const isPNG = /\.png$/i.test(path);
                if (!isJSON && !isPNG)
                    return fail(new Error('Unsupported sprite request: ' + url));
                const baseNoExt = path.replace(/\.(json|png)$/i, '');
                const ratio = /@2x$/i.test(baseNoExt) ? 2 : 1;
                const key = baseNoExt.replace(/@2x$/i, '');
                // Normalize odd forms like "pack/" or "/pack" just in case the caller joined paths
                const decodedKey = decodeURIComponent(key).replace(/^\/+/, '').replace(/\/+$/, '');
                const entry = registry[decodedKey];
                if (!entry)
                    return fail(new Error('Sprite key not found: ' + decodedKey));
                const assets = (ratio === 2 && entry[2]) ? entry[2] : entry[1];
                if (!assets)
                    return fail(new Error('Sprite assets missing for ratio ' + ratio));
                const usingCallback = typeof callback === 'function';
                const jsonData = usingCallback ? JSON.stringify(assets.json) : assets.json;
                const res = isJSON ? { data: jsonData } : { data: assets.png };
                if (options.debug) {
                    try {
                        const size = isJSON
                            ? (typeof jsonData === 'string' ? jsonData.length : JSON.stringify(jsonData).length)
                            : assets.png.byteLength;
                        // eslint-disable-next-line no-console
                        console.log('[sprite://] serve', { key: decodedKey, ratio, type: isJSON ? 'json' : 'png', size });
                    }
                    catch { }
                }
                // Update TTL + oneShot bookkeeping before responding
                scheduleTTL(decodedKey, ratio);
                if (options.oneShot) {
                    served[decodedKey] = served[decodedKey] || {};
                    served[decodedKey][ratio] = served[decodedKey][ratio] || { png: false, json: false };
                    if (isJSON)
                        served[decodedKey][ratio].json = true;
                    if (isPNG)
                        served[decodedKey][ratio].png = true;
                    const flags = served[decodedKey][ratio];
                    if (flags.png && flags.json) {
                        delete registry[decodedKey][ratio];
                        delete served[decodedKey][ratio];
                        const hasAny = Object.keys(registry[decodedKey] || {}).some(k => /^\d+$/.test(k));
                        if (!hasAny)
                            delete registry[decodedKey];
                        if (timers[decodedKey] && timers[decodedKey][ratio]) {
                            try {
                                clearTimeout(timers[decodedKey][ratio]);
                            }
                            catch { }
                            delete timers[decodedKey][ratio];
                        }
                    }
                }
                return respond(res);
            }
            catch (e) {
                return fail(e);
            }
        };
        maplibre.addProtocol(protocol, handler);
        return () => maplibre.removeProtocol(protocol);
    }
}
/**
 * Build a protocol registry from icons at multiple pixel ratios
 *
 * @param key - Registry key for the sprite set
 * @param icons - Array of SVG icons
 * @param ratios - Pixel ratios to generate (default: [1, 2])
 * @returns Promise resolving to protocol registry
 */
export async function buildSpriteRegistryFromIcons(key, icons, ratios = [1, 2]) {
    const byRatio = {};
    for (const r of ratios) {
        const sb = new SpriteBuilder({ pixelRatio: r });
        icons.forEach(({ id, svg }) => sb.addSvg(id, svg));
        byRatio[r] = await sb.exportAssets();
    }
    const entry = {};
    for (const r of ratios)
        entry[r] = byRatio[r];
    return { [key]: entry };
}
/**
 * Build and register a protocol directly from icons
 *
 * @param maplibre - MapLibre GL JS instance
 * @param protocol - Protocol name
 * @param key - Registry key
 * @param icons - Array of SVG icons
 * @param ratios - Pixel ratios (default: [1, 2])
 * @param options - Protocol options
 * @returns Promise resolving to unregister function
 */
export async function registerProtocolFromIcons(maplibre, protocol, key, icons, ratios = [1, 2], options = {}) {
    const registry = await buildSpriteRegistryFromIcons(key, icons, ratios);
    return SpriteBuilder.registerMapLibreProtocol(maplibre, protocol, registry, options);
}
/**
 * Register a one-shot sprite protocol (sprites served once then removed)
 *
 * @param maplibre - MapLibre GL JS instance
 * @param protocol - Protocol name
 * @param key - Registry key
 * @param icons - Array of SVG icons
 * @param ratios - Pixel ratios (default: [1, 2])
 * @param ttlMs - Optional TTL in milliseconds
 * @returns Promise resolving to unregister function
 */
export async function registerOneShotSpriteFromIcons(maplibre, protocol, key, icons, ratios = [1, 2], ttlMs) {
    return registerProtocolFromIcons(maplibre, protocol, key, icons, ratios, { oneShot: true, ttlMs });
}
/**
 * Register an SVG protocol for on-the-fly parameterized icon rendering
 *
 * URL format: `${protocol}://<id>.png?color=#ff0000&width=24&pixelRatio=2`
 *
 * @param maplibre - MapLibre GL JS instance
 * @param protocol - Protocol name
 * @param icons - Record mapping icon IDs to SVG strings
 * @returns Function to unregister the protocol
 * @throws {Error} If maplibre doesn't have addProtocol/removeProtocol
 */
export function registerSVGProtocol(maplibre, protocol, icons, options = {}) {
    if (!maplibre || typeof maplibre.addProtocol !== 'function' || typeof maplibre.removeProtocol !== 'function') {
        throw new Error('Expected MapLibre module with addProtocol/removeProtocol');
    }
    const handler = async (requestParams, callback) => {
        const respond = (value) => {
            if (typeof callback === 'function') {
                callback(null, value);
                return;
            }
            return value;
        };
        const fail = (err) => {
            if (typeof callback === 'function') {
                callback(err);
                return;
            }
            throw err;
        };
        try {
            const url = requestParams.url;
            const prefix = protocol + '://';
            if (!url.startsWith(prefix))
                return fail(new Error('Unhandled protocol URL'));
            const rest = url.slice(prefix.length);
            const [path, queryStr = ''] = rest.split('?');
            const params = parseQuery(queryStr);
            const id = decodeURIComponent(path.replace(/\.(png|svg)$/i, ''));
            const original = icons[id];
            if (!original)
                return fail(new Error('SVG not found: ' + id));
            const svg = applySvgParams(original, params);
            const pixelRatio = Number(params.pixelRatio) || 1;
            const { bitmap, width, height } = await svgToBitmap(svg, pixelRatio);
            let canvas;
            if (typeof document === 'undefined') {
                if (typeof OffscreenCanvas === 'undefined')
                    throw new Error('OffscreenCanvas is required in Worker context');
                canvas = new OffscreenCanvas(width, height);
            }
            else {
                const el = document.createElement('canvas');
                el.width = width;
                el.height = height;
                canvas = el;
            }
            const ctx = canvas.getContext('2d');
            if (!ctx)
                throw new Error('Could not get 2D context');
            ctx.drawImage(bitmap, 0, 0, width, height);
            const cssWidth = params.width ? Number(params.width) : width / pixelRatio;
            const cssHeight = params.height ? Number(params.height) : height / pixelRatio;
            if (options.postprocessCanvas) {
                await options.postprocessCanvas(ctx, cssWidth, cssHeight, params);
            }
            const blob = await canvasLikeToBlob(canvas, 'image/png');
            const buf = await blob.arrayBuffer();
            return respond({ data: buf });
        }
        catch (e) {
            return fail(e);
        }
    };
    maplibre.addProtocol(protocol, handler);
    return () => maplibre.removeProtocol(protocol);
}
