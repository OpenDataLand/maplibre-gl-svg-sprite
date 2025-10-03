[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Function: registerSVGProtocol()

> **registerSVGProtocol**(`maplibre`, `protocol`, `icons`): () => `void`

Defined in: sprite-core.ts:333

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

## Returns

Function to unregister the protocol

> (): `void`

### Returns

`void`

## Throws

If maplibre doesn't have addProtocol/removeProtocol
