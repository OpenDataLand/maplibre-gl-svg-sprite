import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerStyleImageMissingHandler } from '../missing-image';

// Mock the dependencies
vi.mock('../utils/image', () => ({
  svgToBitmap: vi.fn().mockResolvedValue({
    bitmap: { width: 24, height: 24 },
    width: 24,
    height: 24
  }),
  blobToImage: vi.fn().mockResolvedValue({
    width: 24,
    height: 24
  })
}));

vi.mock('../utils/params', () => ({
  parseQuery: vi.fn().mockReturnValue({ color: 'red', width: '24', height: '24' }),
  applySvgParams: vi.fn().mockImplementation((svg, params) => svg)
}));

describe('missing-image', () => {
  let mockMap: any;
  let mockCanvas: any;
  let mockContext: any;

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Mock canvas and context
    mockContext = {
      drawImage: vi.fn(),
      clearRect: vi.fn()
    };

    mockCanvas = {
      width: 24,
      height: 24,
      getContext: vi.fn().mockReturnValue(mockContext)
    };

    global.document.createElement = vi.fn().mockReturnValue(mockCanvas);

    // Mock map
    mockMap = {
      addImage: vi.fn(),
      hasImage: vi.fn().mockReturnValue(false),
      on: vi.fn(),
      off: vi.fn(),
      getPixelRatio: vi.fn().mockReturnValue(1),
      triggerRepaint: vi.fn()
    };
  });

  describe('registerStyleImageMissingHandler', () => {
    it('should register event handler on map', () => {
      const options = {
        svgIcons: { 'test-icon': '<svg width="24" height="24"><rect fill="blue"/></svg>' }
      };

      const unregister = registerStyleImageMissingHandler(mockMap, options);

      expect(mockMap.on).toHaveBeenCalledWith('styleimagemissing', expect.any(Function));
      expect(typeof unregister).toBe('function');
    });

    it('should return unregister function that removes handler', () => {
      const options = {};

      const unregister = registerStyleImageMissingHandler(mockMap, options);
      unregister();

      expect(mockMap.off).toHaveBeenCalledWith('styleimagemissing', expect.any(Function));
    });

    it('should handle image requests with query parameters', async () => {
      const options = {
        svgIcons: { 'test-icon': '<svg width="24" height="24"><rect fill="blue"/></svg>' }
      };

      registerStyleImageMissingHandler(mockMap, options);

      // Simulate the styleimagemissing event
      const handler = mockMap.on.mock.calls[0][1];
      const mockEvent = { id: 'test-icon?color=red&width=24&height=24' };

      await handler(mockEvent);

      expect(mockMap.addImage).toHaveBeenCalledWith(
        'test-icon?color=red&width=24&height=24',
        expect.anything(),
        expect.objectContaining({ pixelRatio: expect.any(Number) })
      );
    });

    it('should skip icons without query parameters (implementation detail)', async () => {
      const options = {
        svgIcons: { 'simple-icon': '<svg width="24" height="24"><rect fill="green"/></svg>' }
      };

      registerStyleImageMissingHandler(mockMap, options);

      const handler = mockMap.on.mock.calls[0][1];
      const mockEvent = { id: 'simple-icon' };

      await handler(mockEvent);

      // Should not add image because the handler only processes IDs with query params
      expect(mockMap.addImage).not.toHaveBeenCalled();
    });

    it('should skip unknown icons', async () => {
      const options = {
        svgIcons: { 'known-icon': '<svg width="24" height="24"><rect fill="green"/></svg>' }
      };

      registerStyleImageMissingHandler(mockMap, options);

      const handler = mockMap.on.mock.calls[0][1];
      const mockEvent = { id: 'unknown-icon?color=red' };

      await handler(mockEvent);

      expect(mockMap.addImage).not.toHaveBeenCalled();
    });

    it('should handle debug logging', async () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      const options = {
        svgIcons: { 'test-icon': '<svg width="24" height="24"><rect fill="blue"/></svg>' },
        debug: true
      };

      registerStyleImageMissingHandler(mockMap, options);

      const handler = mockMap.on.mock.calls[0][1];
      const mockEvent = { id: 'test-icon?color=red' };

      await handler(mockEvent);

      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });

    it('should support eager placeholder mode', async () => {
      const options = {
        svgIcons: { 'test-icon': '<svg width="24" height="24"><rect fill="blue"/></svg>' },
        eagerPlaceholder: true
      };

      registerStyleImageMissingHandler(mockMap, options);

      const handler = mockMap.on.mock.calls[0][1];
      const mockEvent = { id: 'test-icon?color=red' };

      await handler(mockEvent);

      // Should add image (placeholder first, then the real one)
      expect(mockMap.addImage).toHaveBeenCalled();
    });

    it('should register handler with protocol registry options', () => {
      const mockProtocolRegistry = {
        'sprite-key': {
          1: {
            json: { 'test-icon': { width: 24, height: 24, x: 0, y: 0 } },
            png: new ArrayBuffer(96)
          }
        }
      };

      const options = {
        protocolRegistry: mockProtocolRegistry,
        spriteKey: 'sprite-key'
      };

      const unregister = registerStyleImageMissingHandler(mockMap, options);

      // Should register the handler
      expect(mockMap.on).toHaveBeenCalledWith('styleimagemissing', expect.any(Function));
      expect(typeof unregister).toBe('function');
    });

    it('should handle custom SVG transform function', async () => {
      const mockTransform = vi.fn().mockImplementation((svg, params) => svg.replace('blue', params.color || 'blue'));

      const options = {
        svgIcons: { 'test-icon': '<svg width="24" height="24"><rect fill="blue"/></svg>' },
        transformSvg: mockTransform
      };

      registerStyleImageMissingHandler(mockMap, options);

      const handler = mockMap.on.mock.calls[0][1];
      const mockEvent = { id: 'test-icon?color=red' };

      await handler(mockEvent);

      expect(mockTransform).toHaveBeenCalledWith(
        '<svg width="24" height="24"><rect fill="blue"/></svg>',
        expect.objectContaining({ color: 'red', width: '24', height: '24' })
      );
    });

    it('should handle custom postprocess function', async () => {
      const mockPostprocess = vi.fn();

      const options = {
        svgIcons: { 'test-icon': '<svg width="24" height="24"><rect fill="blue"/></svg>' },
        postprocessCanvas: mockPostprocess
      };

      registerStyleImageMissingHandler(mockMap, options);

      const handler = mockMap.on.mock.calls[0][1];
      const mockEvent = { id: 'test-icon?color=red' };

      await handler(mockEvent);

      expect(mockPostprocess).toHaveBeenCalledWith(
        mockContext,
        24,
        24,
        expect.objectContaining({ color: 'red', width: '24', height: '24' })
      );
    });
  });
});