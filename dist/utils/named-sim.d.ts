import type { MapLike } from '../types/maplibre-like.js';
import type { Postprocess } from '../ops/base.js';
/** Options for the named styleimagemissing router */
export interface NamedSIMOptions {
    debug?: boolean;
    /** Render backing canvas at device pixel ratio (default: true) */
    dprBackBuffer?: boolean;
}
/** A route entry can be a Postprocess function or an object with an optional measurer */
export type NamedRoute = Postprocess | {
    postprocess: Postprocess;
    measure?: (p: Record<string, string>) => {
        width: number;
        height: number;
    };
};
/**
 * Register a named styleimagemissing router.
 * Each route handles requests where the image id base (before '?') matches the route name.
 * Supports a fallback '*' route to catch unmatched names.
 */
export declare function registerNamedImageHandlers(map: MapLike, routes: Record<string, NamedRoute>, opts?: NamedSIMOptions): () => void;
/** Build default named routes using a reserved '$' prefix to avoid collisions */
export declare function buildDefaultNamedRoutes(svgIcons: Record<string, string>): Record<string, NamedRoute>;
