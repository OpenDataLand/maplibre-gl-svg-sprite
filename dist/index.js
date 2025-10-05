export { generateBrowserSprite, 
// Aliases for ergonomics
generateBrowserSprite as buildSprite, SpriteBuilder, buildSpriteRegistryFromIcons, registerProtocolFromIcons, 
// Alias for ergonomics
registerProtocolFromIcons as registerSpriteFromIcons, registerSVGProtocol, registerOneShotSpriteFromIcons, } from './sprite-core.js';
export { registerStyleImageMissingHandler, } from './missing-image.js';
export * as ops from './ops/index.js';
export { createAnimatedSvgImage } from './utils/animated-svg.js';
export { buildSvgUrl, svgUrl, SvgUrlBuilder } from './utils/url-builder.js';
