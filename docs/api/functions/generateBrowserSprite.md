[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Function: generateBrowserSprite()

> **generateBrowserSprite**(`params`): `Promise`\<[`SpriteResult`](../interfaces/SpriteResult.md)\>

Defined in: sprite-core.ts:76

Generate a sprite sheet from SVG icons for browser usage

## Parameters

### params

Configuration object

#### imgs

`SvgInput`[]

Array of SVG icons

#### pixelRatio?

`number` = `1`

Pixel ratio for rendering (default: 1)

## Returns

`Promise`\<[`SpriteResult`](../interfaces/SpriteResult.md)\>

Promise resolving to sprite result with URLs and canvas

## Throws

If parameters are invalid
