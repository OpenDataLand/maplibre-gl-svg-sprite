[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Interface: MapLike

Defined in: types/maplibre-like.ts:16

Interface representing a MapLibre GL JS map instance or compatible
map object with image management capabilities

## Properties

### on()

> **on**: (`type`, `handler`) => `void`

Defined in: types/maplibre-like.ts:18

Add an event listener

#### Parameters

##### type

`string`

##### handler

(`e`) => `void`

#### Returns

`void`

***

### off()

> **off**: (`type`, `handler`) => `void`

Defined in: types/maplibre-like.ts:20

Remove an event listener

#### Parameters

##### type

`string`

##### handler

(`e`) => `void`

#### Returns

`void`

***

### addImage()

> **addImage**: (`name`, `image`, `options?`) => `void`

Defined in: types/maplibre-like.ts:22

Add an image to the map's style

#### Parameters

##### name

`string`

##### image

`any`

##### options?

###### pixelRatio?

`number`

#### Returns

`void`

***

### updateImage()?

> `optional` **updateImage**: (`name`, `image`, `options?`) => `void`

Defined in: types/maplibre-like.ts:24

Update an existing image in the map's style

#### Parameters

##### name

`string`

##### image

`any`

##### options?

###### pixelRatio?

`number`

#### Returns

`void`

***

### removeImage()?

> `optional` **removeImage**: (`name`) => `void`

Defined in: types/maplibre-like.ts:26

Remove an image from the map's style

#### Parameters

##### name

`string`

#### Returns

`void`

***

### hasImage()?

> `optional` **hasImage**: (`name`) => `boolean`

Defined in: types/maplibre-like.ts:28

Check if an image exists in the map's style

#### Parameters

##### name

`string`

#### Returns

`boolean`

***

### triggerRepaint()?

> `optional` **triggerRepaint**: () => `void`

Defined in: types/maplibre-like.ts:30

Trigger a map repaint

#### Returns

`void`
