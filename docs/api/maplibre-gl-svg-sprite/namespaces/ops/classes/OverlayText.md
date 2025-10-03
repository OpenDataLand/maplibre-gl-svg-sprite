[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Class: OverlayText

Defined in: ops/overlay-text.ts:16

Post-processing operation to overlay text on an image

Supports query parameters: text, label, fontSize, fontWeight, fontFamily,
textColor, fill, textStroke, textStrokeWidth, textPadding, textAnchor, anchor, tx, ty

## Example

```typescript
const op = new OverlayText();
// Use with params: ?text=Hello&fontSize=20&textColor=red
```

## Extends

- [`BaseOp`](BaseOp.md)

## Constructors

### Constructor

> **new OverlayText**(`id`): `OverlayText`

Defined in: ops/overlay-text.ts:22

Create a new text overlay operation

#### Parameters

##### id

`string` = `'overlayText'`

Optional identifier for debugging

#### Returns

`OverlayText`

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

Defined in: ops/overlay-text.ts:23

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
