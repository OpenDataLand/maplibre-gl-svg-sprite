/**
 * Interface representing MapLibre GL JS or compatible mapping library
 * with protocol registration capabilities
 */
export interface MapLibreLike {
  /** Register a custom protocol handler for resource loading */
  addProtocol: (name: string, handler: (request: { url: string }, callback: (err?: any, response?: { data?: ArrayBuffer | string | object | null }) => void) => any) => void;
  /** Remove a previously registered protocol handler */
  removeProtocol: (name: string) => void;
}

/**
 * Interface representing a MapLibre GL JS map instance or compatible
 * map object with image management capabilities
 */
export interface MapLike {
  /** Add an event listener */
  on: (type: string, handler: (e: { id: string }) => void) => void;
  /** Remove an event listener */
  off: (type: string, handler: (e: { id: string }) => void) => void;
  /** Add an image to the map's style */
  addImage: (name: string, image: any, options?: { pixelRatio?: number }) => void;
  /** Update an existing image in the map's style */
  updateImage?: (name: string, image: any, options?: { pixelRatio?: number }) => void;
  /** Remove an image from the map's style */
  removeImage?: (name: string) => void;
  /** Check if an image exists in the map's style */
  hasImage?: (name: string) => boolean;
  /** Trigger a map repaint */
  triggerRepaint?: () => void;
  /** Retrieve the map's canvas (MapLibre GL) */
  getCanvas?: () => HTMLCanvasElement;
  /** Fallback canvas reference for compat layers */
  canvas?: HTMLCanvasElement;
}
