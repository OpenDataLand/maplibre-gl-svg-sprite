## maplibre-gl-svg-sprite

Browser-only sprite packer for SVGs. Render a PNG sprite via Canvas, export a matching JSON layout, and plug directly into MapLibre — either by hosting files or using an in-memory custom protocol (no server required).

Note: This project is inspired by the original spritezero work by the Mapbox team and the wider open-source community. Huge thanks for blazing the trail — this is a lean, browser-native take on that idea for MapLibre workflows.

### Why this exists

- Zero native/node deps — runs entirely in the browser
- Simple API for one-off generation or incremental building
- Works with MapLibre sprites (1x / 2x) out of the box
- Optional custom protocol so `style.sprite` can point to in-memory data

### Install

#### From npm (once published):
```bash
npm install maplibre-gl-svg-sprite
```

#### From GitHub:
```bash
npm install github:opendataland/maplibre-gl-svg-sprite
```

#### For Development:
```bash
git clone https://github.com/opendataland/maplibre-gl-svg-sprite.git
cd maplibre-gl-svg-sprite
npm install
npm run build
```

### Quick start (browser)

```html
<script type="module">
  // If installed from npm:
  // import { SpriteBuilder } from 'maplibre-gl-svg-sprite';
  // For local dev, import from dist:
  import { SpriteBuilder } from './dist/index.js';

  const sb = new SpriteBuilder({ pixelRatio: 2 });
  sb.addSvg('marker', '<svg width="24" height="24" viewBox="0 0 24 24">...</svg>');

  const { sprite: spriteUrl, json: jsonUrl } = await sb.exportURLs();
  // or: const json = await sb.exportJSON();
  // or: const canvas = await sb.exportCanvas();

  // Remember to revoke URLs when no longer needed
  // sb.expire(spriteUrl); sb.expire(jsonUrl);
</script>
```

Alternatively, a single-call function is available:

```js
// If installed from npm: import { generateBrowserSprite } from 'maplibre-gl-svg-sprite';
import { generateBrowserSprite } from './dist/index.js';

const { spriteURL, jsonURL, json, canvas } = await generateBrowserSprite({
  imgs: [ { id: 'a', svg: '<svg .../>' }, { id: 'b', svg: '<svg .../>' } ],
  pixelRatio: 1
});
```

### Demo

Dev server via Vite:

```bash
npm run dev   # requires: npm i -D vite
# quickstart pages:
#   /examples/maplibre-quickstart.html
#   /examples/maplibre-protocol.html
#   /examples/maplibre-i80-shield.html
#   /examples/maplibre-grid.html
```

Or static preview:

```bash
npm run build
python3 -m http.server 5173
# open http://localhost:5173/demo/
# quickstart examples:
#   http://localhost:5173/examples/maplibre-quickstart.html
#   http://localhost:5173/examples/maplibre-protocol.html
```

### Protocols

Two custom protocols help you integrate sprites and raw SVG icons without hosting files.

- `sprite://<key>`
  - What: In‑memory MapLibre sprite (pairs of PNG + JSON, plus @2x).
  - Register: `SpriteBuilder.registerMapLibreProtocol(maplibre, 'sprite', registry, { oneShot?, ttlMs? })` or use `registerProtocolFromIcons(...)` to build the registry for you.
  - Use: set `style.sprite = 'sprite://<key>'` in your style; MapLibre will fetch `sprite.png/.json` and `sprite@2x.png/.json` via the protocol.
  - When: You want standard MapLibre sprite behavior without a server. Great for shipped styles or self‑contained demos.
  - Lifecycle: `oneShot` frees a ratio after first (json+png) serve; `ttlMs` evicts after a timeout. Keep the registry object around as long as the map/style might request it.

- `svg://<id>.png?params`
  - What: On‑the‑fly conversion of a single SVG (by id) into a PNG buffer with parameters.
  - Register: `registerSVGProtocol(maplibre, 'svg', icons)` where `icons` is a map `{ id: svgMarkup }` (generated or hand‑built).
  - Use: `map.loadImage('svg://marker.png?width=32&height=32&fg=%23ff3366&pixelRatio=2', cb)` or pass such URLs into sources that MapLibre will load.
  - Params:
    - `width`, `height`: CSS pixels of the target image
    - `pixelRatio`: render density (defaults to device DPR)
    - `color`: fallback fill color
    - `fg`, `bg`: recolor elements marked with `data-fg` / `data-bg` in your SVGs
  - When: You need dynamic coloring/sizing per feature or want to avoid managing sprite sheets.

Notes
- These protocols run entirely in the browser; they don’t require server changes.
- For dynamic, per‑feature images created at style render time, you can also use the `styleimagemissing` handler with composable ops (overlaySvg/overlayText/overlayGrid) instead of a protocol.
- Examples to explore:
  - `sprite://` end‑to‑end: `/examples/maplibre-quickstart.html` and `/examples/maplibre-protocol.html`
  - `svg://` per‑icon flow: `/examples/maplibre-svg-protocol.html`

### Docs (Markdown)

Generate API docs with TypeDoc (Markdown output suitable for GitHub):

```bash
npm run docs
# opens at docs/api/README.md
```

Author API docs using JSDoc comments in the source. Only exported members from `src/index.ts` are included; mark internals with `@internal` to exclude.

### API

### Testing

This repo uses Vitest with a DOM-like environment provided by happy-dom.

- Run all tests (single-process):

```bash
npm run test
```

- Watch mode during development:

```bash
npm run test:watch
```

Notes:
- The config disables worker threads (`threads: false`) to keep runs deterministic and to avoid environment limits on some systems.
- If you prefer default parallel mode locally, remove `threads: false` in `vitest.config.ts`.
- The tests focus on small, pure utilities (`src/utils/*`) so they run fast and don’t require a browser.

- `class SpriteBuilder({ pixelRatio?: number })`
  - `addSvg(id: string, svg: string)`
  - `setPixelRatio(ratio: number)`
  - `exportSpriteURL(): Promise<string>`
  - `exportJSONURL(): Promise<string>`
  - `exportURLs(): Promise<{ sprite: string; json: string }>`
  - `expire(url?: string | null): void`
  - `exportJSON(): Promise<Record<string, {width,height,x,y,pixelRatio}>>`
  - `exportCanvas(): Promise<HTMLCanvasElement>`
  - `exportAssets(): Promise<{ json, png(ArrayBuffer) }>`
  - `destroy(): void`
  - `static registerMapLibreProtocol(maplibre, protocol: string, registry: Record<string, {1: assets, 2?: assets}>) => () => void`
    - Registers a custom protocol so you can set `style.sprite = "<protocol>://<key>"`.
    - Returns an unregister function.

- `generateBrowserSprite({ imgs, pixelRatio })`
  - Returns `{ spriteURL, jsonURL, json, canvas, width, height }`

### Use with MapLibre

Option A — Host files (classic)
- Build 1x and 2x files and host them: `sprite.png/.json`, `sprite@2x.png/.json`.
- In your style JSON: `"sprite": "/assets/sprite"`.
- Ensure your `icon-image` names match the IDs you added.

Option B — No hosting (custom protocol)

```js
import maplibregl from 'maplibre-gl';
// If installed from npm: import { SpriteBuilder } from 'maplibre-gl-svg-sprite';
import { SpriteBuilder } from './dist/index.js';

// Build 1x and 2x assets in-memory
const sb1 = new SpriteBuilder({ pixelRatio: 1 });
const sb2 = new SpriteBuilder({ pixelRatio: 2 });
// Add the same icons to both builders
icons.forEach(({ id, svg }) => { sb1.addSvg(id, svg); sb2.addSvg(id, svg); });

const assets1x = await sb1.exportAssets();
const assets2x = await sb2.exportAssets();

// Register protocol "sprite://<key>"
const unregister = SpriteBuilder.registerMapLibreProtocol(maplibregl, 'sprite', {
  mypack: { 1: assets1x, 2: assets2x }
}, { oneShot: false });

// In your style JSON
// {
//   "sprite": "sprite://mypack",
//   ...
// }

const map = new maplibregl.Map({ style });
// Later, when done:
// unregister();
```

See a complete working page: `examples/maplibre-protocol.html`.

Option C — Easiest: build + register from one icon list

If you don’t want to juggle separate 1x/2x builders, use the convenience helper:

```js
import maplibregl from 'maplibre-gl';
// If installed from npm: import { registerProtocolFromIcons } from 'maplibre-gl-svg-sprite';
import { registerProtocolFromIcons } from './dist/index.js';

const icons = [
  { id: 'marker', svg: '<svg width="24" height="24" viewBox="0 0 24 24">...</svg>' },
  { id: 'star', svg: '<svg width="24" height="24" viewBox="0 0 24 24">...</svg>' }
];

// Builds 1x and 2x and registers protocol sprite://
// oneShot: serve JSON+PNG once per ratio and free memory
// ttlMs: expire a ratio after its first request + TTL (whichever comes first wins if both set)
await registerProtocolFromIcons(maplibregl, 'sprite', 'pack1', icons, [1, 2], { oneShot: true, ttlMs: 60_000 });

const style = {
  version: 8,
  sprite: 'sprite://pack1',
  sources: { /* ... */ },
  layers: [
    { id: 'symbols', type: 'symbol', layout: { 'icon-image': 'marker' } }
  ]
};

new maplibregl.Map({ container: 'map', style });
```

### Tips
- Pixel ratio: build a matching 1x and 2x sprite for best results.
- Memory: call `destroy()` or revoke URLs if you generate often.
- Layout: current packer is horizontal. If you need tighter packing, we can wire in a bin packer.
- SVG recolor markers: when using `data-fg` / `data-bg` on SVG elements for recoloring, make sure the attributes are XML‑friendly, e.g. `data-fg="true"` (not just `data-fg`). The library will rewrite colors, and it also normalizes boolean data attributes for robust XML parsing.

### Advanced: On‑the‑fly SVG images (svg://)

You can register a lightweight protocol to render individual icons from raw SVG strings with simple parameters. This is handy with `map.loadImage()` / `map.addImage()` flows.

```js
import maplibregl from 'maplibre-gl';
import { registerSVGProtocol } from './dist/index.js';

const icons = {
  marker: '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="#3FB1CE"/></svg>',
  star:   '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l2.9 6.1 6.7.9-4.8 4.6 1.2 6.7L12 17.8 6 20.3l1.2-6.7L2.4 9l6.7-.9L12 2z" fill="#F2C94C"/></svg>'
};

const unregisterSVG = registerSVGProtocol(maplibregl, 'svg', icons);

// Example: fetch a tinted, resized PNG from an SVG
// Prefer foreground/background params for multi-layer icons that mark elements with data-fg / data-bg
const url = 'svg://marker.png?fg=%23ff3366&bg=%23003366&width=32&height=32&pixelRatio=2';
map.loadImage(url, (err, image) => {
  if (err) throw err;
  map.addImage('marker-32', image);
});

// Later: unregisterSVG()
```

### Bring your own SVG icon library

If you have a directory of SVG files (e.g., `./svg-icons`), you can generate a typed registry and plug it into `registerSVGProtocol` or build sprites directly.

Steps:
- Put your `.svg` files under `./svg-icons` (can be nested).
- Generate a registry module:

```bash
npm run icons:build
npm run build
```

This creates `src/icons.generated.ts` (compiled to `dist/icons.generated.js`). Use it like:

```js
import maplibregl from 'maplibre-gl';
import { registerSVGProtocol } from './dist/index.js';
import icons from './dist/icons.generated.js';

const unregisterSVG = registerSVGProtocol(maplibregl, 'svg', icons);
// Now you can use svg://<id>.png?width=...&height=...&color=...
```

To build a sprite from the same icons, map them to `buildSpriteRegistryFromIcons` inputs:

```js
import { buildSpriteRegistryFromIcons, SpriteBuilder } from './dist/index.js';
const iconList = Object.entries(icons).map(([id, svg]) => ({ id, svg }));
const registry = await buildSpriteRegistryFromIcons('pack1', iconList, [1, 2]);
const unregister = SpriteBuilder.registerMapLibreProtocol(maplibregl, 'mysprite', registry, { ttlMs: 60000, oneShot: false });
```

### Auto‑generate missing images with parameters

You can handle MapLibre’s `styleimagemissing` to dynamically create tinted/resized images from either your SVG library or an in‑memory sprite — and compose reusable ops.

```js
import maplibregl from 'maplibre-gl';
import {
  registerStyleImageMissingHandler,
  registerSVGProtocol,
  buildSpriteRegistryFromIcons,
  SpriteBuilder,
  ops,
} from './dist/index.js';

// Option A: from SVG library
import icons from './dist/icons.generated.js';
const map = new maplibregl.Map({ /* ... */ });
// Compose ops: overlay an SVG (e.g., a shield) and draw a text label on top
const post = ops.chain(
  // Both class instances and plain functions are supported
  new ops.OverlaySvg(icons),
  new ops.OverlayText()
);

const unregisterMissing = registerStyleImageMissingHandler(map, { svgIcons: icons, postprocessCanvas: post });

// Now using icon names with params will be generated on the fly:
// layout: { 'icon-image': 'marker?fg=%23ff3366&bg=%23003366&width=32&height=32&pixelRatio=2' }

// Option B: recolor from a sprite built in memory
const iconList = Object.entries(icons).map(([id, svg]) => ({ id, svg }));
const registry = await buildSpriteRegistryFromIcons('pack1', iconList, [1, 2]);
SpriteBuilder.registerMapLibreProtocol(maplibregl, 'mysprite', registry);
// When style references an image like 'marker?color=%2300aaff', generate from sprite sheet (single-color tint)
const unregisterMissing2 = registerStyleImageMissingHandler(map, { protocolRegistry: registry, spriteKey: 'pack1', postprocessCanvas: post });

// Cleanup when done
// unregisterMissing(); unregisterMissing2();
```

### Authoring custom ops

Ops are small canvas transformations that implement a single method. To make it easy to build your own, there’s a tiny base class.

```ts
import { BaseOp, chain } from './dist/index.js';

class OutlineOp extends BaseOp {
  run(ctx: CanvasRenderingContext2D, w: number, h: number, params: Record<string,string>) {
    const color = params.outline || '#00f';
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, w - 1, h - 1);
    ctx.restore();
  }
}

// Use with other built‑in ops
const post = chain(new OutlineOp(), new ops.OverlayText());
```

Notes:
- `chain(...)` accepts both class instances and legacy plain functions, so existing code keeps working.
- Built‑ins are available both as classes (`OverlaySvg`, `OverlayText`, `OverlayGrid`) and as legacy function helpers (`overlaySvg(...)`, ...).

Customize missing‑image behavior with hooks:

```js
registerStyleImageMissingHandler(map, {
  svgIcons: icons,
  transformSvg: (svg, params) => {
    // Example: add a stroke for emphasis
    return svg.replace('<svg', '<svg stroke="#000" stroke-width="1"');
  },
  postprocessCanvas: (ctx, w, h) => {
    // Example: subtle shadow
    ctx.save();
    ctx.globalCompositeOperation = 'destination-over';
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 2; ctx.fillStyle = 'transparent';
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
});
```

One‑shot convenience for sprites:

```js
import { registerOneShotSpriteFromIcons } from './dist/index.js';
await registerOneShotSpriteFromIcons(maplibregl, 'mysprite', 'pack1', iconList, [1,2], 60_000);
```

### Acknowledgments

- spritezero was originally developed and maintained by Mapbox and many community contributors. This project draws inspiration from that work while providing an independent, browser-first implementation for MapLibre workflows.
- Related projects include spritezero-cli (command-line tooling) and ShelfPack (bin packing), which influenced the broader ecosystem and prior approaches to layout.
- The Elastic fork (@elastic/spritezero) provided additional fixes and context that helped sustain the project over time — much appreciated.

maplibre-gl-svg-sprite is a browser-first reimagining: no native dependencies, focused on MapLibre GL usage, and designed to complement — not replace — the great work that came before. Heartfelt thanks to everyone who built and maintained spritezero and the surrounding tooling.

### License

Released under the [MIT License](LICENSE.md). Mapbox is a trademark of Mapbox, Inc.; references here are solely for attribution.

### Tooling Transparency

Portions of this project were developed with assistance from ChatGPT Codex to help iterate on demos, packaging, and documentation.
