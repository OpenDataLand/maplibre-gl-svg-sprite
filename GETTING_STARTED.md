# Getting Started with maplibre-gl-svg-sprite

Get dynamic, type-safe map markers running in 5 minutes! 🚀

## Installation

```bash
npm install maplibre-gl-svg-sprite maplibre-gl
```

## Quick Start

### 1. Create Your First Marker

```typescript
import maplibregl from 'maplibre-gl';
import { registerSVGProtocol, buildSvgUrl, ops } from 'maplibre-gl-svg-sprite';

// Define your SVG icon
const icons = {
  marker: `<svg width="24" height="24" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill="#3FB1CE"/>
    <circle cx="12" cy="12" r="5" fill="#fff"/>
  </svg>`
};

// Register the svg:// protocol
registerSVGProtocol(maplibregl, 'svg', icons, {
  postprocessCanvas: ops.overlayText()
});

// Create a type-safe marker URL
const markerUrl = buildSvgUrl({
  icon: 'marker',
  width: 44,
  height: 44,
  pixelRatio: 2,
  bg: '#ffffff',
  fg: '#d35400',
  text: 'NYC',
  fontSize: 18,
  textColor: '#d35400'
});

// Load and use the marker
map.loadImage(markerUrl, (err, image) => {
  if (err) throw err;
  map.addImage('custom-marker', image);
});
```

### 2. Use in Your Map Style

```javascript
{
  id: 'markers',
  type: 'symbol',
  source: 'places',
  layout: {
    'icon-image': 'custom-marker',
    'icon-allow-overlap': true
  }
}
```

## Three Ways to Use This Library

### Option 1: Type-Safe URLs (Recommended! ⭐)

Best for: Dynamic markers with per-feature customization

```typescript
import { buildSvgUrl } from 'maplibre-gl-svg-sprite';

// Full autocomplete and type checking!
const url = buildSvgUrl({
  icon: 'marker',
  width: 44,
  height: 44,
  text: 'JFK',
  textColor: '#00499c'
});
```

**Pros:**
- ✅ Type-safe: catches errors at compile time
- ✅ Autocomplete: IDE shows all available options
- ✅ No URL encoding headaches
- ✅ Clean, readable code

### Option 2: Fluent Builder

Best for: Progressive customization, method chaining

```typescript
import { svgUrl } from 'maplibre-gl-svg-sprite';

const url = svgUrl('marker')
  .size(44)
  .colors({ fg: '#ff0000', bg: '#ffffff' })
  .text('EWR', { fontSize: 18, textColor: '#ff0000' })
  .build();
```

**Pros:**
- ✅ Discoverable API
- ✅ Easy to read and modify
- ✅ Chain only what you need

### Option 3: Static Sprites

Best for: Fixed icons, maximum performance

```typescript
import { registerSpriteFromIcons } from 'maplibre-gl-svg-sprite';

await registerSpriteFromIcons(
  maplibregl,
  'sprite',
  'mypack',
  icons,
  [1, 2], // 1x and 2x for HiDPI
  { oneShot: true }
);

// In your style:
{ sprite: 'sprite://mypack' }
```

**Pros:**
- ✅ Fastest rendering (GPU-accelerated)
- ✅ Lowest memory usage
- ✅ One request for all icons

**Cons:**
- ❌ Can't change per feature
- ❌ Fixed at style load time

## Common Use Cases

### Airport Code Markers

```typescript
const airportUrl = buildSvgUrl({
  icon: 'marker',
  width: 44,
  height: 44,
  pixelRatio: 2,    // HiDPI support
  bg: '#ffffff',
  fg: '#00499c',
  text: 'JFK',
  fontSize: 18,
  textColor: '#00499c',
  textStrokeWidth: 0  // Clean text without outline
});
```

### Numbered Waypoints

```typescript
function createWaypoint(number) {
  return buildSvgUrl({
    icon: 'circle',
    width: 32,
    height: 32,
    text: String(number),
    fontSize: 16,
    textColor: '#ffffff',
    fontWeight: 'bold',
    bg: '#0078d4'
  });
}

// Create waypoints 1-10
for (let i = 1; i <= 10; i++) {
  const url = createWaypoint(i);
  map.loadImage(url, (err, image) => {
    map.addImage(`waypoint-${i}`, image);
  });
}
```

### Category Icons

```typescript
const categories = {
  restaurant: { icon: 'food', color: '#ff6b6b' },
  hotel: { icon: 'bed', color: '#51cf66' },
  gas: { icon: 'fuel', color: '#339af0' }
};

Object.entries(categories).forEach(([name, { icon, color }]) => {
  const url = buildSvgUrl({
    icon,
    width: 40,
    height: 40,
    fg: color,
    pixelRatio: 2
  });

  map.loadImage(url, (err, image) => {
    map.addImage(`poi-${name}`, image);
  });
});
```

## TypeScript Support

Full type safety and autocomplete:

```typescript
import type { SvgUrlParams } from 'maplibre-gl-svg-sprite';

// All parameters are typed!
const params: SvgUrlParams = {
  icon: 'marker',     // Required
  width: 44,          // Optional, number
  height: 44,         // Optional, number
  pixelRatio: 2,      // Optional, number
  text: 'ABC',        // Optional, string
  fontSize: 18,       // Optional, number
  textColor: '#fff',  // Optional, string
  textAnchor: 'center' // Optional, specific string union
};

const url = buildSvgUrl(params);
```

## Performance Tips

### 1. Cache Generated URLs

```typescript
const urlCache = new Map<string, string>();

function getCachedMarkerUrl(code: string, color: string) {
  const key = `${code}-${color}`;

  if (!urlCache.has(key)) {
    urlCache.set(key, buildSvgUrl({
      icon: 'marker',
      text: code,
      textColor: color,
      width: 44,
      height: 44
    }));
  }

  return urlCache.get(key)!;
}
```

### 2. Use pixelRatio: 2 for HiDPI

```typescript
buildSvgUrl({
  icon: 'marker',
  width: 44,
  height: 44,
  pixelRatio: window.devicePixelRatio || 2  // Sharp on Retina
});
```

### 3. Batch Image Loading

```typescript
const markers = ['JFK', 'LGA', 'EWR'];
const promises = markers.map(code =>
  new Promise((resolve, reject) => {
    const url = buildSvgUrl({
      icon: 'marker',
      text: code,
      width: 44,
      height: 44
    });

    map.loadImage(url, (err, image) => {
      if (err) reject(err);
      else {
        map.addImage(`airport-${code}`, image);
        resolve(image);
      }
    });
  })
);

await Promise.all(promises);
// All markers loaded!
```

## Customization Guide

### Colors

```typescript
{
  // Background color (outer circle)
  bg: '#ffffff',

  // Foreground color (inner circle)
  fg: '#d35400',

  // Text color
  textColor: '#d35400',

  // Text stroke (outline)
  textStroke: '#000000',
  textStrokeWidth: 2
}
```

### Typography

```typescript
{
  fontSize: 18,
  fontWeight: 'bold',        // 'normal', 'bold', '600', etc.
  fontFamily: 'Arial, sans-serif',
  fontStyle: 'normal'        // 'normal', 'italic'
}
```

### Positioning

```typescript
{
  // Text anchor point
  textAnchor: 'center',      // 'center', 'top', 'bottom', 'left', 'right'
                             // or combinations: 'top-left', 'bottom-right', etc.

  // Manual offsets (pixels)
  tx: 0,  // Horizontal offset
  ty: 0   // Vertical offset
}
```

### Advanced: Overlays

```typescript
import { registerSVGProtocol, ops } from 'maplibre-gl-svg-sprite';

// Combine multiple operations
registerSVGProtocol(maplibregl, 'svg', icons, {
  postprocessCanvas: ops.chain(
    ops.overlaySvg(icons),      // Add SVG overlays
    ops.overlayText(),          // Add text
    ops.overlayGrid(icons)      // Add icon grids
  )
});
```

## Next Steps

- 📚 **[API Reference](docs/api/)** - Complete API documentation
- 🎯 **[Examples](examples/)** - Working demos

## Troubleshooting

### Icons look blurry on Retina displays
```typescript
// Add pixelRatio: 2
buildSvgUrl({ icon: 'marker', width: 44, height: 44, pixelRatio: 2 });
```

### Text is hard to read
```typescript
// Remove text stroke and use solid color
buildSvgUrl({
  icon: 'marker',
  text: 'ABC',
  textColor: '#ffffff',
  textStrokeWidth: 0  // No outline
});
```

### Icons not showing up
```typescript
// Check that you've registered the protocol
registerSVGProtocol(maplibregl, 'svg', icons, {
  postprocessCanvas: ops.overlayText()
});

// And loaded the image
map.loadImage(url, (err, image) => {
  if (err) console.error('Failed to load:', err);
  map.addImage('my-marker', image);
});
```

### TypeScript errors
```typescript
// Make sure you import types
import type { SvgUrlParams } from 'maplibre-gl-svg-sprite';
```

## Get Help

- 🐛 [Report a bug](https://github.com/opendataland/maplibre-gl-svg-sprite/issues)
- 💬 [Ask a question](https://github.com/opendataland/maplibre-gl-svg-sprite/discussions)
- 📖 [Read the docs](https://opendataland.github.io/maplibre-gl-svg-sprite/)

---

**Ready to build amazing maps?** Start with the [RECIPES.md](RECIPES.md) for real-world examples! 🗺️✨
