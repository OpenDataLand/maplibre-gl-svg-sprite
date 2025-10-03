[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Class: OverlayGrid

Defined in: ops/overlay-grid.ts:22

Post-processing operation to overlay a grid of SVG icons

Supports query parameters: icons, grid, gap, columns, gridFg, gfg, gridBg, gbg,
fg, bg, itemW, itemH, gridAnchor, anchor, gx, gy, bgFill, pixelRatio

## Example

Create a grid overlay operation for displaying multiple icons.
```typescript
const op = new OverlayGrid({ icon1: '<svg>...</svg>', icon2: '<svg>...</svg>' });
// Use with params: ?icons=icon1,icon2&columns=2&gap=4
```

## See

 - [overlayText](../functions/overlayText.md) for text overlays
 - [overlaySvg](../functions/overlaySvg.md) for single SVG overlays

## Extends

- [`BaseOp`](BaseOp.md)

## Constructors

### Constructor

> **new OverlayGrid**(`svgIcons`, `id`): `OverlayGrid`

Defined in: ops/overlay-grid.ts:31

Create a new grid overlay operation

#### Parameters

##### svgIcons

`Record`\<`string`, `string`\>

Record mapping icon IDs to SVG strings

##### id

`string` = `'overlayGrid'`

Optional identifier for debugging

#### Returns

`OverlayGrid`

#### Overrides

[`BaseOp`](BaseOp.md).[`constructor`](BaseOp.md#constructor)

## Properties

### id?

> `optional` **id**: `string`

Defined in: ops/base.ts:44

Unique identifier or descriptive name

#### Inherited from

[`BaseOp`](BaseOp.md).[`id`](BaseOp.md#id)

## Methods

### measure()

> **measure**(`params`): `object`

Defined in: ops/overlay-grid.ts:38

Compute the natural grid size (CSS pixels) for the current params.
Returns { width, height } that fits icons using itemW/itemH or inferred sizes,
including gaps between cells.

#### Parameters

##### params

`Record`\<`string`, `string`\>

#### Returns

`object`

##### width

> **width**: `number`

##### height

> **height**: `number`

***

### run()

> **run**(`ctx`, `W`, `H`, `params`): `Promise`\<`void`\>

Defined in: ops/overlay-grid.ts:86

Execute the post-processing operation

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Canvas 2D rendering context

##### W

`number`

##### H

`number`

##### params

`Record`\<`string`, `string`\>

Query parameters from the image request

#### Returns

`Promise`\<`void`\>

#### Overrides

[`BaseOp`](BaseOp.md).[`run`](BaseOp.md#run)
