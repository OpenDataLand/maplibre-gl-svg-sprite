// Default named routes for styleimagemissing router.
// Convention: Built-ins use a "$" prefix to avoid collisions with your data-driven names.
//
// Usage (IIFE/global):
//   const routes = {
//     ...buildDefaultNamedRoutes(svgIcons),
//     airport: MaplibreSvgSprite.ops.chain(
//       MaplibreSvgSprite.ops.overlaySvg(svgIcons),
//       MaplibreSvgSprite.ops.overlayText()
//     )
//   };
//   const unregister = registerNamedImageHandlers(map, routes);
//
// Then in your style layer expressions:
//   'icon-image': '$badge?width=44&height=60&overlay=marker&text=JFK&textAnchor=bottom'

export function buildDefaultNamedRoutes(svgIcons) {
  const ops = (window && window.MaplibreSvgSprite && window.MaplibreSvgSprite.ops) || null;
  if (!ops) throw new Error('buildDefaultNamedRoutes requires window.MaplibreSvgSprite.ops');

  // Basic text-only label. Provide width/height or let the router fall back to defaults.
  const $text = ops.overlayText();

  // Draw a single SVG by id using overlay=<id>. Supports recolor via fg/bg or color.
  const $svg = ops.overlaySvg(svgIcons);

  // Simple badge: SVG + text stacked (e.g., a shield with a number).
  const $badge = ops.chain(ops.overlaySvg(svgIcons), ops.overlayText());

  // Grid of small SVGs (e.g., mini legend). Params like icons=tree,tent,water&columns=3
  const $grid = ops.overlayGrid(svgIcons);

  return { $text, $svg, $badge, $grid };
}

