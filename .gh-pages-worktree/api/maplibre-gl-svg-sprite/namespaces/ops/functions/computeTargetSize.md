[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: computeTargetSize()

> **computeTargetSize**(`svg`, `pixelRatio`, `fallback`): `object`

Defined in: ops/overlay-svg.ts:21

Compute target rendering size for an SVG

Extracts dimensions from width/height attributes or viewBox, applying pixel ratio.
This is a public utility that can be used independently of the overlay operations.

## Parameters

### svg

`string`

SVG markup string

### pixelRatio

`number`

Target pixel ratio

### fallback

Fallback dimensions if none found in SVG

#### width

`number`

#### height

`number`

## Returns

`object`

Target width and height in pixels

### width

> **width**: `number`

### height

> **height**: `number`

## Example

```typescript
const size = computeTargetSize('<svg width="24" height="24">...</svg>', 2, { width: 32, height: 32 });
// => { width: 48, height: 48 }
```
