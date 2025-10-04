[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Function: registerStyleImageMissingHandler()

> **registerStyleImageMissingHandler**(`map`, `options`): () => `void`

Defined in: missing-image.ts:49

Register a handler to auto-generate missing images with query parameters

Automatically handles image requests like `icon?color=#f00&width=24&height=24`

## Parameters

### map

[`MapLike`](../interfaces/MapLike.md)

MapLibre map instance

### options

[`MissingImageHandlerOptions`](../interfaces/MissingImageHandlerOptions.md)

Handler configuration options

## Returns

Function to unregister the handler

> (): `void`

### Returns

`void`

## Example

```typescript
const unregister = registerStyleImageMissingHandler(map, {
  svgIcons: { marker: '<svg>...</svg>' },
  debug: true
});
// Now map.addLayer can reference 'marker?color=red&width=24'
```
