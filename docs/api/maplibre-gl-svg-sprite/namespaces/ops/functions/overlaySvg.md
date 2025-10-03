[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: overlaySvg()

> **overlaySvg**(`svgIcons`): [`Postprocess`](../type-aliases/Postprocess.md)

Defined in: ops/overlay-svg.ts:216

Create an SVG overlay postprocess function

Helper function that returns a Postprocess function for backwards compatibility.

## Parameters

### svgIcons

`Record`\<`string`, `string`\>

Record mapping icon IDs to SVG strings

## Returns

[`Postprocess`](../type-aliases/Postprocess.md)

Postprocess function that overlays SVG icons

## Example

```typescript
const postprocess = overlaySvg({ marker: '<svg>...</svg>' });
// Use in registerStyleImageMissingHandler
```
