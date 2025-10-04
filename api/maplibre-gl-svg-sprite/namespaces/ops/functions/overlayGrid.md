[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: overlayGrid()

> **overlayGrid**(`svgIcons`): (`ctx`, `W`, `H`, `params`) => `Promise`\<`void`\> & `object`

Defined in: ops/overlay-grid.ts:251

Create a grid overlay postprocess function

Helper function that returns a Postprocess function for backwards compatibility.

## Parameters

### svgIcons

`Record`\<`string`, `string`\>

Record mapping icon IDs to SVG strings

## Returns

Postprocess function that overlays a grid of icons

## Example

```typescript
const postprocess = overlayGrid({ icon1: '<svg>...</svg>', icon2: '<svg>...</svg>' });
// Use in registerStyleImageMissingHandler
```
