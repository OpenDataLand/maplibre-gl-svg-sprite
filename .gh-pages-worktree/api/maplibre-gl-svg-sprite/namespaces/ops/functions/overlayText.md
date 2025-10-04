[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: overlayText()

> **overlayText**(): [`Postprocess`](../type-aliases/Postprocess.md)

Defined in: ops/overlay-text.ts:73

Create a text overlay postprocess function

Helper function that returns a Postprocess function for backwards compatibility.

## Returns

[`Postprocess`](../type-aliases/Postprocess.md)

Postprocess function that overlays text

## Example

```typescript
const postprocess = overlayText();
// Use in registerStyleImageMissingHandler
```
