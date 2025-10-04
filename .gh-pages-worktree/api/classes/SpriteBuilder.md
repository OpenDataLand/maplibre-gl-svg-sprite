[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Class: SpriteBuilder

Defined in: sprite-core.ts:116

Builder class for creating and managing sprite sheets from SVG icons

## Example

```typescript
const builder = new SpriteBuilder({ pixelRatio: 2 });
builder.addSvg('icon1', '<svg>...</svg>');
const { sprite, json } = await builder.exportURLs();
// Don't forget to call builder.destroy() when done
```

## Constructors

### Constructor

> **new SpriteBuilder**(`options`): `SpriteBuilder`

Defined in: sprite-core.ts:129

Create a new SpriteBuilder

#### Parameters

##### options

Configuration options

###### pixelRatio?

`number` = `1`

Pixel ratio for rendering (default: 1)

#### Returns

`SpriteBuilder`

## Methods

### setPixelRatio()

> **setPixelRatio**(`ratio`): `void`

Defined in: sprite-core.ts:132

Set pixel ratio (must be positive number)

#### Parameters

##### ratio

`number`

#### Returns

`void`

***

### addSvg()

> **addSvg**(`id`, `svg`): `void`

Defined in: sprite-core.ts:135

Add an SVG icon to the sprite

#### Parameters

##### id

`string`

##### svg

`string`

#### Returns

`void`

***

### exportSpriteURL()

> **exportSpriteURL**(): `Promise`\<`string`\>

Defined in: sprite-core.ts:138

Export sprite sheet as object URL

#### Returns

`Promise`\<`string`\>

***

### exportJSONURL()

> **exportJSONURL**(): `Promise`\<`string`\>

Defined in: sprite-core.ts:141

Export JSON metadata as object URL

#### Returns

`Promise`\<`string`\>

***

### exportURLs()

> **exportURLs**(): `Promise`\<\{ `sprite`: `string`; `json`: `string`; \}\>

Defined in: sprite-core.ts:144

Export both sprite and JSON URLs

#### Returns

`Promise`\<\{ `sprite`: `string`; `json`: `string`; \}\>

***

### exportJSON()

> **exportJSON**(): `Promise`\<[`SpriteJSON`](../type-aliases/SpriteJSON.md)\>

Defined in: sprite-core.ts:147

Export JSON metadata object

#### Returns

`Promise`\<[`SpriteJSON`](../type-aliases/SpriteJSON.md)\>

***

### exportCanvas()

> **exportCanvas**(): `Promise`\<`HTMLCanvasElement`\>

Defined in: sprite-core.ts:150

Export canvas element

#### Returns

`Promise`\<`HTMLCanvasElement`\>

***

### exportAssets()

> **exportAssets**(): `Promise`\<[`SpriteAssets`](../interfaces/SpriteAssets.md)\>

Defined in: sprite-core.ts:153

Export sprite assets (JSON + PNG bytes)

#### Returns

`Promise`\<[`SpriteAssets`](../interfaces/SpriteAssets.md)\>

***

### destroy()

> **destroy**(): `void`

Defined in: sprite-core.ts:156

Clean up resources and revoke URLs

#### Returns

`void`

***

### expire()

> **expire**(`url?`): `void`

Defined in: sprite-core.ts:159

Revoke a specific object URL

#### Parameters

##### url?

`null` | `string`

#### Returns

`void`

***

### registerMapLibreProtocol()

> `static` **registerMapLibreProtocol**(`maplibre`, `protocol`, `registry`, `options`): () => `void`

Defined in: sprite-core.ts:172

Register a MapLibre custom protocol to serve sprites from memory

#### Parameters

##### maplibre

[`MapLibreLike`](../interfaces/MapLibreLike.md)

MapLibre GL JS instance

##### protocol

`string`

Protocol name

##### registry

`Record`\<`string`, \{ `1`: [`SpriteAssets`](../interfaces/SpriteAssets.md); `2?`: [`SpriteAssets`](../interfaces/SpriteAssets.md); \}\>

Sprite assets registry

##### options

[`ProtocolOptions`](../interfaces/ProtocolOptions.md) = `{}`

Protocol options

#### Returns

Function to unregister protocol

> (): `void`

##### Returns

`void`
