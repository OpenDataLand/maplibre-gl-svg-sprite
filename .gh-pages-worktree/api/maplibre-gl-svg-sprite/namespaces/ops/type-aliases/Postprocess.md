[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Type Alias: Postprocess()

> **Postprocess** = (`ctx`, `w`, `h`, `params`) => `void` \| `Promise`\<`void`\>

Defined in: ops/base.ts:10

Function signature for canvas post-processing operations

## Parameters

### ctx

`CanvasRenderingContext2D`

Canvas 2D rendering context

### w

`number`

Width in CSS pixels

### h

`number`

Height in CSS pixels

### params

`Record`\<`string`, `string`\>

Query parameters from the image request

## Returns

`void` \| `Promise`\<`void`\>

void or Promise<void> for async operations
