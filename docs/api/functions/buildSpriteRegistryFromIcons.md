[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Function: buildSpriteRegistryFromIcons()

> **buildSpriteRegistryFromIcons**(`key`, `icons`, `ratios`): `Promise`\<[`ProtocolRegistry`](../type-aliases/ProtocolRegistry.md)\>

Defined in: sprite-core.ts:266

Build a protocol registry from icons at multiple pixel ratios

## Parameters

### key

`string`

Registry key for the sprite set

### icons

`SvgInput`[]

Array of SVG icons

### ratios

`number`[] = `...`

Pixel ratios to generate (default: [1, 2])

## Returns

`Promise`\<[`ProtocolRegistry`](../type-aliases/ProtocolRegistry.md)\>

Promise resolving to protocol registry
