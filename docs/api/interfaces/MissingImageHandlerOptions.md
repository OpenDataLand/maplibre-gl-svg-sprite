[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Interface: MissingImageHandlerOptions

Defined in: missing-image.ts:12

Options for configuring the missing image handler

## Properties

### svgIcons?

> `optional` **svgIcons**: `Record`\<`string`, `string`\>

Defined in: missing-image.ts:14

Generate from SVG strings if provided

***

### protocolRegistry?

> `optional` **protocolRegistry**: `ProtocolRegistry`

Defined in: missing-image.ts:16

Recolor from in-memory sprite registry if available

***

### spriteKey?

> `optional` **spriteKey**: `string`

Defined in: missing-image.ts:18

Registry key used with registerMapLibreProtocol

***

### transformSvg()?

> `optional` **transformSvg**: (`svg`, `params`) => `string`

Defined in: missing-image.ts:20

Optional custom SVG transformation function

#### Parameters

##### svg

`string`

##### params

`Record`\<`string`, `string`\>

#### Returns

`string`

***

### postprocessCanvas()?

> `optional` **postprocessCanvas**: (`ctx`, `w`, `h`, `params`) => `void` \| `Promise`\<`void`\>

Defined in: missing-image.ts:22

Optional post-processing function for canvas

#### Parameters

##### ctx

`CanvasRenderingContext2D`

##### w

`number`

##### h

`number`

##### params

`Record`\<`string`, `string`\>

#### Returns

`void` \| `Promise`\<`void`\>

***

### debug?

> `optional` **debug**: `boolean`

Defined in: missing-image.ts:24

Enable debug logging

***

### dprBackBuffer?

> `optional` **dprBackBuffer**: `boolean`

Defined in: missing-image.ts:26

Render backing canvas at device pixel ratio (default: true)

***

### eagerPlaceholder?

> `optional` **eagerPlaceholder**: `boolean`

Defined in: missing-image.ts:28

Add a transparent placeholder immediately to suppress MapLibre warnings (default: false)
