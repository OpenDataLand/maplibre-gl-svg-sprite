[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Class: OverlaySvg

Defined in: ops/overlay-svg.ts:144

Post-processing operation to overlay SVG icons on an image

Supports query parameters: overlay, ovl, ofg, overlayFg, obg, overlayBg,
fg, bg, pixelRatio, anchor, ow, oh, ox, oy

## Example

```typescript
const op = new OverlaySvg({ marker: '<svg>...</svg>' });
// Use with params: ?overlay=marker&ow=32&oh=32&anchor=center
```

## Extends

- [`BaseOp`](BaseOp.md)

## Constructors

### Constructor

> **new OverlaySvg**(`svgIcons`, `id`): `OverlaySvg`

Defined in: ops/overlay-svg.ts:153

Create a new SVG overlay operation

#### Parameters

##### svgIcons

`Record`\<`string`, `string`\>

Record mapping icon IDs to SVG strings

##### id

`string` = `'overlaySvg'`

Optional identifier for debugging

#### Returns

`OverlaySvg`

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

### run()

> **run**(`ctx`, `W`, `H`, `params`): `Promise`\<`void`\>

Defined in: ops/overlay-svg.ts:154

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
