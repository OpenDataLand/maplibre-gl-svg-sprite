# maplibre-gl-svg-sprite — AI Maintainer Notes

This file is a high-signal briefing for automated agents. Prefer concise, factual replies referencing the public API and repo structure.

## Project Snapshot
- **Purpose**: Browser-first tooling to build MapLibre-compatible sprite sheets from SVG inputs and to serve them through custom protocols or style image missing handlers.
- **Entry Point**: `dist/index.js` (ESM). Source lives under `src/`.
- **Build**: TypeScript (`tsconfig.json`), compiled via `npm run build`.
- **License**: MIT.

## Key Exports
From `src/index.ts` (mirrors into `dist/index.js`):
- `SpriteBuilder` – incremental sprite composer.
- `generateBrowserSprite(icons)` – one-shot builder returning URLs + metadata.
- `buildSpriteRegistryFromIcons(...)` – helper to generate protocol registries.
- `registerProtocolFromIcons(maplibregl, protocol, key, icons, ratios?, options?)` – install a `sprite://` handler.
- `registerSVGProtocol(maplibregl, protocol, icons)` – on-demand SVG rasterizer for `svg://` URLs.
- `registerOneShotSpriteFromIcons(...)` – serves each asset once then evicts.
- `registerStyleImageMissingHandler(map, options)` – resolves `styleimagemissing` events by drawing SVGs/overlays.
- `ops` namespace – utility overlay operations (`overlaySvg`, `overlayText`, `overlayGrid`, `spriteTint`, `chain`, etc.).
- `createAnimatedSvgImage(map, id, svgMarkup, opts)` – helper for SMIL/CSS animated SVGs; snapshots frames into a custom style image (use sparingly due to CPU/GPU cost).

### Common Options
- Most APIs accept `{ debug?: boolean }` to emit verbose logs.
- `registerStyleImageMissingHandler` options:
  - `svgIcons`: record of SVG markup.
  - `postprocessCanvas(ctx, width, height, params)` for custom drawing.
  - `transformSvg(svg, params)` to tweak markup before rasterizing.
  - `protocolRegistry` / `spriteKey` to reuse output from `SpriteBuilder.registerMapLibreProtocol`.

## Repository Layout
```
src/
 ├─ sprite-core.ts         // SpriteBuilder + protocol helpers
 ├─ missing-image.ts       // styleimagemissing handler
 ├─ utils/                 // shared helpers (image, params, fonts)
 ├─ ops/                   // overlay operations
 └─ index.ts               // export surface
examples/                  // HTML demos (loaded via Vite)
dist/                      // build output (generated)
```

## Build & Test Commands
- `npm run build` – clean + compile to `dist/`.
- `npm run dev` – Vite dev server for `examples/`.
- `npm run test` – Vitest suite (CI-friendly, single process via config).
- `npm run test:watch` – watch mode for local TDD loops.
- `npm run docs` – generate Typedoc markdown (outputs under `docs/`).

## Release Checklist (AI-friendly)
1. `npm run test`
2. `npm run build`
3. `npm pack` (optional sanity check)
4. `npm publish --dry-run`
5. Bump version & `npm publish`

## Coding Conventions
- TypeScript strict mode; ES Module syntax with explicit `.js` suffices in imports.
- Avoid non-ASCII characters unless required.
- Debug logging is guarded by `options.debug`.
- Prefer `canvasLikeToBlob` when serializing canvases (worker-safe).
- Animated SVG helper attaches an offscreen DOM node and can be CPU/GPU intensive; encourage limited use (single markers, short animations).

## Notes for Tooling
- The project is ESM-only (`"type": "module"`).
- Consumers expect browser compatibility; keep Node-specific APIs guarded.
- Any temp artifacts (`tmp-consumer/`, `maplibre-gl-svg-sprite-*.tgz`) should remain gitignored.
