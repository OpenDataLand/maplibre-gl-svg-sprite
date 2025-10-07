export { generateBrowserSprite, 
// Aliases for ergonomics
generateBrowserSprite as buildSprite, SpriteBuilder, buildSpriteRegistryFromIcons, registerProtocolFromIcons, 
// Alias for ergonomics
registerProtocolFromIcons as registerSpriteFromIcons, registerSVGProtocol, registerOneShotSpriteFromIcons, } from './sprite-core.js';
export * as ops from './ops/index.js';
export { createAnimatedSvgImage } from './utils/animated-svg.js';
export { buildSvgUrl, svgUrl, SvgUrlBuilder } from './utils/url-builder.js';
export { buildRouteUrl, routeUrl, RouteUrlBuilder } from './utils/url-builder.js';
export { registerNamedImageHandlers, buildDefaultNamedRoutes } from './utils/named-sim.js';
export { iconExpr, IconExprBuilder } from './utils/icon-expr.js';
