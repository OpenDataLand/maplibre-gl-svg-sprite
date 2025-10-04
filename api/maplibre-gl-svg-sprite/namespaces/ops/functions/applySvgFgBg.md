[**maplibre-gl-svg-sprite v0.1.0**](../../../../README.md)

***

# Function: applySvgFgBg()

> **applySvgFgBg**(`svg`, `fg?`, `bg?`, `opts?`): `string`

Defined in: ops/svg-fg-bg.ts:17

Apply foreground and background colors to SVG elements with data-fg/data-bg attributes

Injects CSS rules to style elements marked with `data-fg` or `data-bg` attributes.

## Parameters

### svg

`string`

SVG markup string

### fg?

`string`

Foreground color (applied to elements with data-fg attribute)

### bg?

`string`

Background color (applied to elements with data-bg attribute)

### opts?

#### debug?

`boolean`

## Returns

`string`

Modified SVG string with injected styles

## Example

```typescript
const svg = '<svg><path data-fg="true"/><rect data-bg="true"/></svg>';
const colored = applySvgFgBg(svg, '#ff0000', '#0000ff');
```
