[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Class: SpriteTint

Defined in: ops/sprite-tint.ts:36

Post-processing operation to apply a color tint to an image

Supports query parameters: color, tint, tintColor

## Example

```typescript
const op = new SpriteTint();
// Use with params: ?color=red or ?tint=#ff0000
```

## Extends

- [`BaseOp`](BaseOp.md)

## Constructors

### Constructor

> **new SpriteTint**(`id`): `SpriteTint`

Defined in: ops/sprite-tint.ts:42

Create a new sprite tint operation

#### Parameters

##### id

`string` = `'spriteTint'`

Optional identifier for debugging

#### Returns

`SpriteTint`

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

> **run**(`ctx`, `w`, `h`, `params`): `void`

Defined in: ops/sprite-tint.ts:44

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

`void`

#### Overrides

[`BaseOp`](BaseOp.md).[`run`](BaseOp.md#run)
