// Minimal SIM demo with two clean patterns:
// 1) Route shields as centered badges ($badge)
// 2) Amenity icons as recolored single SVGs ($svg)

const { registerNamedImageHandlers, buildDefaultNamedRoutes, iconExpr } = window.MaplibreSvgSprite;
const maplibregl = window.maplibregl;

// Tiny SVG library for demo
const svgIcons = {
    shield: `<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <path data-bg d="M12 8h40l2 16c0 15-13 26-22 30-9-4-22-15-22-30z" fill="#0f4c81"/>
      <path data-fg d="M14 10h36l1.5 15.5C51 38 41 46 32 50c-9-4-19-12-19.5-24.5z" fill="#ffffff"/>
    </svg>`,
    tree: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path data-fg d="M12 2 20 16h-5l4 6H5l4-6H4l8-14z" fill="#2e7d32" />
    </svg>`,
    tent: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path data-fg d="M2 20h20l-7-12-3 5-3-5z" fill="#6d4c41" />
    </svg>`,
    water: `<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path data-fg d="M3 18c3 0 3-2 6-2s3 2 6 2 3-2 6-2" fill="none" stroke="#2196f3" stroke-width="2" stroke-linecap="round"/>
    </svg>`
};

// Built-in routes ($text, $svg, $badge, $badgeInside/$badgeStacked, $grid)
const routes = buildDefaultNamedRoutes(svgIcons);

// 1) Route shields (inside) — bold and extremely clear
const shields = [
    { id: 'rt1', coords: [-74.08, 40.82], route: '1' },
    { id: 'rt9', coords: [-74.00, 40.82], route: '9' },
    { id: 'rt95', coords: [-73.92, 40.82], route: '95' }
];

// 2) Amenity icons row — recolor single SVGs
const amenities = [
    { id: 'camp', coords: [-74.12, 40.78], icon: 'tent', color: '#8d5524' },
    { id: 'trail', coords: [-74.04, 40.78], icon: 'tree', color: '#2e7d32' },
    { id: 'water', coords: [-73.96, 40.78], icon: 'water', color: '#2196f3' }
];

const fc = {
    type: 'FeatureCollection',
    features: [
        ...shields.map(p => ({ type: 'Feature', properties: { kind: 'shield', ...p }, geometry: { type: 'Point', coordinates: p.coords } })),
        ...amenities.map(p => ({ type: 'Feature', properties: { kind: 'amenity', ...p }, geometry: { type: 'Point', coordinates: p.coords } }))
    ]
};

const map = new maplibregl.Map({
    container: 'map',
    style: {
        version: 8,
        sources: {
            osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap contributors'
            },
            pts: { type: 'geojson', data: fc }
        },
        layers: [
            { id: 'bg', type: 'raster', source: 'osm' },
            {
                id: 'shields',
                type: 'symbol',
                source: 'pts',
                filter: ['==', ['get', 'kind'], 'shield'],
                layout: {
                    'icon-image': iconExpr('$badge', { width: 56, height: 56 })
                        .overlay('shield', { ofg: '#ffffff', obg: '#003366' })
                        .text(['get', 'route'], { textAnchor: 'center', fontSize: 22, textStrokeWidth: 4, textAutoColor: true })
                        .build(),
                    'icon-allow-overlap': true
                }
            },
            {
                id: 'amenities',
                type: 'symbol',
                source: 'pts',
                filter: ['==', ['get', 'kind'], 'amenity'],
                layout: {
                    'icon-image': iconExpr('$svg', { width: 44, height: 44 })
                        .overlay(['get', 'icon'])
                        .param('fg', ['get', 'color'])
                        .build(),
                    'icon-allow-overlap': true
                }
            }
        ]
    },
    center: [-74.0, 40.80],
    zoom: 11
});

const unregister = registerNamedImageHandlers(map, routes, { debug: false });
map.on('remove', unregister);