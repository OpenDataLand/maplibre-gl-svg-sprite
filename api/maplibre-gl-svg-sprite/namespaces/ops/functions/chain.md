[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: chain()

> **chain**(...`ops`): [`Postprocess`](../type-aliases/Postprocess.md)

Defined in: ops/base.ts:106

Compose multiple operations into a single Postprocess function

Operations are executed sequentially in the order provided.

## Parameters

### ops

...([`PostprocessOp`](../interfaces/PostprocessOp.md) \| [`Postprocess`](../type-aliases/Postprocess.md))[]

Array of operations (instances or plain functions)

## Returns

[`Postprocess`](../type-aliases/Postprocess.md)

Composed Postprocess function

## Example

```typescript
const composed = chain(
  new GridOp(),
  new TextOp(),
  (ctx, w, h) => { ctx.globalAlpha = 0.5; }
);
```
