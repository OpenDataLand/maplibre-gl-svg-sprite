[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: applySpriteTint()

> **applySpriteTint**(`ctx`, `w`, `h`, `color`): `void`

Defined in: ops/sprite-tint.ts:18

Apply a color tint overlay to the current canvas content

Uses source-atop composite operation to tint existing pixels while preserving alpha.

## Parameters

### ctx

`CanvasRenderingContext2D`

Canvas 2D rendering context

### w

`number`

Width in pixels

### h

`number`

Height in pixels

### color

`string`

Tint color (CSS color string)

## Returns

`void`

## Example

```typescript
applySpriteTint(ctx, 24, 24, '#ff0000'); // Tint to red
```
