[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: svgToBitmap()

> **svgToBitmap**(`svg`, `width`, `height`): `Promise`\<`HTMLCanvasElement`\>

Defined in: ops/overlay-svg.ts:93

Convert SVG to bitmap canvas at specified dimensions

Tries multiple loading strategies (data URLs, blob URL) for cross-browser compatibility.
This is a public utility that can be used independently of the overlay operations.

## Parameters

### svg

`string`

SVG markup string

### width

`number`

Target width in pixels

### height

`number`

Target height in pixels

## Returns

`Promise`\<`HTMLCanvasElement`\>

Promise resolving to canvas with rendered SVG

## Example

```typescript
const canvas = await svgToBitmap('<svg>...</svg>', 48, 48);
ctx.drawImage(canvas, 0, 0);
```
