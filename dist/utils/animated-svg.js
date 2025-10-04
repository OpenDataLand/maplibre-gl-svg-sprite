const ANIMATE_TAGS = ['animate', 'animateTransform', 'animateMotion', 'animateColor', 'set', 'discard'];
const toCamel = (name) => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
function readAnimatedAttribute(el, name, fallback) {
    var _a;
    const direct = (_a = el[name]) !== null && _a !== void 0 ? _a : el[toCamel(name)];
    if (direct && typeof direct === 'object') {
        const animVal = 'animVal' in direct ? direct.animVal : null;
        if (animVal) {
            if (typeof animVal.valueAsString === 'string')
                return animVal.valueAsString;
            if (typeof animVal.value === 'number')
                return String(animVal.value);
        }
        const baseVal = 'baseVal' in direct ? direct.baseVal : null;
        if (baseVal && typeof baseVal.valueAsString === 'string')
            return baseVal.valueAsString;
    }
    return fallback;
}
function snapshotAnimatedSvg(source) {
    var _a;
    const clone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    for (const attr of Array.from(source.attributes)) {
        clone.setAttribute(attr.name, readAnimatedAttribute(source, attr.name, attr.value));
    }
    const queue = Array.from(source.children)
        .map((child) => ({ parent: clone, child: child }));
    while (queue.length) {
        const { parent, child } = queue.shift();
        if (child.nodeType !== Node.ELEMENT_NODE)
            continue;
        if (ANIMATE_TAGS.includes(child.tagName))
            continue;
        const newChild = document.createElementNS('http://www.w3.org/2000/svg', child.tagName);
        for (const attr of Array.from(child.attributes)) {
            newChild.setAttribute(attr.name, readAnimatedAttribute(child, attr.name, attr.value));
        }
        if ((_a = child.firstChild) === null || _a === void 0 ? void 0 : _a.nodeValue) {
            newChild.textContent = child.firstChild.nodeValue;
        }
        const style = window.getComputedStyle(child);
        for (let i = 0; i < style.length; i += 1) {
            const prop = style[i];
            newChild.style.setProperty(prop, style.getPropertyValue(prop));
        }
        parent.appendChild(newChild);
        queue.push(...Array.from(child.children).map((grand) => ({ parent: newChild, child: grand })));
    }
    return clone;
}
export function createAnimatedSvgImage(map, id, svgMarkup, options = {}) {
    var _a, _b, _c, _d;
    const { width = 64, height = 64, fps = 30, pixelRatio = 1, loop = true, } = options;
    const mapAny = map;
    const mapCanvas = typeof mapAny.getCanvas === 'function' ? mapAny.getCanvas() : mapAny.canvas;
    if (!mapCanvas)
        throw new Error('Map canvas not found on MapLibre instance.');
    const container = mapCanvas.parentElement;
    if (!container)
        throw new Error('Map canvas container not found.');
    const host = document.createElement('div');
    host.style.position = 'absolute';
    host.style.left = '-99999px';
    host.style.top = '-99999px';
    host.style.width = '1px';
    host.style.height = '1px';
    host.style.pointerEvents = 'none';
    host.style.overflow = 'hidden';
    host.innerHTML = svgMarkup.trim();
    const svgEl = host.querySelector('svg');
    if (!svgEl)
        throw new Error('Animated SVG markup must contain a root <svg>.');
    container.appendChild(host);
    try {
        (_b = (_a = svgEl).setCurrentTime) === null || _b === void 0 ? void 0 : _b.call(_a, 0);
        (_d = (_c = svgEl).unpauseAnimations) === null || _d === void 0 ? void 0 : _d.call(_c);
    }
    catch { }
    const animations = Array.from(svgEl.querySelectorAll(ANIMATE_TAGS.join(',')));
    let running = true;
    let remaining = animations.length;
    if (!loop && remaining > 0) {
        animations.forEach((anim) => {
            const handler = () => {
                remaining -= 1;
                if (remaining <= 0)
                    running = false;
            };
            anim.addEventListener('endEvent', handler, { once: true });
        });
    }
    const bufferCanvas = document.createElement('canvas');
    bufferCanvas.width = width;
    bufferCanvas.height = height;
    const ctx = bufferCanvas.getContext('2d');
    if (!ctx)
        throw new Error('Could not acquire 2D context for animation buffer.');
    let buffer = new Uint8ClampedArray(width * height * 4);
    let lastFrame = 0;
    const frameDuration = 1000 / Math.max(1, fps);
    let pending = false;
    const styleImage = {
        width,
        height,
        data: buffer,
        onAdd() { },
        onRemove() {
            running = false;
            host.remove();
        },
        render() {
            var _a, _b, _c, _d, _e, _f;
            if (!running && remaining <= 0 && !pending)
                return false;
            const now = performance.now();
            if (pending || (now - lastFrame < frameDuration)) {
                (_a = map.triggerRepaint) === null || _a === void 0 ? void 0 : _a.call(map);
                return true;
            }
            lastFrame = now;
            pending = true;
            const currentTime = typeof svgEl.getCurrentTime === 'function' ? svgEl.getCurrentTime() : null;
            try {
                (_c = (_b = svgEl).pauseAnimations) === null || _c === void 0 ? void 0 : _c.call(_b);
                if (currentTime != null) {
                    try {
                        (_e = (_d = svgEl).setCurrentTime) === null || _e === void 0 ? void 0 : _e.call(_d, currentTime);
                    }
                    catch { }
                }
            }
            catch { }
            const snapshot = snapshotAnimatedSvg(svgEl);
            snapshot.setAttribute('width', String(width));
            snapshot.setAttribute('height', String(height));
            const svgString = new XMLSerializer().serializeToString(snapshot);
            const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const img = new Image();
            img.onload = () => {
                var _a, _b, _c;
                try {
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(img, 0, 0, width, height);
                    const imageData = ctx.getImageData(0, 0, width, height);
                    buffer = imageData.data;
                    styleImage.data = buffer;
                    (_a = map.triggerRepaint) === null || _a === void 0 ? void 0 : _a.call(map);
                }
                finally {
                    URL.revokeObjectURL(url);
                    pending = false;
                    (_c = (_b = svgEl).unpauseAnimations) === null || _c === void 0 ? void 0 : _c.call(_b);
                }
            };
            img.onerror = () => {
                var _a, _b;
                URL.revokeObjectURL(url);
                pending = false;
                (_b = (_a = svgEl).unpauseAnimations) === null || _b === void 0 ? void 0 : _b.call(_a);
            };
            img.src = url;
            (_f = map.triggerRepaint) === null || _f === void 0 ? void 0 : _f.call(map);
            return true;
        }
    };
    map.addImage(id, styleImage, { pixelRatio });
    styleImage.render();
    return () => {
        var _a, _b, _c;
        if ((_b = (_a = map).hasImage) === null || _b === void 0 ? void 0 : _b.call(_a, id))
            map.removeImage(id);
        (_c = styleImage.onRemove) === null || _c === void 0 ? void 0 : _c.call(styleImage);
    };
}
