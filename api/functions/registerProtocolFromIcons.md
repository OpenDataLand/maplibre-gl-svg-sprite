[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Function: registerProtocolFromIcons()

> **registerProtocolFromIcons**(`maplibre`, `protocol`, `key`, `icons`, `ratios`, `options`): `Promise`\<() => `void`\>

Defined in: sprite-core.ts:294

Build and register a protocol directly from icons

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

### options

[`ProtocolOptions`](../interfaces/ProtocolOptions.md) = `{}`

Protocol options

## Returns

`Promise`\<() => `void`\>

Promise resolving to unregister function
