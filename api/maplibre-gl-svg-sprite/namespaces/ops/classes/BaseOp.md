[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Abstract Class: BaseOp

Defined in: ops/base.ts:42

Base class for creating custom post-processing operations

Extend this class and implement the `run` method. Instance properties can store state.

## Example

```typescript
class CustomOp extends BaseOp {
  async run(ctx, w, h, params) {
    ctx.fillStyle = params.color || 'red';
    ctx.fillRect(0, 0, w, h);
  }
}
```

## Extended by

- [`SpriteTint`](SpriteTint.md)
- [`OverlaySvg`](OverlaySvg.md)
- [`OverlayText`](OverlayText.md)
- [`OverlayGrid`](OverlayGrid.md)

## Implements

- [`PostprocessOp`](../interfaces/PostprocessOp.md)

## Constructors

### Constructor

> **new BaseOp**(`id?`): `BaseOp`

Defined in: ops/base.ts:51

Create a new operation

#### Parameters

##### id?

`string`

Optional identifier for debugging

#### Returns

`BaseOp`

## Properties

### id?

> `optional` **id**: `string`

Defined in: ops/base.ts:44

Unique identifier or descriptive name

#### Implementation of

[`PostprocessOp`](../interfaces/PostprocessOp.md).[`id`](../interfaces/PostprocessOp.md#id)

## Methods

### run()

> `abstract` **run**(`ctx`, `w`, `h`, `params`): `void` \| `Promise`\<`void`\>

Defined in: ops/base.ts:61

Execute the post-processing operation

#### Parameters

##### ctx

`CanvasRenderingContext2D`

Canvas 2D rendering context

##### w

`number`

Width in CSS pixels

##### h

`number`

Height in CSS pixels

##### params

`Record`\<`string`, `string`\>

Query parameters from the image request

#### Returns

`void` \| `Promise`\<`void`\>

#### Implementation of

`PostprocessOp.run`
