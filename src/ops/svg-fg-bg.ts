/**
 * Apply foreground and background colors to SVG elements with data-fg/data-bg attributes
 *
 * Injects CSS rules to style elements marked with `data-fg` or `data-bg` attributes.
 *
 * @param svg - SVG markup string
 * @param fg - Foreground color (applied to elements with data-fg attribute)
 * @param bg - Background color (applied to elements with data-bg attribute)
 * @returns Modified SVG string with injected styles
 *
 * @example
 * ```typescript
 * const svg = '<svg><path data-fg="true"/><rect data-bg="true"/></svg>';
 * const colored = applySvgFgBg(svg, '#ff0000', '#0000ff');
 * ```
 */
export function applySvgFgBg(svg: string, fg?: string, bg?: string, opts?: { debug?: boolean }): string {
  if (!fg && !bg) return svg;

  // Normalize boolean data attributes for XML parsers: data-fg, data-bg => data-fg="true"
  const normalizeBooleanDataAttrs = (s: string) =>
    s.replace(/(\sdata-(?:fg|bg))(\s|>|\/>)/gi, (_m, a: string, b: string) => `${a}="true"${b}`);

  svg = normalizeBooleanDataAttrs(svg);

  // Best-effort DOM-based rewrite for correctness
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, 'image/svg+xml');
    // Detect parse error documents (Firefox/Chromium insert <parsererror>)
    if (doc && (doc as any).getElementsByTagName && (doc as any).getElementsByTagName('parsererror').length) {
      if (opts && opts.debug) console.warn('[applySvgFgBg] DOMParser parsererror; falling back to string rewrite');
      throw new Error('parsererror');
    }
    const root = doc && doc.documentElement;
    if (root && root.nodeName.toLowerCase() === 'svg') {
      // Ensure xmlns present for data-URL rasterization
      try { if (!root.getAttribute('xmlns')) root.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); } catch {}
      if (bg) {
        const nodes = root.querySelectorAll('[data-bg]');
        nodes.forEach((el: any) => { try { el.setAttribute('fill', bg); el.setAttribute('stroke', bg); } catch {} });
      }
      if (fg) {
        const nodes = root.querySelectorAll('[data-fg]');
        nodes.forEach((el: any) => { try { el.setAttribute('fill', fg); el.setAttribute('stroke', fg); } catch {} });
      }
      const xml = new XMLSerializer().serializeToString(root);
      if (opts && opts.debug) console.debug('[applySvgFgBg] DOM rewrite ok', { len: xml.length });
      return xml;
    }
  } catch {}

  // Fallback: inject minimal style and inline rewrite as last resort
  let out = svg;
  const injectStyle = (css: string) => {
    const m = out.match(/<svg[^>]*>/i);
    if (m) {
      const open = m[0];
      const styled = `${open}<style type="text/css">${css}</style>`;
      out = out.replace(open, styled);
    } else {
      out = `<svg><style type="text/css">${css}</style>` + out.replace(/^<svg/i, '').trim();
    }
  };
  const rules: string[] = [];
  if (fg) rules.push(`*[data-fg]{fill:${fg}!important;stroke:${fg}!important;}`);
  if (bg) rules.push(`*[data-bg]{fill:${bg}!important;stroke:${bg}!important;}`);
  if (rules.length) injectStyle(rules.join(''));

  const setAttr = (tag: string, name: string, value: string) => {
    const re = new RegExp(`(\\s${name}=\")[^"]*(\")`, 'i');
    if (re.test(tag)) return tag.replace(re, `$1${value}$2`);
    if (/\/>\s*$/.test(tag)) return tag.replace(/\/>\s*$/, ` ${name}="${value}"/>`);
    return tag.replace(/>\s*$/, ` ${name}="${value}">`);
  };
  const rewrite = (html: string, marker: 'data-fg' | 'data-bg', color?: string) => {
    if (!color) return html;
    return html.replace(new RegExp(`<([^>]*?\\s${marker}(?:[\"'\s>][^>]*)?)>`, 'gi'), (full) => {
      let tag = full;
      tag = setAttr(tag, 'fill', color);
      tag = setAttr(tag, 'stroke', color);
      return tag;
    });
  };
  if (fg) out = rewrite(out, 'data-fg', fg);
  if (bg) out = rewrite(out, 'data-bg', bg);
  if (opts && opts.debug) console.debug('[applySvgFgBg] fallback rewrite ok', { len: out.length });
  return out;
}
