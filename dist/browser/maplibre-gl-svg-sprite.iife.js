"use strict";
var MaplibreSvgSprite = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // dist/index.js
  var index_exports = {};
  __export(index_exports, {
    SpriteBuilder: () => SpriteBuilder,
    SvgUrlBuilder: () => SvgUrlBuilder,
    buildSprite: () => generateBrowserSprite,
    buildSpriteRegistryFromIcons: () => buildSpriteRegistryFromIcons,
    buildSvgUrl: () => buildSvgUrl,
    createAnimatedSvgImage: () => createAnimatedSvgImage,
    generateBrowserSprite: () => generateBrowserSprite,
    ops: () => ops_exports,
    registerOneShotSpriteFromIcons: () => registerOneShotSpriteFromIcons,
    registerProtocolFromIcons: () => registerProtocolFromIcons,
    registerSVGProtocol: () => registerSVGProtocol,
    registerSpriteFromIcons: () => registerProtocolFromIcons,
    registerStyleImageMissingHandler: () => registerStyleImageMissingHandler,
    svgUrl: () => svgUrl
  });

  // dist/utils/image.js
  function hasCreateImageBitmap() {
    const globalScope = typeof globalThis !== "undefined" ? globalThis : void 0;
    if (globalScope && typeof globalScope.createImageBitmap === "function")
      return true;
    const winScope = typeof window !== "undefined" ? window : void 0;
    return !!winScope && typeof winScope.createImageBitmap === "function";
  }
  function normalizeSvg(svg) {
    if (typeof svg !== "string") {
      throw new Error("SVG must be a string of XML");
    }
    return svg;
  }
  function computeTargetSize(svg, pixelRatio) {
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
  function canvasToBlob(canvas, type = "image/png", quality) {
    return new Promise((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
  }
  async function canvasLikeToBlob(canvas, type = "image/png", quality) {
    if (typeof canvas.convertToBlob === "function") {
      return await canvas.convertToBlob({ type, quality });
    }
    return await canvasToBlob(canvas, type, quality);
  }
  function blobToImage(blob) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve(img);
      };
      img.onerror = (e) => {
        URL.revokeObjectURL(url);
        reject(e);
      };
      img.src = url;
    });
  }
  async function createImageBitmapFromCanvas(canvas) {
    if (hasCreateImageBitmap())
      return await createImageBitmap(canvas);
    return canvas;
  }
  async function svgToBitmap(svgString, pixelRatio) {
    const svg = normalizeSvg(svgString);
    const { width, height } = computeTargetSize(svg, pixelRatio);
    const blob = new Blob([svg], { type: "image/svg+xml" });
    if (hasCreateImageBitmap()) {
      try {
        const bitmap2 = await createImageBitmap(blob, { resizeWidth: width, resizeHeight: height, resizeQuality: "high" });
        return { bitmap: bitmap2, width: bitmap2.width || width, height: bitmap2.height || height };
      } catch (e) {
      }
    }
    const img = await blobToImage(blob);
    const bmpCanvas = document.createElement("canvas");
    bmpCanvas.width = width;
    bmpCanvas.height = height;
    const ctx = bmpCanvas.getContext("2d");
    if (!ctx)
      throw new Error("Could not get 2D context");
    ctx.drawImage(img, 0, 0, width, height);
    const bitmap = await createImageBitmapFromCanvas(bmpCanvas);
    return { bitmap, width, height };
  }

  // dist/ops/index.js
  var ops_exports = {};
  __export(ops_exports, {
    BaseOp: () => BaseOp,
    OverlayGrid: () => OverlayGrid,
    OverlaySvg: () => OverlaySvg,
    OverlayText: () => OverlayText,
    SpriteTint: () => SpriteTint,
    applySpriteTint: () => applySpriteTint,
    applySvgFgBg: () => applySvgFgBg,
    asPostprocess: () => asPostprocess,
    chain: () => chain,
    computeTargetSize: () => computeTargetSize2,
    overlayGrid: () => overlayGrid,
    overlaySvg: () => overlaySvg,
    overlayText: () => overlayText,
    spriteTint: () => spriteTint,
    svgToBitmap: () => svgToBitmap2
  });

  // dist/ops/svg-fg-bg.js
  function applySvgFgBg(svg, fg, bg, opts) {
    if (!fg && !bg)
      return svg;
    const normalizeBooleanDataAttrs = (s) => s.replace(/(\sdata-(?:fg|bg))(\s|>|\/>)/gi, (_m, a, b) => `${a}="true"${b}`);
    svg = normalizeBooleanDataAttrs(svg);
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(svg, "image/svg+xml");
      if (doc && doc.getElementsByTagName && doc.getElementsByTagName("parsererror").length) {
        if (opts && opts.debug)
          console.warn("[applySvgFgBg] DOMParser parsererror; falling back to string rewrite");
        throw new Error("parsererror");
      }
      const root = doc && doc.documentElement;
      if (root && root.nodeName.toLowerCase() === "svg") {
        try {
          if (!root.getAttribute("xmlns"))
            root.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        } catch {
        }
        if (bg) {
          const nodes = root.querySelectorAll("[data-bg]");
          nodes.forEach((el) => {
            try {
              el.setAttribute("fill", bg);
              el.setAttribute("stroke", bg);
            } catch {
            }
          });
        }
        if (fg) {
          const nodes = root.querySelectorAll("[data-fg]");
          nodes.forEach((el) => {
            try {
              el.setAttribute("fill", fg);
              el.setAttribute("stroke", fg);
            } catch {
            }
          });
        }
        const xml = new XMLSerializer().serializeToString(root);
        if (opts && opts.debug)
          console.debug("[applySvgFgBg] DOM rewrite ok", { len: xml.length });
        return xml;
      }
    } catch {
    }
    let out = svg;
    const injectStyle = (css) => {
      const m = out.match(/<svg[^>]*>/i);
      if (m) {
        const open = m[0];
        const styled = `${open}<style type="text/css">${css}</style>`;
        out = out.replace(open, styled);
      } else {
        out = `<svg><style type="text/css">${css}</style>` + out.replace(/^<svg/i, "").trim();
      }
    };
    const rules = [];
    if (fg)
      rules.push(`*[data-fg]{fill:${fg}!important;stroke:${fg}!important;}`);
    if (bg)
      rules.push(`*[data-bg]{fill:${bg}!important;stroke:${bg}!important;}`);
    if (rules.length)
      injectStyle(rules.join(""));
    const setAttr = (tag, name, value) => {
      const re = new RegExp(`(\\s${name}=")[^"]*(")`, "i");
      if (re.test(tag))
        return tag.replace(re, `$1${value}$2`);
      if (/\/>\s*$/.test(tag))
        return tag.replace(/\/>\s*$/, ` ${name}="${value}"/>`);
      return tag.replace(/>\s*$/, ` ${name}="${value}">`);
    };
    const rewrite = (html, marker, color) => {
      if (!color)
        return html;
      return html.replace(new RegExp(`<([^>]*?\\s${marker}(?:["'s>][^>]*)?)>`, "gi"), (full) => {
        let tag = full;
        tag = setAttr(tag, "fill", color);
        tag = setAttr(tag, "stroke", color);
        return tag;
      });
    };
    if (fg)
      out = rewrite(out, "data-fg", fg);
    if (bg)
      out = rewrite(out, "data-bg", bg);
    if (opts && opts.debug)
      console.debug("[applySvgFgBg] fallback rewrite ok", { len: out.length });
    return out;
  }

  // dist/ops/base.js
  var BaseOp = class {
    /**
     * Create a new operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id) {
      this.id = id;
    }
  };
  function isOp(x) {
    return !!x && typeof x === "object" && typeof x.run === "function";
  }
  function asPostprocess(op) {
    return (ctx, w, h, params) => op.run(ctx, w, h, params);
  }
  function chain(...ops) {
    return async (ctx, w, h, params) => {
      for (const op of ops) {
        const fn = isOp(op) ? op.run.bind(op) : op;
        await fn(ctx, w, h, params);
      }
    };
  }

  // dist/ops/sprite-tint.js
  function applySpriteTint(ctx, w, h, color) {
    ctx.globalCompositeOperation = "source-atop";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = "source-over";
  }
  var SpriteTint = class extends BaseOp {
    /**
     * Create a new sprite tint operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id = "spriteTint") {
      super(id);
    }
    run(ctx, w, h, params) {
      const color = params.color || params.tint || params.tintColor;
      if (!color)
        return;
      applySpriteTint(ctx, w, h, color);
    }
  };
  function spriteTint() {
    return asPostprocess(new SpriteTint());
  }

  // dist/ops/overlay-svg.js
  function computeTargetSize2(svg, pixelRatio, fallback) {
    const widthMatch = svg.match(/\bwidth=["'](.*?)["']/i);
    const heightMatch = svg.match(/\bheight=["'](.*?)["']/i);
    const viewBoxMatch = svg.match(/\bviewBox=["']([^"']+)["']/i);
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
      w = fallback.width;
    if (!h)
      h = fallback.height;
    return { width: Math.max(1, Math.round(w * pixelRatio)), height: Math.max(1, Math.round(h * pixelRatio)) };
  }
  function ensureXmlns(svg) {
    if (!/\<svg[^>]*\sxmlns=/.test(svg)) {
      return svg.replace(/<svg(\b[^>]*)>/i, '<svg$1 xmlns="http://www.w3.org/2000/svg">');
    }
    return svg;
  }
  function svgToDataURLCandidates(svg) {
    const normalized = ensureXmlns(svg);
    const utf8 = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(normalized);
    let b64 = null;
    try {
      b64 = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(normalized)));
    } catch {
      b64 = null;
    }
    return b64 ? [b64, utf8] : [utf8];
  }
  async function svgToBitmap2(svg, width, height) {
    svg = svg.replace(/(\sdata-(?:fg|bg))(\s|>|\/>)/gi, (_m, a, b) => `${a}="true"${b}`);
    const toCanvas = async (src) => new Promise((resolve, reject) => {
      const img = new Image();
      try {
        img.crossOrigin = "anonymous";
      } catch {
      }
      try {
        img.decoding = "async";
      } catch {
      }
      img.onload = () => {
        const c2 = document.createElement("canvas");
        c2.width = width;
        c2.height = height;
        const ctx = c2.getContext("2d");
        if (!ctx) {
          resolve(c2);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(c2);
      };
      img.onerror = (e) => reject(e);
      img.src = src;
    });
    const candidates = svgToDataURLCandidates(svg);
    for (const url of candidates) {
      try {
        return await toCanvas(url);
      } catch {
      }
    }
    try {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      try {
        return await toCanvas(url);
      } finally {
        URL.revokeObjectURL(url);
      }
    } catch {
    }
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    return c;
  }
  var OverlaySvg = class extends BaseOp {
    /**
     * Create a new SVG overlay operation
     *
     * @param svgIcons - Record mapping icon IDs to SVG strings
     * @param id - Optional identifier for debugging
     */
    constructor(svgIcons, id = "overlaySvg") {
      super(id);
      this.svgIcons = svgIcons;
    }
    async run(ctx, W, H, params) {
      const overlayList = (params.overlay || params.ovl || "").trim();
      if (!overlayList)
        return;
      const ids = overlayList.split(/[\s,|]+/).map((s) => s.trim()).filter(Boolean);
      if (!ids.length)
        return;
      const fg = params.ofg || params.overlayFg || params.fg;
      const bg = params.obg || params.overlayBg || params.bg;
      const pixelRatio = params.pixelRatio ? Number(params.pixelRatio) : 1;
      const anchor = (params.anchor || "center").toLowerCase();
      for (const overlayId of ids) {
        const raw = this.svgIcons[overlayId];
        if (!raw)
          continue;
        let svg = raw;
        if (fg || bg)
          svg = applySvgFgBg(svg, fg, bg, { debug: !!params.logSvg });
        if (params.logSvg) {
          try {
            console.debug("[overlaySvg] svg after fg/bg", overlayId, svg);
          } catch {
          }
        }
        const natural = computeTargetSize2(svg, 1, { width: 24, height: 24 });
        const targetW = params.ow ? Number(params.ow) : natural.width;
        const targetH = params.oh ? Number(params.oh) : natural.height;
        try {
          const bmp = await svgToBitmap2(svg, Math.round(targetW * pixelRatio), Math.round(targetH * pixelRatio));
          const ox = params.ox ? Number(params.ox) : anchor.includes("right") ? W - targetW : anchor.includes("left") ? 0 : (W - targetW) / 2;
          const oy = params.oy ? Number(params.oy) : anchor.includes("bottom") ? H - targetH : anchor.includes("top") ? 0 : (H - targetH) / 2;
          ctx.drawImage(bmp, ox, oy, targetW, targetH);
          if (params.debugRect) {
            try {
              ctx.save();
              ctx.strokeStyle = "#0ff";
              ctx.lineWidth = 1;
              ctx.strokeRect(Math.floor(ox) + 0.5, Math.floor(oy) + 0.5, Math.ceil(targetW) - 1, Math.ceil(targetH) - 1);
              ctx.restore();
            } catch {
            }
          }
        } catch (e) {
          try {
            const ox = params.ox ? Number(params.ox) : anchor.includes("right") ? W - targetW : anchor.includes("left") ? 0 : (W - targetW) / 2;
            const oy = params.oy ? Number(params.oy) : anchor.includes("bottom") ? H - targetH : anchor.includes("top") ? 0 : (H - targetH) / 2;
            ctx.save();
            ctx.strokeStyle = "#f00";
            ctx.lineWidth = 2;
            ctx.strokeRect(ox + 1, oy + 1, Math.max(1, targetW - 2), Math.max(1, targetH - 2));
            ctx.restore();
            console.warn("[overlaySvg] overlay load failed for", overlayId, e);
          } catch {
          }
        }
      }
    }
  };
  function overlaySvg(svgIcons) {
    return asPostprocess(new OverlaySvg(svgIcons));
  }

  // dist/utils/fonts.js
  async function ensureFontLoaded(family, sizePx, weight = "normal", style = "normal", timeoutMs = 1500) {
    try {
      const docFonts = document.fonts;
      if (!docFonts || typeof docFonts.load !== "function" || typeof docFonts.check !== "function")
        return;
      const desc = `${style} ${weight} ${Math.round(sizePx)}px ${family}`;
      if (docFonts.check(desc))
        return;
      const p = docFonts.load(desc);
      await Promise.race([
        p,
        new Promise((resolve) => setTimeout(resolve, timeoutMs))
      ]);
    } catch {
    }
  }

  // dist/ops/overlay-text.js
  var OverlayText = class extends BaseOp {
    /**
     * Create a new text overlay operation
     *
     * @param id - Optional identifier for debugging
     */
    constructor(id = "overlayText") {
      super(id);
    }
    async run(ctx, W, H, params) {
      const text = params.text || params.label;
      if (!text)
        return;
      const fontSize = params.fontSize ? Number(params.fontSize) : 14;
      const fontWeight = params.fontWeight || "bold";
      const fontStyle = params.fontStyle || "normal";
      const fontFamily = params.fontFamily || "system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
      const fill = params.textColor || params.fill || "#fff";
      const stroke = params.textStroke || "#000";
      const strokeWidth = params.textStrokeWidth ? Number(params.textStrokeWidth) : 3;
      const padding = params.textPadding ? Number(params.textPadding) : 0;
      const anchor = (params.textAnchor || params.anchor || "center").toLowerCase();
      const ox = params.tx ? Number(params.tx) : 0;
      const oy = params.ty ? Number(params.ty) : 0;
      await ensureFontLoaded(fontFamily, fontSize, fontWeight, fontStyle, params.fontLoadTimeout ? Number(params.fontLoadTimeout) : 1500);
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      ctx.textBaseline = "alphabetic";
      if (anchor.includes("left")) {
        ctx.textAlign = "left";
      } else if (anchor.includes("right")) {
        ctx.textAlign = "right";
      } else {
        ctx.textAlign = "center";
      }
      const metrics = ctx.measureText(text);
      const ascent = Number.isFinite(metrics === null || metrics === void 0 ? void 0 : metrics.actualBoundingBoxAscent) ? metrics.actualBoundingBoxAscent : fontSize * 0.75;
      const descent = Number.isFinite(metrics === null || metrics === void 0 ? void 0 : metrics.actualBoundingBoxDescent) ? metrics.actualBoundingBoxDescent : fontSize * 0.25;
      let x;
      if (anchor.includes("left")) {
        x = padding + ox;
      } else if (anchor.includes("right")) {
        x = W - padding + ox;
      } else {
        x = W / 2 + ox;
      }
      let y;
      if (anchor.includes("top")) {
        y = padding + ascent + oy;
      } else if (anchor.includes("bottom")) {
        y = H - padding - descent + oy;
      } else {
        y = H / 2 + (ascent - descent) / 2 + oy;
      }
      const drawX = x;
      const drawY = y;
      if (strokeWidth > 0) {
        ctx.lineJoin = "round";
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.strokeText(text, drawX, drawY);
      }
      ctx.fillStyle = fill;
      ctx.fillText(text, drawX, drawY);
    }
  };
  function overlayText() {
    return asPostprocess(new OverlayText());
  }

  // dist/ops/overlay-grid.js
  var OverlayGrid = class extends BaseOp {
    /**
     * Create a new grid overlay operation
     *
     * @param svgIcons - Record mapping icon IDs to SVG strings
     * @param id - Optional identifier for debugging
     */
    constructor(svgIcons, id = "overlayGrid") {
      super(id);
      this.svgIcons = svgIcons;
    }
    /**
     * Compute the natural grid size (CSS pixels) for the current params.
     * Returns { width, height } that fits icons using itemW/itemH or inferred sizes,
     * including gaps between cells.
     */
    measure(params) {
      const list = (params.icons || params.grid || "").trim();
      const ids = list ? list.split(/[\s,|]+/).map((s) => s.trim()).filter(Boolean) : [];
      const gap = params.gap ? Number(params.gap) : 2;
      const cols = params.columns ? Math.max(1, Number(params.columns)) : Math.max(1, ids.length || 1);
      const extraCols = params.extraCols ? Math.max(0, Number(params.extraCols)) : params.padCols ? Math.max(0, Number(params.padCols)) : 0;
      const totalCols = Math.max(cols, cols + extraCols);
      const rows = Math.ceil((ids.length || 1) / cols);
      const fg = params.gridFg || params.gfg || params.fg;
      const bg = params.gridBg || params.gbg || params.bg;
      const itemWOverride = params.itemW ? Number(params.itemW) : void 0;
      const itemHOverride = params.itemH ? Number(params.itemH) : void 0;
      const cellPad = params.cellPad ? Number(params.cellPad) : params.padding ? Number(params.padding) : 2;
      const cellBgIcon = params.cellBgIcon || params["cell-bg-icon"] || params.badge || "";
      let itemW = itemWOverride;
      let itemH = itemHOverride;
      if (!itemW || !itemH) {
        for (const id of ids) {
          const raw = this.svgIcons[id];
          if (!raw)
            continue;
          const refSvg = fg || bg ? applySvgFgBg(raw, fg, bg) : raw;
          const natural = computeTargetSize2(refSvg, 1, { width: 24, height: 24 });
          itemW = itemW || natural.width;
          itemH = itemH || natural.height;
          if (itemW && itemH)
            break;
        }
      }
      let iw = Math.max(1, Math.round(itemW || 24));
      let ih = Math.max(1, Math.round(itemH || 24));
      if (cellBgIcon) {
        const rawBg = this.svgIcons[cellBgIcon];
        if (rawBg) {
          const naturalBg = computeTargetSize2(rawBg, 1, { width: iw, height: ih });
          iw = Math.max(iw, naturalBg.width + Math.max(0, cellPad) * 2);
          ih = Math.max(ih, naturalBg.height + Math.max(0, cellPad) * 2);
        }
      }
      let width = totalCols * iw + (totalCols - 1) * gap;
      let height = rows * ih + (rows - 1) * gap;
      const outerPad = params.outerPad ? Number(params.outerPad) : params.gridPad ? Number(params.gridPad) : 3;
      if (outerPad && Number.isFinite(outerPad) && outerPad > 0) {
        width += outerPad * 2;
        height += outerPad * 2;
      }
      return { width: Math.ceil(width), height: Math.ceil(height) };
    }
    async run(ctx, W, H, params) {
      const list = (params.icons || params.grid || "").trim();
      if (!list)
        return;
      const ids = list.split(/[\s,|]+/).map((s) => s.trim()).filter(Boolean);
      if (!ids.length)
        return;
      const pixelRatio = params.pixelRatio ? Number(params.pixelRatio) : 1;
      const gap = params.gap ? Number(params.gap) : 2;
      const cols = params.columns ? Math.max(1, Number(params.columns)) : ids.length;
      const extraCols = params.extraCols ? Math.max(0, Number(params.extraCols)) : params.padCols ? Math.max(0, Number(params.padCols)) : 0;
      const totalCols = Math.max(cols, cols + extraCols);
      const rows = Math.ceil(ids.length / cols);
      const fg = params.gridFg || params.gfg || params.fg;
      const bg = params.gridBg || params.gbg || params.bg;
      const cellBg = params.cellBg || params["cell-bg"] || params.iconBg || params.background || "";
      const cellPad = params.cellPad ? Number(params.cellPad) : params.padding ? Number(params.padding) : 2;
      const cellR = params.cellR ? Number(params.cellR) : params.radius ? Number(params.radius) : 4;
      const cellBgIcon = params.cellBgIcon || params["cell-bg-icon"] || params.badge || "";
      const itemWOverride = params.itemW ? Number(params.itemW) : void 0;
      const itemHOverride = params.itemH ? Number(params.itemH) : void 0;
      let itemW = itemWOverride;
      let itemH = itemHOverride;
      if (!itemW || !itemH) {
        for (const id of ids) {
          const raw = this.svgIcons[id];
          if (!raw)
            continue;
          const refSvg = fg || bg ? applySvgFgBg(raw, fg, bg) : raw;
          const natural = computeTargetSize2(refSvg, 1, { width: 24, height: 24 });
          itemW = itemW || natural.width;
          itemH = itemH || natural.height;
          if (itemW && itemH)
            break;
        }
      }
      let iw = Math.max(1, Math.round(itemW || 24));
      let ih = Math.max(1, Math.round(itemH || 24));
      if (cellBgIcon) {
        const rawBg = this.svgIcons[cellBgIcon];
        if (rawBg) {
          const naturalBg = computeTargetSize2(rawBg, 1, { width: iw, height: ih });
          iw = Math.max(iw, naturalBg.width + Math.max(0, cellPad) * 2);
          ih = Math.max(ih, naturalBg.height + Math.max(0, cellPad) * 2);
        }
      }
      const gridW = totalCols * iw + (totalCols - 1) * gap;
      const gridH = rows * ih + (rows - 1) * gap;
      const anchor = (params.gridAnchor || params.anchor || "center").toLowerCase();
      const startX = params.gx ? Number(params.gx) : anchor.includes("right") ? W - gridW : anchor.includes("left") ? 0 : (W - gridW) / 2;
      const startY = params.gy ? Number(params.gy) : anchor.includes("bottom") ? H - gridH : anchor.includes("top") ? 0 : (H - gridH) / 2;
      const visibleOffsetX = extraCols * (iw + gap) / 2;
      if (params.bgFill) {
        ctx.save();
        ctx.fillStyle = params.bgFill;
        ctx.fillRect(startX, startY, gridW, gridH);
        ctx.restore();
      }
      const drawRoundedRect = (x, y, w, h, r) => {
        const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
        ctx.beginPath();
        ctx.moveTo(x + rr, y);
        ctx.arcTo(x + w, y, x + w, y + h, rr);
        ctx.arcTo(x + w, y + h, x, y + h, rr);
        ctx.arcTo(x, y + h, x, y, rr);
        ctx.arcTo(x, y, x + w, y, rr);
        ctx.closePath();
      };
      for (let i = 0; i < ids.length; i++) {
        const id = ids[i];
        const raw = this.svgIcons[id];
        if (!raw) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + visibleOffsetX + col * (iw + gap);
          const y = startY + row * (ih + gap);
          ctx.save();
          ctx.strokeStyle = "#f00";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 1, y + 1, Math.max(1, iw - 2), Math.max(1, ih - 2));
          ctx.restore();
          console.warn("[overlayGrid] missing icon id:", id);
          continue;
        }
        let svg = raw;
        if (fg || bg)
          svg = applySvgFgBg(svg, fg, bg);
        try {
          const bmp = await svgToBitmap2(svg, Math.round(iw * pixelRatio), Math.round(ih * pixelRatio));
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + visibleOffsetX + col * (iw + gap);
          const y = startY + row * (ih + gap);
          if (cellBg || cellBgIcon) {
            ctx.save();
            const bx = x + Math.max(0, cellPad);
            const by = y + Math.max(0, cellPad);
            const bw = Math.max(1, iw - Math.max(0, cellPad) * 2);
            const bh = Math.max(1, ih - Math.max(0, cellPad) * 2);
            if (cellBg) {
              ctx.fillStyle = cellBg;
              drawRoundedRect(bx, by, bw, bh, cellR);
              ctx.fill();
            }
            if (cellBgIcon) {
              const rawBg = this.svgIcons[cellBgIcon];
              if (rawBg) {
                const naturalBg = computeTargetSize2(rawBg, 1, { width: bw, height: bh });
                const scale = Math.min(bw / naturalBg.width, bh / naturalBg.height);
                const tw = Math.max(1, Math.round(naturalBg.width * scale));
                const th = Math.max(1, Math.round(naturalBg.height * scale));
                try {
                  const bgBmp = await svgToBitmap2(rawBg, Math.round(tw * pixelRatio), Math.round(th * pixelRatio));
                  ctx.drawImage(bgBmp, bx + (bw - tw) / 2, by + (bh - th) / 2, tw, th);
                } catch (e) {
                  ctx.strokeStyle = "#999";
                  ctx.lineWidth = 1;
                  drawRoundedRect(bx + 1, by + 1, Math.max(1, bw - 2), Math.max(1, bh - 2), cellR);
                  ctx.stroke();
                }
              }
            }
            ctx.restore();
          }
          const iconPad = params.iconPad ? Number(params.iconPad) : 0;
          const iconScale = params.iconScale ? Math.max(0.05, Math.min(1, Number(params.iconScale))) : 1;
          const drawW = Math.max(1, Math.round((iw - 2 * Math.max(0, iconPad)) * iconScale));
          const drawH = Math.max(1, Math.round((ih - 2 * Math.max(0, iconPad)) * iconScale));
          const dx = x + (iw - drawW) / 2;
          const dy = y + (ih - drawH) / 2;
          ctx.drawImage(bmp, dx, dy, drawW, drawH);
        } catch (e) {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = startX + col * (iw + gap);
          const y = startY + row * (ih + gap);
          ctx.save();
          ctx.strokeStyle = "#f00";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x + 1, y + 1, Math.max(1, iw - 2), Math.max(1, ih - 2));
          ctx.restore();
          console.warn("[overlayGrid] failed to render icon", id, e);
        }
      }
    }
  };
  function overlayGrid(svgIcons) {
    const op = new OverlayGrid(svgIcons);
    const fn = (ctx, w, h, params) => op.run(ctx, w, h, params);
    fn.measure = (params) => op.measure(params);
    return fn;
  }

  // dist/utils/params.js
  function parseQuery(qs) {
    const out = {};
    const q = qs.startsWith("?") ? qs.slice(1) : qs;
    if (!q)
      return out;
    try {
      const params = new URLSearchParams(q);
      params.forEach((value, key) => {
        out[key] = value;
      });
      return out;
    } catch {
      for (const part of q.split("&")) {
        if (!part)
          continue;
        const eq = part.indexOf("=");
        const k = eq >= 0 ? part.slice(0, eq) : part;
        const v = eq >= 0 ? part.slice(eq + 1) : "";
        try {
          out[decodeURIComponent(k)] = decodeURIComponent(v);
        } catch {
          out[k] = v;
        }
      }
      return out;
    }
  }
  function applySvgParams(svg, params) {
    let out = svg;
    const fg = params.fg || params.foreground;
    const bg = params.bg || params.background;
    if (fg || bg)
      out = applySvgFgBg(out, fg, bg);
    if (params.color) {
      if (/<svg[^>]*\bfill=/.test(out)) {
        out = out.replace(/(<svg[^>]*\bfill=")[^"]*("[^>]*>)/i, `$1${params.color}$2`);
      } else {
        out = out.replace(/<svg\b/i, (match) => `${match} fill="${params.color}"`);
      }
    }
    const setDim = (name, val) => {
      if (!val)
        return;
      if (new RegExp(`<svg[^>]*\\b${name}=`).test(out)) {
        const re = new RegExp(`(<svg[^>]*\\b${name}=")[^"]*("[^>]*>)`, "i");
        out = out.replace(re, `$1${val}$2`);
      } else {
        out = out.replace(/<svg\b/i, (m) => `${m} ${name}="${val}"`);
      }
    };
    setDim("width", params.width);
    setDim("height", params.height);
    return out;
  }

  // dist/sprite-core.js
  function normalizeIcons(icons) {
    if (Array.isArray(icons))
      return icons;
    if (icons && typeof icons === "object") {
      return Object.entries(icons).map(([id, svg]) => ({ id, svg }));
    }
    return [];
  }
  async function generateBrowserSprite({ imgs, pixelRatio = 1 }) {
    if ((Array.isArray(imgs) || imgs && typeof imgs === "object") === false || typeof pixelRatio !== "number") {
      throw new Error("Expected { imgs: Array<{id, svg}>, pixelRatio: number }");
    }
    const list = normalizeIcons(imgs);
    const prepared = await Promise.all(list.map(async ({ id, svg }) => {
      const { bitmap, width: width2, height: height2 } = await svgToBitmap(svg, pixelRatio);
      return { id, bitmap, width: width2, height: height2 };
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
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx)
      throw new Error("Could not get 2D context");
    for (const it of items)
      ctx.drawImage(it.bitmap, it.x, it.y);
    const spriteBlob = await canvasToBlob(canvas, "image/png");
    const spriteURL = URL.createObjectURL(spriteBlob);
    const json = {};
    for (const it of items)
      json[it.id] = { width: it.width, height: it.height, x: it.x, y: it.y, pixelRatio };
    const jsonBlob = new Blob([JSON.stringify(json)], { type: "application/json" });
    const jsonURL = URL.createObjectURL(jsonBlob);
    return { spriteURL, jsonURL, json, canvas, width, height };
  }
  var SpriteBuilder = class {
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
    setPixelRatio(ratio) {
      if (!(typeof ratio === "number" && isFinite(ratio) && ratio > 0))
        throw new Error("pixelRatio must be a positive number");
      this._pixelRatio = ratio;
      this._markDirty();
    }
    /** Add an SVG icon to the sprite */
    addSvg(id, svg) {
      if (!id || typeof id !== "string")
        throw new Error("addSvg requires a string id");
      if (typeof svg !== "string")
        throw new Error("addSvg requires svg string content");
      if (this._items.some((it) => it.id === id)) {
        try {
          console.warn(`[SpriteBuilder] duplicate id '${id}' added; last definition wins in JSON.`);
        } catch {
        }
      }
      this._items.push({ id, svg });
      this._markDirty();
    }
    /** Add multiple SVG icons at once (array or record) */
    addSvgs(icons) {
      for (const { id, svg } of normalizeIcons(icons))
        this.addSvg(id, svg);
    }
    /** Add an SVG icon only if not already present */
    addSvgIfAbsent(id, svg) {
      if (this._items.some((it) => it.id === id))
        return false;
      this.addSvg(id, svg);
      return true;
    }
    /** Export sprite sheet as object URL */
    async exportSpriteURL() {
      const built = await this._ensureBuilt();
      if (this._urls.sprite)
        URL.revokeObjectURL(this._urls.sprite);
      const blob = await canvasToBlob(built.canvas, "image/png");
      this._urls.sprite = URL.createObjectURL(blob);
      return this._urls.sprite;
    }
    /** Export JSON metadata as object URL */
    async exportJSONURL() {
      const built = await this._ensureBuilt();
      if (this._urls.json)
        URL.revokeObjectURL(this._urls.json);
      const blob = new Blob([JSON.stringify(built.json)], { type: "application/json" });
      this._urls.json = URL.createObjectURL(blob);
      return this._urls.json;
    }
    /** Export both sprite and JSON URLs */
    async exportURLs() {
      const [sprite, json] = await Promise.all([this.exportSpriteURL(), this.exportJSONURL()]);
      return { sprite, json };
    }
    /** Export URLs along with layout size */
    async exportBundle() {
      const built = await this._ensureBuilt();
      const { sprite, json } = await this.exportURLs();
      return { sprite, json, width: built.width, height: built.height };
    }
    /** Export JSON metadata object */
    async exportJSON() {
      const built = await this._ensureBuilt();
      return built.json;
    }
    /** Export canvas element */
    async exportCanvas() {
      const built = await this._ensureBuilt();
      return built.canvas;
    }
    /** Export sprite assets (JSON + PNG bytes) */
    async exportAssets() {
      const built = await this._ensureBuilt();
      const blob = await canvasToBlob(built.canvas, "image/png");
      const png = await blob.arrayBuffer();
      return { json: built.json, png };
    }
    /** Clean up resources and revoke URLs */
    destroy() {
      if (this._urls.sprite)
        URL.revokeObjectURL(this._urls.sprite);
      if (this._urls.json)
        URL.revokeObjectURL(this._urls.json);
      this._urls = { sprite: null, json: null };
      this._built = null;
    }
    /** Revoke a specific object URL */
    expire(url) {
      if (!url)
        return;
      try {
        URL.revokeObjectURL(url);
      } catch {
      }
      if (this._urls.sprite === url)
        this._urls.sprite = null;
      if (this._urls.json === url)
        this._urls.json = null;
    }
    _markDirty() {
      this._dirty = true;
      this._built = null;
      if (this._urls.sprite) {
        URL.revokeObjectURL(this._urls.sprite);
        this._urls.sprite = null;
      }
      if (this._urls.json) {
        URL.revokeObjectURL(this._urls.json);
        this._urls.json = null;
      }
    }
    async _ensureBuilt() {
      if (!this._dirty && this._built)
        return this._built;
      const imgs = this._items.map(({ id, svg }) => ({ id, svg }));
      const { spriteURL, jsonURL, json, canvas, width, height } = await generateBrowserSprite({ imgs, pixelRatio: this._pixelRatio });
      if (spriteURL)
        URL.revokeObjectURL(spriteURL);
      if (jsonURL)
        URL.revokeObjectURL(jsonURL);
      this._built = { json, canvas, width, height };
      this._dirty = false;
      return this._built;
    }
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
      if (!maplibre || typeof maplibre.addProtocol !== "function" || typeof maplibre.removeProtocol !== "function") {
        throw new Error("Expected MapLibre module with addProtocol/removeProtocol (pass the maplibre-gl module, not a map instance).");
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
            const hasAny = registry[k] && Object.keys(registry[k]).some((x) => /^\d+$/.test(x));
            if (!hasAny)
              delete registry[k];
          } catch {
          }
        }, options.ttlMs);
      };
      const handler = (requestParams, callback) => {
        const respond = (res) => {
          if (typeof callback === "function") {
            callback(null, res);
            return void 0;
          }
          return Promise.resolve(res);
        };
        const fail = (err) => {
          if (typeof callback === "function") {
            callback(err);
            return void 0;
          }
          return Promise.reject(err);
        };
        try {
          const url = requestParams.url;
          if (typeof window !== "undefined" && window.__DEBUG_SVG_PROTOCOL__) {
            console.debug("[registerSVGProtocol] request", url);
          }
          const prefix = protocol + "://";
          if (!url.startsWith(prefix))
            return fail(new Error("Unhandled protocol URL"));
          const rest = url.slice(prefix.length);
          const path = rest.split("?")[0];
          const isJSON = /\.json$/i.test(path);
          const isPNG = /\.png$/i.test(path);
          if (!isJSON && !isPNG)
            return fail(new Error("Unsupported sprite request: " + url));
          const baseNoExt = path.replace(/\.(json|png)$/i, "");
          const ratio = /@2x$/i.test(baseNoExt) ? 2 : 1;
          const key = baseNoExt.replace(/@2x$/i, "");
          const decodedKey = decodeURIComponent(key).replace(/^\/+/, "").replace(/\/+$/, "");
          const entry = registry[decodedKey];
          if (!entry) {
            const keys = Object.keys(registry || {});
            const hint = keys.length ? ` (available: ${keys.slice(0, 8).join(", ")}${keys.length > 8 ? ", \u2026" : ""})` : "";
            return fail(new Error("Sprite key not found: " + decodedKey + hint));
          }
          const assets = ratio === 2 && entry[2] ? entry[2] : entry[1];
          if (!assets)
            return fail(new Error("Sprite assets missing for ratio " + ratio));
          const usingCallback = typeof callback === "function";
          const jsonData = usingCallback ? JSON.stringify(assets.json) : assets.json;
          const res = isJSON ? { data: jsonData } : { data: assets.png };
          if (options.debug) {
            try {
              const size = isJSON ? typeof jsonData === "string" ? jsonData.length : JSON.stringify(jsonData).length : assets.png.byteLength;
              console.log("[sprite://] serve", { key: decodedKey, ratio, type: isJSON ? "json" : "png", size });
            } catch {
            }
          }
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
              const hasAny = Object.keys(registry[decodedKey] || {}).some((k) => /^\d+$/.test(k));
              if (!hasAny)
                delete registry[decodedKey];
              if (timers[decodedKey] && timers[decodedKey][ratio]) {
                try {
                  clearTimeout(timers[decodedKey][ratio]);
                } catch {
                }
                delete timers[decodedKey][ratio];
              }
            }
          }
          return respond(res);
        } catch (e) {
          return fail(e);
        }
      };
      maplibre.addProtocol(protocol, handler);
      return () => maplibre.removeProtocol(protocol);
    }
  };
  async function buildSpriteRegistryFromIcons(key, icons, ratios = [1, 2]) {
    const byRatio = {};
    const list = normalizeIcons(icons);
    for (const r of ratios) {
      const sb = new SpriteBuilder({ pixelRatio: r });
      list.forEach(({ id, svg }) => sb.addSvg(id, svg));
      byRatio[r] = await sb.exportAssets();
    }
    const entry = {};
    for (const r of ratios)
      entry[r] = byRatio[r];
    return { [key]: entry };
  }
  async function registerProtocolFromIcons(maplibre, protocol, key, icons, ratios = [1, 2], options = {}) {
    const registry = await buildSpriteRegistryFromIcons(key, icons, ratios);
    return SpriteBuilder.registerMapLibreProtocol(maplibre, protocol, registry, options);
  }
  async function registerOneShotSpriteFromIcons(maplibre, protocol, key, icons, ratios = [1, 2], ttlMs) {
    return registerProtocolFromIcons(maplibre, protocol, key, icons, ratios, { oneShot: true, ttlMs });
  }
  function registerSVGProtocol(maplibre, protocol, icons, options = {}) {
    if (!maplibre || typeof maplibre.addProtocol !== "function" || typeof maplibre.removeProtocol !== "function") {
      throw new Error("Expected MapLibre module with addProtocol/removeProtocol (pass the maplibre-gl module, not a map instance).");
    }
    const handler = async (requestParams, callback) => {
      const respond = (value) => {
        if (typeof callback === "function") {
          callback(null, value);
          return;
        }
        return value;
      };
      const fail = (err) => {
        if (typeof callback === "function") {
          callback(err);
          return;
        }
        throw err;
      };
      try {
        const url = requestParams.url;
        const prefix = protocol + "://";
        if (!url.startsWith(prefix))
          return fail(new Error("Unhandled protocol URL"));
        const rest = url.slice(prefix.length);
        const [path, queryStr = ""] = rest.split("?");
        const params = parseQuery(queryStr);
        const id = decodeURIComponent(path.replace(/\.(png|svg)$/i, ""));
        const original = icons[id];
        if (!original)
          return fail(new Error("SVG not found: " + id));
        const svg = applySvgParams(original, params);
        const pixelRatio = Number(params.pixelRatio) || (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1);
        const { bitmap, width, height } = await svgToBitmap(svg, pixelRatio);
        let canvas;
        if (typeof document === "undefined") {
          if (typeof OffscreenCanvas === "undefined")
            throw new Error("OffscreenCanvas is required in Worker context");
          canvas = new OffscreenCanvas(width, height);
        } else {
          const el = document.createElement("canvas");
          el.width = width;
          el.height = height;
          canvas = el;
        }
        const ctx = canvas.getContext("2d");
        if (!ctx)
          throw new Error("Could not get 2D context");
        ctx.drawImage(bitmap, 0, 0, width, height);
        const cssWidth = params.width ? Number(params.width) : width / pixelRatio;
        const cssHeight = params.height ? Number(params.height) : height / pixelRatio;
        if (options.postprocessCanvas) {
          if (pixelRatio !== 1) {
            ctx.save();
            ctx.scale(pixelRatio, pixelRatio);
          }
          await options.postprocessCanvas(ctx, cssWidth, cssHeight, params);
          if (pixelRatio !== 1) {
            ctx.restore();
          }
        }
        const blob = await canvasLikeToBlob(canvas, "image/png");
        const buf = await blob.arrayBuffer();
        return respond({ data: buf });
      } catch (e) {
        return fail(e);
      }
    };
    maplibre.addProtocol(protocol, handler);
    return () => maplibre.removeProtocol(protocol);
  }

  // dist/missing-image.js
  function registerStyleImageMissingHandler(map, options) {
    const toAddImageInput = (img, w, h) => {
      try {
        if (typeof ImageData !== "undefined" && img instanceof ImageData)
          return img;
      } catch {
      }
      try {
        if (typeof HTMLImageElement !== "undefined" && img instanceof HTMLImageElement)
          return img;
      } catch {
      }
      try {
        const c = document.createElement("canvas");
        const ww = w || img && (img.width || img.naturalWidth) || 1;
        const hh = h || img && (img.height || img.naturalHeight) || 1;
        c.width = ww;
        c.height = hh;
        const cctx = c.getContext("2d");
        if (!cctx)
          return img;
        try {
          cctx.drawImage(img, 0, 0, ww, hh);
        } catch {
        }
        return cctx.getImageData(0, 0, ww, hh);
      } catch {
      }
      return img;
    };
    const addOrUpdateAndRepaint = (name, image, pixelRatio, w, h) => {
      try {
        const prepared = toAddImageInput(image, w, h);
        const has = map.hasImage && map.hasImage(name);
        if (has && map.updateImage) {
          try {
            map.updateImage(name, prepared, { pixelRatio });
            if (options.debug)
              console.log("[sim] updated image", name);
          } catch (e) {
            try {
              if (map.removeImage)
                map.removeImage(name);
            } catch {
            }
            map.addImage(name, prepared, { pixelRatio });
            if (options.debug)
              console.log("[sim] replaced image (fallback)", name);
          }
        } else if (has && !map.updateImage) {
          try {
            if (map.removeImage)
              map.removeImage(name);
          } catch {
          }
          map.addImage(name, prepared, { pixelRatio });
          if (options.debug)
            console.log("[sim] replaced image (no updateImage)", name);
        } else if (!has) {
          map.addImage(name, prepared, { pixelRatio });
          if (options.debug)
            console.log("[sim] added image", name);
        }
        if (map.triggerRepaint)
          map.triggerRepaint();
      } catch (err) {
        if (options.debug)
          console.warn("[sim] addImage failed", name, err);
        try {
          if (map.triggerRepaint)
            map.triggerRepaint();
        } catch {
        }
      }
    };
    const handler = async (e) => {
      var _a;
      try {
        const id = e.id || "";
        if (!id.includes("?"))
          return;
        const [base, query = ""] = id.split("?");
        const params = parseQuery(query);
        if (options.debug)
          console.log("[styleimagemissing]", { id, base, params });
        const color = params.color;
        const width = params.width ? Number(params.width) : void 0;
        const height = params.height ? Number(params.height) : void 0;
        const dpr = typeof window !== "undefined" && (window.devicePixelRatio || 1) || 1;
        const pixelRatio = params.pixelRatio ? Number(params.pixelRatio) : dpr;
        if (!params.pixelRatio)
          params.pixelRatio = String(pixelRatio);
        const useDprBackBuffer = options.dprBackBuffer !== false;
        if (options.eagerPlaceholder) {
          try {
            if (!map.hasImage || !map.hasImage(id)) {
              const wCss = typeof width === "number" ? width : 1;
              const hCss = typeof height === "number" ? height : 1;
              const Wpx = Math.max(1, Math.round(wCss * pixelRatio));
              const Hpx = Math.max(1, Math.round(hCss * pixelRatio));
              const ph = document.createElement("canvas");
              ph.width = Wpx;
              ph.height = Hpx;
              const phctx = ph.getContext("2d");
              if (phctx)
                phctx.clearRect(0, 0, Wpx, Hpx);
              addOrUpdateAndRepaint(id, ph, pixelRatio, Wpx, Hpx);
            }
          } catch {
          }
        }
        if (options.svgIcons && options.svgIcons[base]) {
          if (options.debug)
            console.log("[sim] generating from svgIcons for", base);
          let svg = applySvgParams(options.svgIcons[base], params);
          if (options.transformSvg)
            svg = options.transformSvg(svg, params);
          const { bitmap, width: w, height: h } = await svgToBitmap(svg, pixelRatio);
          const canvas = document.createElement("canvas");
          if (useDprBackBuffer) {
            canvas.width = w;
            canvas.height = h;
          } else {
            canvas.width = Math.max(1, Math.round(w / pixelRatio));
            canvas.height = Math.max(1, Math.round(h / pixelRatio));
          }
          const ctx = canvas.getContext("2d");
          if (!ctx)
            return;
          if (useDprBackBuffer)
            ctx.drawImage(bitmap, 0, 0);
          else
            ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
          if (options.postprocessCanvas)
            await options.postprocessCanvas(ctx, canvas.width, canvas.height, params);
          addOrUpdateAndRepaint(id, canvas, pixelRatio, canvas.width, canvas.height);
          return;
        }
        if (options.protocolRegistry && options.spriteKey) {
          if (options.debug)
            console.log("[sim] generating from sprite registry for", base);
          const key = options.spriteKey;
          const entry = options.protocolRegistry[key];
          const ratio = pixelRatio >= 1.5 && entry[2] ? 2 : 1;
          const assets = entry[ratio];
          if (!assets)
            return;
          const rect = assets.json[base];
          if (!rect)
            return;
          const blob = new Blob([assets.png], { type: "image/png" });
          const url = URL.createObjectURL(blob);
          try {
            const img = await blobToImage(blob);
            const canvas = document.createElement("canvas");
            const srcRatio = rect.pixelRatio || 1;
            const wCss = typeof width === "number" ? width : Math.max(1, Math.round(rect.width / srcRatio));
            const hCss = typeof height === "number" ? height : Math.max(1, Math.round(rect.height / srcRatio));
            const Wpx = Math.max(1, Math.round(wCss * pixelRatio));
            const Hpx = Math.max(1, Math.round(hCss * pixelRatio));
            if (useDprBackBuffer) {
              canvas.width = Wpx;
              canvas.height = Hpx;
            } else {
              canvas.width = wCss;
              canvas.height = hCss;
            }
            const ctx = canvas.getContext("2d");
            if (!ctx)
              return;
            if (useDprBackBuffer && pixelRatio !== 1)
              ctx.scale(pixelRatio, pixelRatio);
            ctx.drawImage(img, rect.x, rect.y, rect.width, rect.height, 0, 0, wCss, hCss);
            if (color)
              applySpriteTint(ctx, wCss, hCss, color);
            if (options.postprocessCanvas)
              await options.postprocessCanvas(ctx, wCss, hCss, params);
            addOrUpdateAndRepaint(id, canvas, pixelRatio, useDprBackBuffer ? Wpx : wCss, useDprBackBuffer ? Hpx : hCss);
          } finally {
            URL.revokeObjectURL(url);
          }
          return;
        }
        if (options.postprocessCanvas) {
          if (options.debug)
            console.log("[sim] synthesizing image via postprocess only for", id);
          let wCss = params.width ? Number(params.width) : 64;
          let hCss = params.height ? Number(params.height) : 64;
          const measurer = (_a = options.postprocessCanvas) === null || _a === void 0 ? void 0 : _a.measure;
          if ((!params.width || !params.height) && typeof measurer === "function") {
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
            } catch (e2) {
              if (options.debug)
                console.warn("[sim] measurer error", e2);
            }
          }
          const Wpx = Math.max(1, Math.round(wCss * pixelRatio));
          const Hpx = Math.max(1, Math.round(hCss * pixelRatio));
          const canvas = document.createElement("canvas");
          if (useDprBackBuffer) {
            canvas.width = Wpx;
            canvas.height = Hpx;
          } else {
            canvas.width = wCss;
            canvas.height = hCss;
          }
          const ctx = canvas.getContext("2d");
          if (!ctx)
            return;
          if (useDprBackBuffer && pixelRatio !== 1)
            ctx.scale(pixelRatio, pixelRatio);
          if (options.postprocessCanvas)
            await options.postprocessCanvas(ctx, wCss, hCss, params);
          addOrUpdateAndRepaint(id, canvas, pixelRatio, useDprBackBuffer ? Wpx : wCss, useDprBackBuffer ? Hpx : hCss);
          return;
        }
      } catch {
      }
    };
    map.on("styleimagemissing", handler);
    return () => map.off("styleimagemissing", handler);
  }

  // dist/utils/animated-svg.js
  var ANIMATE_TAGS = ["animate", "animateTransform", "animateMotion", "animateColor", "set", "discard"];
  var toCamel = (name) => name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  function readAnimatedAttribute(el, name, fallback) {
    var _a;
    const direct = (_a = el[name]) !== null && _a !== void 0 ? _a : el[toCamel(name)];
    if (direct && typeof direct === "object") {
      const animVal = "animVal" in direct ? direct.animVal : null;
      if (animVal) {
        if (typeof animVal.valueAsString === "string")
          return animVal.valueAsString;
        if (typeof animVal.value === "number")
          return String(animVal.value);
      }
      const baseVal = "baseVal" in direct ? direct.baseVal : null;
      if (baseVal && typeof baseVal.valueAsString === "string")
        return baseVal.valueAsString;
    }
    return fallback;
  }
  function snapshotAnimatedSvg(source) {
    var _a;
    const clone = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    for (const attr of Array.from(source.attributes)) {
      clone.setAttribute(attr.name, readAnimatedAttribute(source, attr.name, attr.value));
    }
    const queue = Array.from(source.children).map((child) => ({ parent: clone, child }));
    while (queue.length) {
      const { parent, child } = queue.shift();
      if (child.nodeType !== Node.ELEMENT_NODE)
        continue;
      if (ANIMATE_TAGS.includes(child.tagName))
        continue;
      const newChild = document.createElementNS("http://www.w3.org/2000/svg", child.tagName);
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
  function createAnimatedSvgImage(map, id, svgMarkup, options = {}) {
    var _a, _b, _c, _d;
    const { width = 64, height = 64, fps = 30, pixelRatio = 1, loop = true } = options;
    const mapAny = map;
    const mapCanvas = typeof mapAny.getCanvas === "function" ? mapAny.getCanvas() : mapAny.canvas;
    if (!mapCanvas)
      throw new Error("Map canvas not found on MapLibre instance.");
    const container = mapCanvas.parentElement;
    if (!container)
      throw new Error("Map canvas container not found.");
    const host = document.createElement("div");
    host.style.position = "absolute";
    host.style.left = "-99999px";
    host.style.top = "-99999px";
    host.style.width = "1px";
    host.style.height = "1px";
    host.style.pointerEvents = "none";
    host.style.overflow = "hidden";
    host.innerHTML = svgMarkup.trim();
    const svgEl = host.querySelector("svg");
    if (!svgEl)
      throw new Error("Animated SVG markup must contain a root <svg>.");
    container.appendChild(host);
    try {
      (_b = (_a = svgEl).setCurrentTime) === null || _b === void 0 ? void 0 : _b.call(_a, 0);
      (_d = (_c = svgEl).unpauseAnimations) === null || _d === void 0 ? void 0 : _d.call(_c);
    } catch {
    }
    const animations = Array.from(svgEl.querySelectorAll(ANIMATE_TAGS.join(",")));
    let running = true;
    let remaining = animations.length;
    if (!loop && remaining > 0) {
      animations.forEach((anim) => {
        const handler = () => {
          remaining -= 1;
          if (remaining <= 0)
            running = false;
        };
        anim.addEventListener("endEvent", handler, { once: true });
      });
    }
    const bufferCanvas = document.createElement("canvas");
    bufferCanvas.width = width;
    bufferCanvas.height = height;
    const ctx = bufferCanvas.getContext("2d");
    if (!ctx)
      throw new Error("Could not acquire 2D context for animation buffer.");
    let buffer = new Uint8ClampedArray(width * height * 4);
    let lastFrame = 0;
    const frameDuration = 1e3 / Math.max(1, fps);
    let pending = false;
    const styleImage = {
      width,
      height,
      data: buffer,
      onAdd() {
      },
      onRemove() {
        running = false;
        host.remove();
      },
      render() {
        var _a2, _b2, _c2, _d2, _e, _f;
        if (!running && remaining <= 0 && !pending)
          return false;
        const now = performance.now();
        if (pending || now - lastFrame < frameDuration) {
          (_a2 = map.triggerRepaint) === null || _a2 === void 0 ? void 0 : _a2.call(map);
          return true;
        }
        lastFrame = now;
        pending = true;
        const currentTime = typeof svgEl.getCurrentTime === "function" ? svgEl.getCurrentTime() : null;
        try {
          (_c2 = (_b2 = svgEl).pauseAnimations) === null || _c2 === void 0 ? void 0 : _c2.call(_b2);
          if (currentTime != null) {
            try {
              (_e = (_d2 = svgEl).setCurrentTime) === null || _e === void 0 ? void 0 : _e.call(_d2, currentTime);
            } catch {
            }
          }
        } catch {
        }
        const snapshot = snapshotAnimatedSvg(svgEl);
        snapshot.setAttribute("width", String(width));
        snapshot.setAttribute("height", String(height));
        const svgString = new XMLSerializer().serializeToString(snapshot);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const img = new Image();
        img.onload = () => {
          var _a3, _b3, _c3;
          try {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const imageData = ctx.getImageData(0, 0, width, height);
            buffer = imageData.data;
            styleImage.data = buffer;
            (_a3 = map.triggerRepaint) === null || _a3 === void 0 ? void 0 : _a3.call(map);
          } finally {
            URL.revokeObjectURL(url);
            pending = false;
            (_c3 = (_b3 = svgEl).unpauseAnimations) === null || _c3 === void 0 ? void 0 : _c3.call(_b3);
          }
        };
        img.onerror = () => {
          var _a3, _b3;
          URL.revokeObjectURL(url);
          pending = false;
          (_b3 = (_a3 = svgEl).unpauseAnimations) === null || _b3 === void 0 ? void 0 : _b3.call(_a3);
        };
        img.src = url;
        (_f = map.triggerRepaint) === null || _f === void 0 ? void 0 : _f.call(map);
        return true;
      }
    };
    map.addImage(id, styleImage, { pixelRatio });
    styleImage.render();
    return () => {
      var _a2, _b2, _c2;
      if ((_b2 = (_a2 = map).hasImage) === null || _b2 === void 0 ? void 0 : _b2.call(_a2, id))
        map.removeImage(id);
      (_c2 = styleImage.onRemove) === null || _c2 === void 0 ? void 0 : _c2.call(styleImage);
    };
  }

  // dist/utils/url-builder.js
  function encodeValue(value) {
    return encodeURIComponent(String(value));
  }
  function buildQueryString(params) {
    const entries = Object.entries(params).filter(([_, value]) => value !== void 0 && value !== null && value !== "").map(([key, value]) => `${encodeURIComponent(key)}=${encodeValue(value)}`);
    return entries.length > 0 ? "?" + entries.join("&") : "";
  }
  function buildSvgUrl(params) {
    const { icon, protocol = "svg", ...rest } = params;
    if (!icon) {
      throw new Error("icon parameter is required");
    }
    const queryString = buildQueryString(rest);
    return `${protocol}://${icon}${queryString}`;
  }
  var SvgUrlBuilder = class {
    constructor(icon, protocol = "svg") {
      this.params = { icon, protocol };
    }
    /**
     * Set width and height
     */
    size(width, height) {
      this.params.width = width;
      this.params.height = height !== null && height !== void 0 ? height : width;
      return this;
    }
    /**
     * Set pixel ratio for HiDPI displays
     */
    pixelRatio(ratio) {
      this.params.pixelRatio = ratio;
      return this;
    }
    /**
     * Set foreground and background colors
     */
    colors(opts) {
      if (opts.fg)
        this.params.fg = opts.fg;
      if (opts.bg)
        this.params.bg = opts.bg;
      if (opts.color)
        this.params.color = opts.color;
      return this;
    }
    /**
     * Apply color tint
     */
    tint(color) {
      this.params.tint = color;
      return this;
    }
    /**
     * Add text overlay
     */
    text(content, opts) {
      this.params.text = content;
      if (opts) {
        Object.assign(this.params, opts);
      }
      return this;
    }
    /**
     * Add SVG overlay
     */
    overlay(iconId, opts) {
      this.params.overlay = iconId;
      if (opts) {
        Object.assign(this.params, opts);
      }
      return this;
    }
    /**
     * Add icon grid
     */
    grid(iconIds, opts) {
      this.params.icons = iconIds.join(",");
      if (opts) {
        Object.assign(this.params, opts);
      }
      return this;
    }
    /**
     * Set custom parameter
     */
    param(key, value) {
      this.params[key] = value;
      return this;
    }
    /**
     * Build the final URL
     */
    build() {
      return buildSvgUrl(this.params);
    }
  };
  function svgUrl(icon, protocol) {
    return new SvgUrlBuilder(icon, protocol);
  }
  return __toCommonJS(index_exports);
})();
