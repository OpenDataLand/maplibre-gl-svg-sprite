[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Function: registerOneShotSpriteFromIcons()

> **registerOneShotSpriteFromIcons**(`maplibre`, `protocol`, `key`, `icons`, `ratios`, `ttlMs?`): `Promise`\<() => `void`\>

Defined in: sprite-core.ts:311

Register a one-shot sprite protocol (sprites served once then removed)

## Parameters

### maplibre

[`MapLibreLike`](../interfaces/MapLibreLike.md)

MapLibre GL JS instance

### protocol

`string`

Protocol name

### key

`string`

Registry key

### icons

`SvgInput`[]

Array of SVG icons

### ratios

`number`[] = `...`

Pixel ratios (default: [1, 2])

### ttlMs?

`number`

Optional TTL in milliseconds

## Returns

`Promise`\<() => `void`\>

Promise resolving to unregister function
