[**maplibre-gl-svg-sprite v0.1.0**](../README.md)

***

# Interface: MapLibreLike

Defined in: types/maplibre-like.ts:5

Interface representing MapLibre GL JS or compatible mapping library
with protocol registration capabilities

## Properties

### addProtocol()

> **addProtocol**: (`name`, `handler`) => `void`

Defined in: types/maplibre-like.ts:7

Register a custom protocol handler for resource loading

#### Parameters

##### name

`string`

##### handler

(`request`, `callback`) => `any`

#### Returns

`void`

***

### removeProtocol()

> **removeProtocol**: (`name`) => `void`

Defined in: types/maplibre-like.ts:9

Remove a previously registered protocol handler

#### Parameters

##### name

`string`

#### Returns

`void`
