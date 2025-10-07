import { overlaySvg, overlayText, overlayGrid, chain } from '../ops/index.js';
function parseQuery(qs) {
    const out = {};
    (qs || '').split('&').forEach((p) => {
        if (!p)
            return;
        const [k, v = ''] = p.split('=');
        try {
            out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, ' '));
        }
        catch {
            out[k] = v;
        }
    });
    return out;
}
function toAddImageInput(img, w, h) {
    try {
        if (typeof ImageData !== 'undefined' && img instanceof ImageData)
            return img;
    }
    catch { }
    try {
        if (typeof HTMLImageElement !== 'undefined' && img instanceof HTMLImageElement)
            return img;
    }
    catch { }
    try {
        const c = document.createElement('canvas');
        const ww = w || (img && (img.width || img.naturalWidth)) || 1;
        const hh = h || (img && (img.height || img.naturalHeight)) || 1;
        c.width = ww;
        c.height = hh;
        const cctx = c.getContext('2d');
        if (!cctx)
            return img;
        try {
            cctx.drawImage(img, 0, 0, ww, hh);
        }
        catch { }
        return cctx.getImageData(0, 0, ww, hh);
    }
    catch { }
    return img;
}
function addOrUpdate(map, name, image, pixelRatio, w, h) {
    try {
        const prepared = toAddImageInput(image, w, h);
        const has = map.hasImage && map.hasImage(name);
        if (has && map.updateImage) {
            try {
                map.updateImage(name, prepared, { pixelRatio });
            }
            catch {
                try {
                    if (map.removeImage)
                        map.removeImage(name);
                }
                catch { }
                map.addImage(name, prepared, { pixelRatio });
            }
        }
        else if (has && !map.updateImage) {
            try {
                if (map.removeImage)
                    map.removeImage(name);
            }
            catch { }
            map.addImage(name, prepared, { pixelRatio });
        }
        else if (!has) {
            map.addImage(name, prepared, { pixelRatio });
        }
        if (map.triggerRepaint)
            map.triggerRepaint();
    }
    catch { }
}
/**
 * Register a named styleimagemissing router.
 * Each route handles requests where the image id base (before '?') matches the route name.
 * Supports a fallback '*' route to catch unmatched names.
 */
export function registerNamedImageHandlers(map, routes, opts = {}) {
    const debug = !!opts.debug;
    const dprBackBuffer = opts.dprBackBuffer !== false; // default true
    const handler = async (e) => {
        var _a;
        try {
            const id = e.id || '';
            if (!id.includes('?'))
                return; // ignore plain sprite names
            const [base, queryStr = ''] = id.split('?');
            const route = (_a = routes[base]) !== null && _a !== void 0 ? _a : routes['*'];
            if (!route)
                return; // not ours
            const params = parseQuery(queryStr);
            const dpr = (typeof window !== 'undefined' && (window.devicePixelRatio || 1)) || 1;
            const pixelRatio = params.pixelRatio ? Number(params.pixelRatio) : dpr;
            if (!params.pixelRatio)
                params.pixelRatio = String(pixelRatio);
            // Determine canvas CSS size
            let wCss = params.width ? Number(params.width) : 64;
            let hCss = params.height ? Number(params.height) : 64;
            const measurer = (typeof route === 'function' ? route.measure : route === null || route === void 0 ? void 0 : route.measure);
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
                        }
                        else if (params.height && !params.width) {
                            const scale = Math.max(0.01, Number(params.height) / natH);
                            hCss = Number(params.height);
                            wCss = Math.max(1, Math.round(natW * scale));
                            params.width = String(wCss);
                        }
                        else if (!params.width && !params.height) {
                            wCss = natW;
                            hCss = natH;
                            params.width = String(wCss);
                            params.height = String(hCss);
                        }
                    }
                }
                catch { }
            }
            const Wpx = Math.max(1, Math.round(wCss * pixelRatio));
            const Hpx = Math.max(1, Math.round(hCss * pixelRatio));
            const canvas = document.createElement('canvas');
            if (dprBackBuffer) {
                canvas.width = Wpx;
                canvas.height = Hpx;
            }
            else {
                canvas.width = wCss;
                canvas.height = hCss;
            }
            const ctx = canvas.getContext('2d');
            if (!ctx)
                return;
            if (dprBackBuffer && pixelRatio !== 1)
                ctx.scale(pixelRatio, pixelRatio);
            const post = (typeof route === 'function') ? route : route.postprocess;
            await post(ctx, wCss, hCss, params);
            addOrUpdate(map, id, canvas, pixelRatio, dprBackBuffer ? Wpx : wCss, dprBackBuffer ? Hpx : hCss);
        }
        catch (err) {
            if (debug)
                try {
                    console.warn('[named-sim] handler error', err);
                }
                catch { }
        }
    };
    map.on('styleimagemissing', handler);
    return () => map.off('styleimagemissing', handler);
}
/** Build default named routes using a reserved '$' prefix to avoid collisions */
export function buildDefaultNamedRoutes(svgIcons) {
    return {
        $text: overlayText(),
        $svg: overlaySvg(svgIcons),
        $badge: chain(overlaySvg(svgIcons), overlayText()),
        // Presets: identical pipelines; conventionally paired with params:
        // - $badgeInside: textAnchor=center (inside shield)
        // - $badgeStacked: textAnchor=bottom with overlay anchored at top
        $badgeInside: chain(overlaySvg(svgIcons), overlayText()),
        $badgeStacked: chain(overlaySvg(svgIcons), overlayText()),
        $grid: overlayGrid(svgIcons)
    };
}
