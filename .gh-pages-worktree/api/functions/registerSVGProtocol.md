[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Function: registerSVGProtocol()

> **registerSVGProtocol**(`maplibre`, `protocol`, `icons`, `options`): () => `void`

Defined in: sprite-core.ts:339

Register an SVG protocol for on-the-fly parameterized icon rendering

URL format: `${protocol}://<id>.png?color=#ff0000&width=24&pixelRatio=2`

## Parameters

### maplibre

[`MapLibreLike`](../interfaces/MapLibreLike.md)

MapLibre GL JS instance

### protocol

`string`

Protocol name

### icons

`Record`\<`string`, `string`\>

Record mapping icon IDs to SVG strings

### options

[`SVGProtocolOptions`](../interfaces/SVGProtocolOptions.md) = `{}`

## Returns

Function to unregister the protocol

> (): `void`

### Returns

`void`

## Throws

If maplibre doesn't have addProtocol/removeProtocol
